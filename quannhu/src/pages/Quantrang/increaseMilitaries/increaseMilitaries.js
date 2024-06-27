import classNames from 'classnames/bind';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, useRef } from 'react';
import unorm from 'unorm';
import ReactToPrint from 'react-to-print';
import { Table } from 'react-bootstrap';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from './increaseMilitaries.module.scss';
import Button from '~/components/Button';
import httpRequest from '~/utils/httpRequest';
import GiaoNhanSoQTCN from '~/components/MauIn/GiaoNhanSoQTCN/GiaoNhanSoQTCN';

const cx = classNames.bind(style);
function IncreaseMilitaries() {
    const [currentItem, setCurrentItem] = useState({});
    const [titleErr, setTitleErr] = useState('');
    const printRef = useRef();
    const reactToPrintRef = useRef();  
    const [inputData, setInputData] = useState({});
    const [isRender, setIsRender] = useState(true);
    const [data, setData] = useState([]);
    const [showHeader, setShowHeader] = useState(true);
    const [infoKeys, setInfoKeys] = useState([]);
    const [sizeKeys, setSizeKeys] = useState([]);
    const [otherInfoKeys, setOtherInfoKeys] = useState([]);
    const [infoHeaders, setInfoHeaders] = useState([]);
    const [sizeHeaders, setSizeHeaders] = useState([]);
    const [otherInfoHeaders, setOtherInfoHeaders] = useState([]);
    const handlePrint = (item) => {
        setCurrentItem(item);
        setTimeout(() => {
          printRef.current && reactToPrintRef.current.handlePrint();
        }, 0);
      };
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
            setIsRender(false);
        } catch (error) {
            if (error.response.status === 501) {
                setTitleErr(error.response.data.message);
            }
        }
    };
    const getData = async () => {
        try {
            const res = await httpRequest.get(`quantrang/increase`);
            setData(res.data.data);
            setInfoKeys(res.data.infoKeys);
            setSizeKeys(res.data.sizeKeys);
            setOtherInfoKeys(res.data.otherInfoKeys);
            setInfoHeaders(res.data.infoHeaders);
            setSizeHeaders(res.data.sizeHeaders);
            setOtherInfoHeaders(res.data.otherInfoHeaders);
            setIsRender(false);
        } catch (error) {
            console.log(error);
        }
    };
    const handleClickOKBtn = () => {
        postData();
    };
    const handleZoomOut = () => {
        setShowHeader(!showHeader);
    };
    useEffect(() => {
        if (isRender) {
            getData();
        }
    }, [isRender]);
    console.log(data);
    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('title')}>QUÂN SỐ TĂNG TRONG NĂM</h1>

            <form className={cx('header', { zoomOut: !showHeader })}>
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
                {showHeader ? (
                    <Button primary onClick={() => handleZoomOut()}>
                        Thu nhỏ
                    </Button>
                ) : (
                    <Button primary onClick={() => handleZoomOut()}>
                        Mở rộng
                    </Button>
                )}
                <Button primary to="/quantrang">
                    Trở về
                </Button>
            </div>
            <div className={cx('body')}>
                {data.length === 0 ? (
                    <h1>Chưa có dữ liệu</h1>
                ) : (
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
                                        <button onClick={() => handlePrint(item)}><FontAwesomeIcon icon={faPrint} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
            {currentItem && (
                <div style={{ display: 'none' }}>
                    <ReactToPrint trigger={() => <span></span>} content={() => printRef.current} ref={reactToPrintRef} />
                    <GiaoNhanSoQTCN ref={printRef} data={currentItem} />
                </div>
            )}
        </div>
    );
}

export default IncreaseMilitaries;
