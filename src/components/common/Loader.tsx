import {forwardRef, useState, useImperativeHandle } from 'react';
import { Grid, Loader as Spin, Col, Modal } from 'rsuite';

import '../../assets/css/loader.css';


const Loader = forwardRef((_props, ref)=>{
	const [show, setShow] = useState(false);
	const [title, setTitle] = useState('');

    /**
     * Shows loader
     * @param {string} title 
     */
	const handleShow = (title: string)=>{
		setTitle(title);
		setShow(true);
	}

    /**
     * Close loader
     */
	const handleClose = ()=>{
		setShow(false);
		setTitle('');
	}

	useImperativeHandle(ref, ()=>({
        handleShow,
		handleClose
    }));

    return(
        show &&
            <Modal open={show} backdrop={true} keyboard={false} size={'xs'} className='loader flex items-center justify-center h-[90%]'>
                <Modal.Body>
                    <Grid fluid>
                        <div className='flex justify-content-center align-items-center'>
                            <Col xs={24} className="text-center p-3">
                                <Spin size='lg' />

                                <h3 className='text-white text-2xl font-bold'>{title}</h3>
                            </Col>
                        </div>
                    </Grid>
                </Modal.Body>
            </Modal>
    )

});

export default Loader;