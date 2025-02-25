import cryptoJs from 'crypto-js';
import { IFetchRequestParams } from './interfaces/function';
import { ILoginResponse } from './interfaces/auth';
import Swal from 'sweetalert2';
import moment from 'moment';



const apiUrl = import.meta.env.VITE_HOST;

/**
 * Add error highlighting to select component
 * @param {*} id field identifier 
 * @param {*} value field value
 */
export const addErrorToSelectedField = (id:string, value:string | number)=>{
	let field = document.getElementById(id);
    
	if(field !== null){
		if(value === ''){
			field.classList.add('error-field');
			return;
		}

		field.classList.remove('error-field');
		
	}
}

/*
* gets the value of the variable in browser sessionstorage
* @param {string | name} variable name
* @return string
*/
export const decript = (name: string)=>{
	let value = '';
	let sessions = Object.keys(sessionStorage);

	if(sessions.length > 0){
		sessions.forEach(key => {
			let bytes = cryptoJs.AES.decrypt(key, import.meta.env.VITE_SECRET);
			let decriptedName = bytes.toString(cryptoJs.enc.Utf8);

			if(decriptedName === name){
				let encriptedValue = sessionStorage.getItem(key) || "";            
				let bytesValue = cryptoJs.AES.decrypt(encriptedValue, import.meta.env.VITE_SECRET);
				value = bytesValue.toString(cryptoJs.enc.Utf8);            
			}
		});
	}

	return value;
}

/*
* Encrypt the variable and save it in the browser's sessionstorage
* @param {string | name} variable's name
* @param {string | value} variable's value
*/
export const encript = (name:string, value:string)=>{
	let found = findInStorage(name);

	let encriptedValue = cryptoJs.AES.encrypt(value, import.meta.env.VITE_SECRET).toString();
	let encriptedName = cryptoJs.AES.encrypt(name, import.meta.env.VITE_SECRET).toString();

	if(found !== ''){
		encriptedName = found;
	}

	sessionStorage.setItem(encriptedName, encriptedValue);
}

/**
 * General function to call API services
 * @param {string | url} url endpoint
 * @param {string | method} service method (GET, POST, PUT, DELETE, PATCH)
 * @param {object | obj} json object containing data from a form
 * @param {bool | requireToken} flag to verify if token is used or not, it is used when you want to 
 *                              consult a service that requires the user to be logged in
 * @param {bool | sendFile} flag to check if a file is being sent (jpg, pdf) from form
 * @param {bool | printFile} flag to check if a file is going to be printing
 * @return {object | response} json response 
 * */
export const fetchRequest = async <T>({
    url,
    method = 'GET',
    body = null,
    requireToken = true,
    sendFile = false,
    printFile = false
}: IFetchRequestParams): Promise<T> =>{
    const token = decript('token');

    let headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    if(requireToken && token){
        headers['Authorization'] = 'Bearer ' + token;

        if(printFile){ //if you print file
            headers['Accept'] = 'application/pdf';    
        }
    }

    if(sendFile){
        delete headers['Content-Type'];
    }
    

    let bodyObject: string | BodyInit | null = body !== null ? JSON.stringify(body) : null;

    if(sendFile || printFile){
        bodyObject = body;
    }

    const fetchOptions: RequestInit = {
        method,
        headers: new Headers(headers),
        body: bodyObject
    }

    try{
        const res = await fetch(apiUrl + url, fetchOptions);

        if(res.ok){
            if(printFile){
                const blob = await res.blob();

                return { file: blob } as unknown as T;
            }

            const jsonResponse = await res.json();

            return jsonResponse as T;
        }else{
            const errorText = await res.json();

            return { success:false,
                message: errorText?.message,
               data:''} as unknown as T;
        }
    }catch(error: any){
        console.log(error)
        return {
            success:false,
            message:'Error de conexión, contacte al administrador',
           data:''
        } as unknown as T
    }
}

/*
* Find a variable in sessionstorage
* @param {string | name} variable's name
* @return string
*/
const findInStorage = (name:string)=>{
	let value = '';
	let sessions = Object.keys(sessionStorage);

	if(sessions.length > 0){
		sessions.forEach((key) => {
			let bytes = cryptoJs.AES.decrypt(key, import.meta.env.VITE_SECRET);
			let decriptedName = bytes.toString(cryptoJs.enc.Utf8);

			if(decriptedName === name){
				value = key;
			}
		});
	}

	return value;
}

