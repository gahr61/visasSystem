import React, { useEffect, useState } from "react";
import Input from "../../common/Input";
import SelectForm from "../../common/Select";
import { formatPrice } from "../../../utils/functions";
import { conceptsPassportMinimumPayment, conceptsVisaMinimumPayment, conceptsVisaPrices } from "../../../utils/services/concepts";

const TableDetailsPayment = ({
    dataPayment,
    setDataPayment
}:{
    dataPayment:any,
    setDataPayment:(e:any)=>void
})=>{
    const columns = ['Trámite', 'Concepto', 'Cantidad', 'Precio', 'Total'];
    const [showDetails, setShowDetails] = useState(false);
    const [concepts, setConcepts]                     = useState<any[]>([]);
    const [passportMinPayment, setPassportMinPayment] = useState<any>(null);
    const [visaMinPayment, setVisaMinPayment]         = useState<any>(null);

    const isPassportFlow = dataPayment.procedures.some((item:any)=>item.procedure === 'Pasaporte');

    const onLoad = async ()=>{
        const [responsePrices, responsePassportMin, responseVisaMin] = await Promise.all([
            conceptsVisaPrices(),
            conceptsPassportMinimumPayment(),
            conceptsVisaMinimumPayment()
        ]);
        if(responsePrices && responsePrices.success){
            setConcepts(responsePrices.data);
        }
        if(responsePassportMin && responsePassportMin.success){
            setPassportMinPayment(responsePassportMin.data);
        }
        if(responseVisaMin && responseVisaMin.success){
            setVisaMinPayment(responseVisaMin.data);
        }
    }

    const applyPassportMinimumPayment = ()=>{
        if(!passportMinPayment) return;

        const index = dataPayment.procedures.findIndex((item:any)=>item.procedure === 'Pasaporte');
        if(index === -1 || dataPayment.procedures[index].concept === passportMinPayment.id) return;

        const amount = dataPayment.procedures[index].amount;
        const total  = amount * parseFloat(passportMinPayment.price);

        const procedures = dataPayment.procedures.map((item:any, i:number)=>{
            if(i !== index) return item;

            return {
                ...item,
                concept: passportMinPayment.id,
                price: passportMinPayment.price,
                total: total
            };
        });

        setDataPayment({
            ...dataPayment,
            procedures,
            options:{
                ...dataPayment.options,
                minPayment: true,
                otherPayment: false,
                minPrice: total,
                otherPrice: total,
                totalProcedure: total,
                totalPay: 0,
                totalPerPay: total
            }
        });
    }

    useEffect(()=>{
        applyPassportMinimumPayment();
    }, [passportMinPayment, dataPayment.procedures]);

    const onSelectConcept = (value: string, index: number)=>{
        let findPrice;
        let total = 0;
        let amount = 0;
        const minPayment = parseFloat(visaMinPayment?.price ?? 0);

        const procedures = dataPayment.procedures.map((item:any, i: number) =>{
            if(i === index){
                amount = item.amount;

                findPrice = concepts.find(obj => obj.value === value);

                total = findPrice ? item.amount * parseFloat(findPrice.price) : 0
                item = {
                    ...item,
                    concept: value,
                    price: findPrice ? findPrice.price : 0,
                    total: total
                }
            }

            return item;
        })

        let data = {
            ...dataPayment,
            procedures: procedures,
            options:{
                ...dataPayment.options,
                minPayment: true,
                otherPayment: false,
                minPrice: amount * minPayment,
                otherPrice: amount * minPayment,
                totalProcedure: total,
                totalPay:  dataPayment.options.minPayment ? total - (amount * minPayment):
                dataPayment.options.otherPayment ? total - dataPayment.options.otherPrice : 0,
                totalPerPay: dataPayment.options.minPayment ? (amount * minPayment):
                    dataPayment.options.otherPayment ? dataPayment.options.otherPrice : 0
            }
        }

        setDataPayment(data);

        setShowDetails(value !== '');

    }

    const onCheckOption = (e: React.FormEvent<HTMLInputElement>)=>{
        const {name, checked} = e.currentTarget;

        let data = {
            ...dataPayment,
            options:{
                ...dataPayment.options,
                minPayment: name === 'otherPayment' ? false : checked,
                otherPayment: name === 'minPayment' ? false : checked,
                otherPrice: dataPayment.options.minPrice
            }
        }

        setDataPayment(data);
    }

    const onChangePrice = (e: React.FormEvent<HTMLInputElement>) => {
        const {value} = e.currentTarget;

        let data = {
            ...dataPayment,
            options:{
                ...dataPayment.options,
                otherPrice: value,
                totalPay: value !== '' ? dataPayment.options.totalProcedure - parseFloat(value) : 0,
                totalPerPay: value !== '' ? value : 0
            }
        }
        setDataPayment(data);
    }

    const onChangeObservation = (e: React.FormEvent<HTMLTextAreaElement>) => {
        setDataPayment({
            ...dataPayment,
            options:{
                ...dataPayment.options,
                paymentObservation: e.currentTarget.value
            }
        });
    }

    const belowMinPayment = dataPayment.options.otherPayment
        && dataPayment.options.otherPrice !== ''
        && parseFloat(dataPayment.options.otherPrice) < dataPayment.options.minPrice;

    useEffect(()=>{ onLoad(); }, []);

    return(
        <table className="min-w-full divide-y divide-gray-200">
            <thead>
                <tr>
                    {columns.map((column, index)=>
                        <th scope="col" className="text-start px-6 py-2 font-medium text-gray-500" key={index}>{column}</th>
                    )}
                </tr>
            </thead>
            <tbody>
                {dataPayment.procedures.map((procedure:any, index:number)=>
                    <tr key={index} className="border-b">
                        <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-80">{procedure.procedure}</td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-80">
                            {procedure.procedure === 'Visa' && (
                                <SelectForm
                                    id="concept"
                                    value={procedure.concept}
                                    options={concepts}
                                    handleChange={(value)=>onSelectConcept(value, index)}
                                    required
                                />
                            )}
                            {procedure.procedure === 'Pasaporte' && (
                                <span>{passportMinPayment?.name}</span>
                            )}
                        </td>
                        <td className="text-start px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-80">{procedure.amount}</td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-80">
                            {procedure.price > 0 && formatPrice(procedure.price)}
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-80 text-end">
                            {procedure.total > 0 && formatPrice(procedure.total)}
                        </td>
                    </tr>
                )}
                {isPassportFlow ? (
                    passportMinPayment && (
                        <>
                            <tr>
                                <td colSpan={4} className="px-6 py-2 whitespace-nowrap text-end text-sm font-medium text-gray-80">
                                    Total de trámite
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-80 text-end">
                                    {formatPrice(dataPayment.options.totalProcedure)}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4} className="px-6 py-2 whitespace-nowrap text-end text-sm font-medium text-gray-80">
                                    Total a pagar
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-red-600 text-end">
                                    {formatPrice(dataPayment.options.totalPerPay)}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4} className="px-6 py-2 whitespace-nowrap text-end text-sm font-medium text-gray-80">
                                    Total restante
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-80 text-end">
                                    {formatPrice(dataPayment.options.totalPay)}
                                </td>
                            </tr>
                        </>
                    )
                ) : showDetails && (
                    <>
                        <tr className="border-b">
                            <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-80">
                                <input
                                    type="radio"
                                    name="minPayment"
                                    value={dataPayment.options.minPayment}
                                    checked={dataPayment.options.minPayment ? true : false}
                                    onChange={onCheckOption}
                                />
                            </td>
                            <td colSpan={3} className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-80">
                                <div className="flex flex-col">
                                    <span>Pago por inicio de trámite</span>
                                    <span>se descuenta del total a pagar</span>
                                </div>
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-80 text-end">
                                {formatPrice(dataPayment.options.minPrice)}
                            </td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-80">
                                <input
                                    type="radio"
                                    name="otherPayment"
                                    value={dataPayment.options.otherPayment}
                                    checked={dataPayment.options.otherPayment}
                                    onChange={onCheckOption}
                                />
                            </td>
                            <td colSpan={3} className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-80">
                                <div className="flex flex-col">
                                    <span>Otra cantidad</span>
                                    <span>Pago abonado por cliente</span>
                                </div>
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-80 text-end w-36">
                                <Input type="number" name="otherPrice" value={dataPayment.options.otherPrice} onChange={onChangePrice} customClass="w-20 text-end" disabled={!dataPayment.options.otherPayment}  />
                            </td>
                        </tr>
                        {belowMinPayment && (
                            <tr className="border-b">
                                <td colSpan={5} className="px-6 py-2">
                                    <label htmlFor="paymentObservation" className="block text-sm font-medium text-gray-700 mb-1">
                                        Observación (obligatoria: el pago es menor al pago por inicio de trámite)
                                    </label>
                                    <textarea
                                        id="paymentObservation"
                                        name="paymentObservation"
                                        value={dataPayment.options.paymentObservation || ''}
                                        onChange={onChangeObservation}
                                        required
                                        rows={2}
                                        className="w-full border border-gray-300 rounded-lg text-sm p-2 outline-0 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan={4} className="px-6 py-2 whitespace-nowrap text-end text-sm font-medium text-gray-80">
                                Total de trámite
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-80 text-end">
                                {formatPrice(dataPayment.options.totalProcedure)}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={4} className="px-6 py-2 whitespace-nowrap text-end text-sm font-medium text-gray-80">
                                Total a pagar
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-red-600 text-end">
                                {formatPrice(dataPayment.options.totalPerPay)}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={4} className="px-6 py-2 whitespace-nowrap text-end text-sm font-medium text-gray-80">
                                Total restante
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-80 text-end">
                                {formatPrice(dataPayment.options.totalPay)}
                            </td>
                        </tr>

                    </>
                )}
                
            </tbody>
        </table>
    )
}

export default TableDetailsPayment;