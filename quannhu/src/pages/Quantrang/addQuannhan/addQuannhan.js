import classNames from 'classnames/bind';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone';
import {  useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import style from './addQuannhan.module.scss'
import httpRequest from '~/utils/httpRequest';
const cx = classNames.bind(style);


function AddQuanNhan() {
    const [head, setHead] = useState([])
    const location = useLocation()
    const params = new URLSearchParams(location.search);
    const year = params.get('year')
    const [errorData, setErrorData] = useState([]);
    const [formData, setFormData] = useState({});
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
    
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
                setFormData([...sheetData]);
            } catch (error) {
                console.error('Error reading the Excel file:', error);
            }
        };
    
        reader.readAsArrayBuffer(file);
    };
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: '.xlsx, .xls',
    });
    
    const handleChange = (e, rowIndex) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [rowIndex]: {
                ...prev[rowIndex],
                [name]: value,
            },
        }));
    };
    const getData = async () => {
        try {
            const res = await httpRequest.get(`quantrang/add?year=${year}`)
            setHead(res.data)
            console.log(res)
    
        } catch (error) {
            console.log(error)
        }
    }
    useEffect (() => {
        getData()   
    }, [year])
    useEffect(() => {
        if (errorData.length > 0) {
            setFormData(() =>
                errorData.reduce((acc, currentValue, index) => {
                    acc[index] = currentValue;
                    return acc;
                }, {})
            );
        }
    }, [errorData]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8080/quantrang/add?year=${year}`, formData);
            window.location.href = '/quantrang';
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setErrorData(err.response.data.failData);
                setFormData(err.response.data.failData)
            } else {
                alert('Có lỗi xảy ra. Vui lòng thử lại.');
            }
        }
    };
    console.log(formData)
        return (
            <>
                <div className={cx('header')}>
                    <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p className={cx('import')} >Thả file Excel vào đây hoặc click để chọn</p>
                </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <Table responsive bordered>
                        <thead>
                            <tr>
                                <th>#</th>
                                {Array.from(head).map((item, index) => (
                                    <th key={index}>{item}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            
                            {errorData.length >0 && errorData.map((data, i) => (
                                <tr key={i}>
                                    <td></td>
                                    {Array.from(head).map((h, index) => {
                                        return(
                                            <td key={index}>
                                            <input className={cx('error-data')} name={h} defaultValue={data[h] || ''} onChange={(e) => handleChange(e, i)} />
                                        </td>
                                        )
                                        })}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <button type="submit">Thêm</button>
                </form>
            </>
        );
    }

export default AddQuanNhan;
