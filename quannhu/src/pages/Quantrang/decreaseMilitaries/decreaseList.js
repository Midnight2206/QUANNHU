import React from 'react';
import style from './decreaseMilitaries.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect, useRef } from 'react';
import httpRequest from '~/utils/httpRequest';
import ReactToPrint from 'react-to-print';
import { Table } from 'react-bootstrap';
import { faPrint, faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as unorm from "unorm";

import { SearchIcon } from '~/components/Icons';
import Filter from '~/components/Filter/Filter';
import 'bootstrap/dist/css/bootstrap.min.css';
import GiayGioiThieuQuanTrang from '~/components/MauIn/GiayGioiThieuQuanTrang';
import Button from '~/components/Button';

const cx = classNames.bind(style);
function DecreaseList() {
    const [currentItem, setCurrentItem] = useState({});
    const printRef = useRef();
    const inputRef = useRef();
    const [allData, setAllData] = useState([]);
    const [filteds, setFilteds] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const reactToPrintRef = useRef();
    const [data, setData] = useState([]);
    const [filterDatas, setFilterDatas] = useState({});
    const [infoKeys, setInfoKeys] = useState([]);
    const [sizeKeys, setSizeKeys] = useState([]);
    const [otherInfoKeys, setOtherInfoKeys] = useState([]);
    const [infoHeaders, setInfoHeaders] = useState([]);
    const [sizeHeaders, setSizeHeaders] = useState([]);
    const [otherInfoHeaders, setOtherInfoHeaders] = useState([]);
    const getDecreaseList = async () => {
        try {
            const res = await httpRequest.get(`quantrang/decrease/list`);
            setData(res.data.data);
            setAllData(res.data.data);
            setInfoKeys(res.data.infoKeys);
            setSizeKeys(res.data.sizeKeys);
            setOtherInfoKeys(res.data.otherInfoKeys);
            setInfoHeaders(res.data.infoHeaders);
            setSizeHeaders(res.data.sizeHeaders);
            setOtherInfoHeaders(res.data.otherInfoHeaders);
        } catch (error) {
            console.log(error);
        }
    };
    const searchWithName = async () => {
        if (searchValue) {
            setData(prev => prev.filter(item => item.info.fullName.toLowerCase().includes(searchValue.toLowerCase())));
        } else {
            setData(allData);
        }
    }
    const handleChange = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearchValue(unorm.nfc(searchValue));
        }
    };
    const getFilterDatas = async () => {
        try {
            const res = await httpRequest.post(`quantrang/decrease/filter`, { params: filterDatas });
            setData(res.data.data);
        } catch (error) {
            console.log(error);
        }
    }
    const handleFilterValueChange =  (value) => {
        
            setFilterDatas(prev => ({...prev, ...value}));
    };
    const handleClear = () => {
        setSearchValue('');
        inputRef.current.focus();
    };
    const handleChangeFilted = (name, filted) => {
        if(filted){
            setFilteds(prev => [...prev, name]);
        } else {
            setFilteds(prev => prev.filter(item => item !== name));
        }
    }
    const handlePrint = (item) => {
        setCurrentItem(item);
        setTimeout(() => {
            printRef.current && reactToPrintRef.current.handlePrint();
        }, 0);
    };

    useEffect(() => {
        const fetchData = async () => {
            await getDecreaseList();
        };
        fetchData();
    }, []);
    return (
        <div>
            <div className={cx('header-list')}>
                <div className={cx('title-list')}>
                    <h1>DANH SÁCH QUÂN NHÂN GIẢM</h1>
                    <Button primary to={'/quantrang'}>Trở về</Button>
                </div>
                <div className={cx('filter')}>
                    <div className={cx('search')}>
                        <input
                            ref={inputRef}
                            value={searchValue}
                            placeholder="Nhập tên quân nhân cần tìm kiếm"
                            spellCheck={false}
                            onChange={handleChange}
                        />
                        {!!searchValue && !loading && (
                            <button className={cx('clear')} onClick={handleClear}>
                                <FontAwesomeIcon icon={faCircleXmark} />
                            </button>
                        )}
                        {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}
    
                        <button className={cx('search-btn')} onMouseDown={searchWithName}>
                            <SearchIcon />
                        </button>
                    </div>
                        <Filter
                            title="Năm PH CCĐ"
                            data={(filteds[0] === 'PHCDD' ? allData : data).map((dt) => dt.info.PHCDD)}
                            onValueChange={handleFilterValueChange}
                            name="PHCDD"
                            onOkClick={getFilterDatas}
                            onChangeFilted={handleChangeFilted}
                        />
                        <Filter
                            title="Chuyển đến"
                            data={(filteds[0] === 'tranferTo' ? allData : data).map((dt) => dt.otherInfo.tranferTo)}
                            onValueChange={handleFilterValueChange}
                            name="tranferTo"
                            onOkClick={getFilterDatas}
                            onChangeFilted={handleChangeFilted}
                        />
                        <Filter
                            title="Bảo đảm đến năm"
                            data={(filteds[0] === 'toAnyYear' ? allData : data).map((dt) => dt.otherInfo.toAnyYear)}
                            onValueChange={handleFilterValueChange}
                            name="toAnyYear"
                            onOkClick={getFilterDatas}
                            onChangeFilted={handleChangeFilted}
                        />
                        <Filter
                            title="Ngày chuyển đi"
                            data={(filteds[0] === 'dateMove' ? allData : data).map((dt) => dt.otherInfo.dateMove)}
                            onValueChange={handleFilterValueChange}
                            name="dateMove"
                            onOkClick={getFilterDatas}
                            onChangeFilted={handleChangeFilted}
                        />
                        <Filter
                            title="Chuyển nội bộ"
                            data={(filteds[0] === 'internalTransfer' ? allData : data).map((dt) => dt.otherInfo.internalTransfer)}
                            onValueChange={handleFilterValueChange}
                            name="internalTransfer"
                            onOkClick={getFilterDatas}
                            onChangeFilted={handleChangeFilted}
                        />
                </div>
            </div>
            <div className={cx('body-list')}>
                <Table bordered responsive>
                    <thead className={cx('table-head')}>
                        <tr>
                            {infoHeaders.map((header) => (
                                <th key={header}>{header}</th>
                            ))}
                            {sizeHeaders.map((header) => (
                                <th key={header}>{header}</th>
                            ))}
                            {otherInfoHeaders.map((header) => (
                                <th key={header}>{header}</th>
                            ))}
                            <th>#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item, index) => (
                            <tr key={index}>
                                {infoKeys.map((key) => (
                                    <td key={key}>{item.info[key]}</td>
                                ))}
                                {sizeKeys.map((key) => (
                                    <td key={key}>{item.size[key]}</td>
                                ))}
                                {otherInfoKeys.map((key) => (
                                    <td key={key}>{item.otherInfo[key]}</td>
                                ))}
                                <td>
                                    <button onClick={() => handlePrint(item)}>
                                        <FontAwesomeIcon icon={faPrint} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {currentItem && (
                    <div style={{ display: 'none' }}>
                        <ReactToPrint
                            trigger={() => <span></span>}
                            content={() => printRef.current}
                            ref={reactToPrintRef}
                        />
                        <GiayGioiThieuQuanTrang ref={printRef} data={currentItem} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default DecreaseList;