/**
 * Tansform price number into price format
 * @param price 
 * @returns 
 */
export const formatPrice = (price: string | number)=>{
    return parseInt(price.toString()).toLocaleString('en-US', {style:'currency', currency:'USD'});
}

/**
 * Calculate age
 * @param date 
 * @returns 
 */
export const calculateAge = (date: string)=>{
    let today = moment();
    let birthdate = moment(date);

    let years = today.diff(birthdate, 'years');

    return years;
}

/*
* Verify if user is autheticated
* return boolean
*/
export const isAuth = ()=>{
	let auth = false;

	let find = findInStorage('token');
	if(find !== ''){
		auth = true;
	}
    
    return auth;
}

/**
 * verify if field is email
 * @param {string} value 
 * @returns boolean
 */
export const isEmail = (value:string)=>{
    // Regular expression to validate an email address
    var patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //Check if the email matches the pattern
    return patron.test(value);
}

/**
 * transform input content into format phone
 * @param value 
 * @returns 
 */
export const isPhone = (value: string)=>{
    // Format value of phone field to XXX-XXX-XXXX
    let format = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);

    if(format !== null){
        value = !format[2] ? format[1] : `${format[1]}-${format[2]}${format[3] ? '-' + format[3] : ''}`;
    }

    return value;
}

/**
 * Verify if form is valid
 * @param element 
 * @returns 
 */
export const isValidForm = (element: string): boolean =>{
    
    let ctrls: NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = document.querySelectorAll('input');

    const select = document.querySelector(element);
    let isFormValid =  true;
    if(select){
        ctrls = select.querySelectorAll('input, select, textarea') as NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;   

        ctrls.forEach((ctrl) => {
            const ariaRequired = ctrl.getAttribute('aria-required');

            if(ariaRequired !== null && ariaRequired === 'true'){
                const name = ctrl.id.replace('select_', '');
                
				const control = document.getElementsByName(name) as NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
				let value = '';
				
				if(control.length > 0){
					value = control[0].value;
				}
				
				if(value === ''){
                    addErrorToSelectedField(name, value);
					isFormValid = false;
				}
            }else if(ctrl.required){
                if(ctrl.value === ''){
                    isFormValid = showCtrError(ctrl.id, ctrl.value);
                }
            }
        });
    }

    return isFormValid;
}

/**
 * Normalize a given string to camelCase notation
 */
export const normalizeString = (text:string)=>{
    let transformText = text.toLocaleLowerCase()
                            .replace(/\s+/g, '_');
    return transformText;
}

/**
 * Stores login variables in browser storage
 * @param {object} response response login
 */
export const setDataStorage = (response: ILoginResponse | undefined)=>{
    encript('user', JSON.stringify(response?.user));
}

/**
 * Add error-field class 
 * @param id 
 * @param value 
 * @returns 
 */
export const showCtrError = (id: string, value: string)=>{
    let valid = true;
    
    if(value === ''){
        document.getElementById(id)?.classList.add("error-field");

        valid = false;
    }else{
        document.getElementById(id)?.classList.remove("error-field");
    }

    return valid;
}

/**
 * Displays confirmation message to delete a record
 * @param confirmFuntion function to be executed when confirming
 * @param cancelFunction function to be excecuted when cancel
 * @param value value sent to confirmation function 
 */
export const swalConfirm = ({
	title = 'Alert',
	confirmFunction,
	cancelFunction,
	value = -1,
	text,
	confirmText
}:{
    title?: string,
    confirmFunction:(value: number)=>void,
    cancelFunction?:(value?: number | null)=>void,
    value?: number,
    text: string,
    confirmText: string
})=>{
	Swal.fire({
		title: title,
		text:text,
		icon:'warning',
		showConfirmButton: true,
		showCancelButton: true,
		confirmButtonText: confirmText,
		confirmButtonColor: 'var(--rs-color-red)',
		cancelButtonText: 'No, Cancelar',
	}).then(result =>{
		if(result.isConfirmed){
			confirmFunction(value);
		}else{
			if(cancelFunction){
				cancelFunction(value);
			}
		}
	});
}