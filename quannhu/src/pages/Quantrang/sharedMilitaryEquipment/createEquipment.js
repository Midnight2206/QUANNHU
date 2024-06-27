import React, { useState, useRef, useEffect, useCallback } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown, faClose } from '@fortawesome/free-solid-svg-icons';

import style from './sharedMilitaryEquipment.module.scss';
import Button from '~/components/Button';
import httpRequest from '~/utils/httpRequest';

const cx = classNames.bind(style);
function CreateEquipment({ onHide }) {
    const [newEquipment, setNewEquipment] = useState({})
    const [quantity, setQuantity] = useState({})
    const [size, setSize] = useState({})
    const [canClickOK, setCanClickOK] = useState(false)
    const [quantityUnit, setQuantityUnit] = useState(1);
    const wrapperRef = useRef();
    const handleUp = () => {
        if (quantityUnit < 16) {
            setQuantityUnit((prevQuantity) => prevQuantity + 1);
        }
    };
    
    const handleDown = () => {
        if (quantityUnit > 1) {
            // Kiểm tra nếu quantityUnit lớn hơn 0
            setQuantityUnit((prevQuantity) => prevQuantity - 1);
        }
    };
    const handleHide = useCallback(() => {
        onHide(); // Gọi hàm onHide được truyền từ SharedMilitaryEquipment để ẩn CreateEquipment
    }, [onHide]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                handleHide();
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleHide, wrapperRef]);
    const equipmentData = {}
    Object.keys(size).forEach(key => {
        equipmentData[size[key]] = { quantity: quantity[key] || 0 };
    });
    const newEquipmentDetail = {...newEquipment, size: equipmentData}
    useEffect(() => {
        if (newEquipment.name && newEquipment.unit) {
            setCanClickOK(true);
        } else {
            setCanClickOK(false);
        }
    }, [newEquipment]);
    const createEquipment = async () => {
        try {
           await httpRequest.post('/shared/create', {data: newEquipmentDetail}) 
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className={cx('create-equipment')}>
            <div className={cx('create-equipment-wrapper')} ref={wrapperRef}>
                <div className={cx('create-equipment-header')}>
                    <h1>Tạo mới quân trang dùng chung</h1>
                    <button onClick={() => handleHide()} className={cx('close-btn')}>
                        {' '}
                        <FontAwesomeIcon icon={faClose} />{' '}
                    </button>
                </div>
                <div className={cx('create-equipment-body')}>
                    <form className={cx('create-equipment-form')}>
                        <div className={cx('create-equipment-element')}>
                            <label className={cx('create-equipment-lable')} htmlFor="name">
                                Tên quân trang
                            </label>
                            <input className={cx('create-equipment-input')}
                            onChange={e => {
                                setNewEquipment(prev => ({...prev, name: e.target.value}))
                            }}
                            name="name"
                            placeholder="Tên quân trang" />
                        </div>
                        <div className={cx('create-equipment-element')}>
                            <label className={cx('create-equipment-lable')} htmlFor="unit">
                                Đơn vị tính
                            </label>
                            <input
                            className={cx('create-equipment-input')}
                            onChange={e => {
                                setNewEquipment(prev => ({...prev, unit: e.target.value}))
                            }}
                            name="unit"
                            placeholder="Đơn vị tính" />
                        </div>
                        <div className={cx('create-equipment-element')}>
                            <label className={cx('create-equipment-lable')} htmlFor="quantityUnit">
                                Số lượng cỡ số
                            </label>
                            <label className={cx('create-equipmen-quantity-unit')} htmlFor="quantityUnit">
                                {quantityUnit}
                            </label>
                            <div className={cx('upDown')}>
                                <button type="button" className={cx('btnUpDown')} onClick={handleUp}>
                                    <FontAwesomeIcon icon={faAngleUp} />
                                </button>
                                <button type="button" className={cx('btnUpDown')} onClick={handleDown}>
                                    <FontAwesomeIcon icon={faAngleDown} />
                                </button>
                            </div>
                        </div>
                        <div className={cx('equipment-quantity')}>
                            {[...Array(quantityUnit)].map((_, i) => {
                                return (
                                    <div key={i} className={cx('equipment-quantity-element')}>
                                        <input onChange={e => {setSize(prev => ({...prev, [i]: e.target.value}))}}  className={cx('equipment-quantity-input')} placeholder="Cỡ số" />
                                        <input onChange={e => {setQuantity(prev => ({...prev, [i]: e.target.value}))}} className={cx('equipment-quantity-input')} placeholder="Số lượng" />
                                    </div>
                                );
                            })}
                        </div>
                    </form>
                </div>
                <div className={cx('create-equipment-footer')}>
                    <Button disabled={!canClickOK} primary onClick={() => createEquipment()}>OK</Button>
                    <Button onClick={() => handleHide()} primary>Đóng</Button>
                </div>
            </div>
        </div>
    );
}

export default CreateEquipment;
