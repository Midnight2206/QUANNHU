import classNames from 'classnames/bind';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import unorm from 'unorm';

import style from './increaseMilitaries.module.scss';
import Button from '~/components/Button';
import httpRequest from '~/utils/httpRequest';

const cx = classNames.bind(style);
function IncreaseMilitaries() {
    const [titleErr, setTitleErr] = useState('');
    const [inputData, setInputData] = useState({});
    const [infoKeys, setInfoKeys] = useState([]);
    const [sizeKeys, setSizeKeys] = useState([]);
    const [otherInfoKeys, setOtherInfoKeys] = useState([]);
    const [infoHeaders, setInfoHeaders] = useState([]);
    const [sizeHeaders, setSizeHeaders] = useState([]);
    const [otherInfoHeaders, setOtherInfoHeaders] = useState([]);
    const handleOnchangeInput = (field, e) => {
        const { name, value } = e.target;
        setInputData((prev) => {
            return { ...prev, [field]: { ...prev[field], [name]: value } };
        });
    };
    const postData = async () => {
        try {
            const data = JSON.parse(unorm.nfc(JSON.stringify(inputData)));
            await httpRequest.post(`quantrang/increase`, { data: data });
        } catch (error) {
            if (error.response.status === 501) {
                setTitleErr(error.response.data.message);
            }
        }
    };
    const getData = async () => {
        try {
            const res = await httpRequest.get(`quantrang/increase`);
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
    useEffect(() => {getData()}, []);
    const handleClickOKBtn = () => {
        postData();
    };
    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('title')}>QUÂN SỐ TĂNG TRONG NĂM</h1>

            <form className={cx('header')}>
                <div className={cx('colunm')}>
                    {infoKeys?.map((key, index) => (
                        <div key={index} className={cx('info-element')}>
                            <label className={cx('label-info')}>{infoHeaders[index]}: </label>
                            <input
                                defaultValue={''}
                                name={key}
                                onChange={(e) => handleOnchangeInput('info', e)}
                                className={cx('input-info')}
                                placeholder={infoHeaders[index]}
                            />
                        </div>
                    ))}

                    <h5 style={{ color: 'red' }}>{titleErr}</h5>
                </div>
                <div className={cx('colunm')}>
                    {sizeKeys?.map((key, index) => (
                        <div key={index} className={cx('info-element')}>
                            <label className={cx('label-info')}>{sizeHeaders[index]}: </label>
                            <input
                                defaultValue={''}
                                name={key}
                                onChange={(e) => handleOnchangeInput('size', e)}
                                className={cx('input-info')}
                                placeholder={sizeHeaders[index]}
                            />
                        </div>
                    ))}
                </div>
                <div className={cx('colunm')}>
                    {otherInfoKeys?.map((key, index) => (
                        <div key={index} className={cx('info-element')}>
                            <label className={cx('label-info')}>{otherInfoHeaders[index]}: </label>
                            <input
                                defaultValue={''}
                                name={key}
                                onChange={(e) => handleOnchangeInput('otherInfo', e)}
                                className={cx('input-info')}
                                placeholder={otherInfoHeaders[index]}
                            />
                        </div>
                    ))}
                </div>
            </form>
            <div className={cx('action')}>
                
                <Button primary onClick={() => handleClickOKBtn()}>
                    OK
                </Button>
                <Button primary to="/quantrang">
                    Trở về
                </Button>
                <Button primary to="/quantrang/increase/list">
                    Danh sách quân số tăng
                </Button>
            </div>
        </div>
    );
}

export default IncreaseMilitaries;
