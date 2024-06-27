import React from 'react';
import style from './decreaseMilitaries.module.scss';
import classNames from 'classnames/bind';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import httpRequest from '~/utils/httpRequest';
import Button from '~/components/Button';
import GiayGioiThieuQuanTrang from '~/components/MauIn/GiayGioiThieuQuanTrang'

const cx = classNames.bind(style);
function DecreaseMilitaries() {
    const [otherInfo, setOtherInfo] = useState({});
    const [sizeKeys, setSizeKeys] = useState([]);
    const [sizeHeaders, setSizeHeaders] = useState([]);
    const [otherInfoKeys, setOtherInfoKeys] = useState([]);
    const [otherInfoHeaders, setOtherInfoHeaders] = useState([]);
    const [infoKeys, setInfoKeys] = useState([]);
    const [infoHeaders, setInfoHeaders] = useState([]);
    const location = useLocation();
    const {data} = location.state;

    const getData = async () => {
        const res = await httpRequest.get(`quantrang/decrease`)
        setSizeKeys(res.data.sizeKeys);
        setSizeHeaders(res.data.sizeHeaders);
        setOtherInfoKeys(res.data.otherInfoKeys);
        setOtherInfoHeaders(res.data.otherInfoHeaders);
        setInfoKeys(res.data.infoKeys);
        setInfoHeaders(res.data.infoHeaders);
    }
    const handleOtherInfoChange = (key, value) => {
        setOtherInfo((prev) => ({
            ...prev,
            [key]: value,
        }));
    };
    const handleSubmit = () => {
        const decreaseData ={
            info: data.info,
            size: data.size,
            otherInfo: otherInfo,
        };
        const res=  httpRequest.post(`quantrang/decrease`, {
            year: data.year,
            data: decreaseData
        })
    };
    useEffect(() => {
        getData();
    }, []);
    return (
        <div>
            <h1>QUÂN SỐ GIẢM NĂM {data.year}</h1>
            <form className={cx('header')}>
                <div className={cx('colunm')}>
                    {infoKeys?.map((infoKey, index) => (
                        <div key={infoKey} className={cx('info-element')}> 
                            <label className={cx('label-info')}>{infoHeaders[index]}: </label>
                        <input
                            defaultValue={data.info[infoKey]}
                            className={cx('input-info', 'input-disabled')}
                        />
                        </div>
                    ))}
                    
                </div>
                <div className={cx('colunm')}>
                    {sizeKeys?.map((sizeKey, index) => (
                        <div key={sizeKey} className={cx('info-element')}>
                            <label className={cx('label-info')}>{sizeHeaders[index]}: </label>
                            <input
                                defaultValue={data.size[sizeKey]}
                                className={cx('input-info', 'input-disabled')}
                            />
                        </div>
                    ))}
                </div>
                <div className={cx('colunm')}>
                    {otherInfoKeys?.map((otherInfoKey, index) => (
                        <div key={otherInfoKey} className={cx('info-element')}>
                            <label className={cx('label-info')}>{otherInfoHeaders[index]}: </label>
                            <input
                                className={cx('input-info')}
                                onChange={(e) => handleOtherInfoChange(otherInfoKey, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </form>
            <div className={cx('action')}>
                <Button primary onClick={() => handleSubmit()} >OK</Button>
                <Button primary to={'/quantrang'}>Trở về</Button>
                <Button primary to={'/quantrang/decrease/list'}>Danh sách giảm</Button>

            </div>
        </div>
    );
}

export default DecreaseMilitaries;
