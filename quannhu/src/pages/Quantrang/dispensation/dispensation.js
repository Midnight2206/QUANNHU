import classNames from 'classnames/bind';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactToPrint from 'react-to-print';
import {useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-bootstrap/Modal';


import httpRequest from '~/utils/httpRequest';
import PhieuXuat from '~/components/MauIn/PhieuXuat/PhieuXuat';
import Button from '~/components/Button';
import { QuantrangContext } from '../quantrangContext';
import style from './dispensation.module.scss';
const cx = classNames.bind(style);
function Dispensation() {
    const location = useLocation();
    const currentDay = new Date()
    const convertDay = (date) => (`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`)
    const [isNotData, setIsNotData] = useState(true)
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const data = location.state.data
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [fieldDisplayMapping, setFieldDisplayMapping] = useState([])
    const [selectedDate, setSelectedDate] = useState(currentDay)
    const [selectedDateConvert, setSelectedDateConvert] = useState(convertDay(currentDay));
    const [num, setNum] = useState('')
    const [dataInputCriterion, setDataInputCriterion] = useState({});
    const componentRef = useRef();
    const [state] = useContext(QuantrangContext);
    const queryParams = new URLSearchParams(location.search);
    const year = queryParams.get('year');
    const [criterion, setCriterion] = useState({});
    const CCD = data.info.PHCDD;
    const [info, setInfo] = useState({
        receiver: data.info.fullName,
        unit: data.info.unit,
        criterionOf: data.info.fullName,
        ID: data.info.ID
    });
    const handleDateChange = (date) => {
        setSelectedDateConvert(convertDay(date));
        setSelectedDate(date)
    };
    const params = useParams()
    const ID = params.id
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Quay lại trang trước đó
    };
    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        
    };
    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
        navigate('/quantrang');
    };
    const handleChangeInfo = (name, value) => {
        setInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
        setNum('')
    };
    const handleDataInputChange = (name, value) => {
        setDataInputCriterion((prevData) => {
            const newData = {
                ...prevData,
                [name]: value,
            };
            setNum('')
            setIsNotData(Object.values(newData).every(val => (val === 0 || val === '' || val === null)));
            
            return newData;
        });
    };
    const handleKeydown = (e) => {
        const keyCode = e.keyCode || e.which;
        const allowedKeys = [8, 9, 37, 39, 46]; // Backspace, Tab, Left arrow, Right arrow, Delete
      
        // Cho phép nhấn các phím số từ 0 đến 9 và các phím được định nghĩa trong allowedKeys
        if ((keyCode < 48 || keyCode > 57) && !allowedKeys.includes(keyCode)) {
          e.preventDefault();
        }
      };
    const getData = async () => {
        try {
            const res = await httpRequest.get('quantrang/dispensation', {
                params: { CCD, year },
            });
            setCriterion(res.data.data);
            setFieldDisplayMapping(res.data.fieldDisplayMapping);
        } catch (error) {
            console.log(error);
        }
    };
    const postData = async () => {
        try {
            const res = await httpRequest.post(
                'warehouse/bill',
                { dataInputCriterion, selectedDate: selectedDateConvert, info },
                { params: { year, ID } },
            );
            if (res.status === 201) {
                setShowSuccessModal(true);
                setNum(res.data.num)
            } else if (res.status === 500) {
                setShowErrorModal(true);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleSave = () => {
        postData();
        setIsNotData(true)
    };

    useEffect(() => {
        getData();
    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h1 className={cx('title')}>Cấp phát quân trang thường xuyên</h1>
            </div>
            <div className={cx('body')}>
                <div className={cx('criterion')}>
                    <div style={{ marginBottom: '16px' }}>
                        <label className={cx('label')}>Người nhận:</label>
                        <input
                            name="receiver"
                            className={cx('input')}
                            onChange={(e) => handleChangeInfo(e.target.name, e.target.value)}
                            defaultValue={data.info.fullName}
                        />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label className={cx('label')}>Địa chỉ:</label>
                        <input
                            name="unit"
                            className={cx('input')}
                            onChange={(e) => handleChangeInfo(e.target.name, e.target.value)}
                            defaultValue={data.info.unit}
                        />
                    </div>
                    <div>
                        <label className={cx('label')}>Chọn ngày:</label>
                        <DatePicker
                            className={cx('input')}
                            name="date"
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                    <Table bordered>
                        <thead>
                            <tr>
                                <th style={{textAlign: 'center', verticalAlign: 'middle'}}>Tên mặt hàng</th>
                                <th style={{textAlign: 'center', verticalAlign: 'middle'}}>Tiêu chuẩn</th>
                                <th style={{textAlign: 'center', verticalAlign: 'middle'}}>Đã nhận</th>
                                <th style={{textAlign: 'center', verticalAlign: 'middle'}}>Cấp phát</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(criterion).map(([key, value]) => (
                                <tr key={key}>
                                    <td>{fieldDisplayMapping[key]}</td>
                                    <td style={{textAlign: 'center', verticalAlign: 'middle'}}>{value}</td>
                                    <td style={{textAlign: 'center', verticalAlign: 'middle'}}>{data.data[key]}</td>
                                    <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                        <input
                                            name={key}
                                            value={dataInputCriterion[key] || ''}
                                            onChange={(e) => handleDataInputChange(key, e.target.value)}
                                            onKeyDown={e => handleKeydown(e)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                <div>
                    <div className={cx('phieu-xuat')} ref={componentRef}>
                        <PhieuXuat fieldDisplayMapping={fieldDisplayMapping} num={num} info={info} data={dataInputCriterion} date={selectedDate} dispensationYear={year} />
                    </div>
                </div>
            </div>
            <div className={cx('footer')}>
                <div className={cx('action')}>
                    <ReactToPrint
                        trigger={() => (
                            <Button disabled={!num} className={cx('print-btn')} primary>
                                In
                            </Button>
                        )}
                        content={() => componentRef.current}
                    />
                    <>
                        <Button disabled={isNotData} primary onClick={() => handleSave()}>
                            Lưu Phiếu
                        </Button>
                        {/* Modal Thành công */}
                        {showSuccessModal && (
                            <Modal
                                size="lg"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered
                                show={showSuccessModal}
                                onClose={handleCloseSuccessModal}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title id="contained-modal-title-vcenter">Thành công!</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <h4>Phiếu của bạn đã được lưu thành công</h4>
                                    <p>
                                        Hãy in Phiếu Xuất Kho này ra để dễ dàng quản lý
                                    </p>
                                </Modal.Body>
                                <Modal.Footer><button onClick={handleCloseSuccessModal}>OK</button></Modal.Footer>
                            </Modal>
                        )}

                        {/* Modal Lỗi */}
                        {showErrorModal && (
                            <Modal show={showErrorModal} onClose={handleCloseErrorModal}>
                                <p>Lưu phiếu thất bại!</p>
                                <button onClick={handleCloseErrorModal}>Thực hiện lại</button>
                            </Modal>
                        )}
                    </>
                    <Button onClick={handleGoBack} primary>
                        Quay lại
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Dispensation;
