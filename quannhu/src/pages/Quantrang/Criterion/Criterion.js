import classNames from "classnames/bind";
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';

import style from './Criterion.module.scss'
import * as httpRequest from '~/utils/httpRequest';
import Button from "~/components/Button";

const cx = classNames.bind(style)
function Criterion() {
    const [isExist, setIsExist] = useState(false)
    const [criterion, setCriterion] = useState({})
    const [year, setYear] = useState('2022')
    const [columns, setColumns] = useState([])
    const [tableNames, setTableNames] = useState([])
    const [listCCD, setListCCD] = useState([])
    const [data, setData] = useState({})
    const handleYearChange = (event) => {
        setYear(event.target.value);
    };
    const handleChangeInput = (CCD, columnName, value) => {
        setData((prevData) => {
            const newData = {
                ...prevData,
                [CCD]: {
                    ...prevData[CCD],
                    [columnName]: value,
                },
            };
    
            console.log(newData);
            return newData; // Trả về giá trị mới của state
        });
    };
    const postData = async () => {
        try {
            await httpRequest.post(`quantrang/criterion?year=${year}`, data)
            fetchApi()
        } catch (error) {
            console.log(error)
        }
    }
    const putData = async () => {
        try {
            await httpRequest.put(`quantrang/criterion?year=${year}`, data)
            fetchApi()
        } catch (error) {
            
        }
    }
    const fetchApi = async () => {
        try {
            const res = await httpRequest.get(`quantrang/criterion`, {
                params: { year },
            });
            setTableNames(res.tableNames)
            setColumns(res.columnNames.slice(10))
            setListCCD(res.listCCD)
            if (res.data) {
                setIsExist(true)
                setCriterion(res.data.data)
                setData(res.data.data)
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchApi()
    }, [year])
    return ( 
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h1 className={cx('title')}>Tiêu chuẩn quân trang năm</h1>
                <div className={cx('choose-year')}>
                    <label className={cx('choose-year-lable')} htmlFor="year">
                        Năm:
                    </label>
                    <select
                        className={cx('choose-year-select')}
                        id="year"
                        name="year"
                        value={year}
                        onChange={handleYearChange}
                    >
                        {tableNames.map((tableName, i) => (
                            <option value={tableName} key={i}>
                                {tableName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className={cx('body')}>
                <Table className={cx('table')} bordered>
                    <thead>
                        <tr>
                            <th>PH, CCĐ</th>
                            {columns.map((column, i) => {
                                return <th className={cx('text-justify')} key={i}>{column}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {listCCD.map((CCD, i) => {
                            return (
                                <tr key={i}>
                                    <td>{CCD}</td>
                                    {columns.map((column, index) => {
                                        return (<td key={index}>
                                            <input defaultValue={criterion[CCD][column] || null} name={column} onChange={(e) => handleChangeInput(CCD, column, e.target.value)}/>
                                        </td>)
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div>
            <div className={cx('footer')}>
                {isExist ? <Button onClick={() => putData()} primary>Chỉnh sửa</Button> : <Button onClick={() => postData()} primary>Tạo</Button>}
            </div>

        </div>
     );
}

export default Criterion;