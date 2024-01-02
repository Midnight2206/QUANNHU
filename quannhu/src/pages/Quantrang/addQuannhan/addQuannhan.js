import classNames from 'classnames/bind';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import {  useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import style from './addQuannhan.module.scss'
const cx = classNames.bind(style);
const head = ['Họ và tên', 'Đơn vị', 'Giới tính', 'PH CCĐ', 'Quân phục', 'Giày', 'Mũ', 'Chiếu', 'QT niên hạn'];

function AddQuanNhan() {
    const location = useLocation()
    const params = new URLSearchParams(location.search);
    const year = params.get('year')
    const [errorData, setErrorData] = useState([]);
    const [rowIndex, setRowIndex] = useState(['a']);
    const [formData, setFormData] = useState({});
    const handleAddRow = (e) => {
        e.preventDefault();
        setRowIndex((prev) => [...prev, 'a']);
    };
    const handleRemoveRow = (e) => {
        setRowIndex((prev) => {
            if (prev.length > 1) {
                return prev.slice(0, -1);
            } else {
                return prev;
            }
        });
    };
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
            } else {
                alert('Có lỗi xảy ra. Vui lòng thử lại.');
            }
        }
    };
    
        return (
            <>
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
                            {errorData.length === 0 && Array.from(rowIndex).map((r, i) => (
                                <tr key={i}>
                                    <td></td>
                                    {Array.from(head).map((h, index) => (
                                        <td key={index}>
                                            <input name={h} onChange={(e) => handleChange(e, i)} />
                                        </td>
                                    ))}
                                </tr>
                            ))}
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
                <button onClick={handleAddRow}>ADD</button>
                <button onClick={handleRemoveRow}>REMOVE</button>
            </>
        );
    }

export default AddQuanNhan;
