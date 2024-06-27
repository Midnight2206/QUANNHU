import React, { useState } from 'react';
import Button from '~/components/Button';
import httpRequest from '~/utils/httpRequest';
import classNames from 'classnames/bind';
import style from './Criterion.module.scss'

const cx = classNames.bind(style)
const CreateCriterion = ({dataHeaders, dataKeys, listCCD}) => {
    const [criterion, setCriterion] = useState({});
    const [year, setYear] = useState('')
    const [modalContent, setModalContent] = useState({
        show: false,
        title: '',
        message: ''
    });
    const handleInputChange = (e, CCD) => {
            const { name, value } = e.target;
            setCriterion(prevCriterion => ({
                ...prevCriterion,
                [CCD]: {
                    ...prevCriterion[CCD],
                    [name]: value
                }
            }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const res = await httpRequest.post(`quantrang/criterion?year=${year}`, criterion);
                if (res.status === 200) {
                    setModalContent({ show: true, title: 'Thành công', message: res.message });
                }
            } catch (error) {
                if (error.response) {
                    const { status, data } = error.response;
                    if (status === 400) {
                        setModalContent({ show: true, title: 'Thất bại', message: data.error });
                        
                    } else if (status === 500) {
                        setModalContent({ show: true, title: 'Thất bại', message: data.error });
                    }
                }
            }
        };
        const handleModalClose = () => {
            setModalContent({ show: false, title: '', message: '' });
            if (modalContent.title === 'Thất bại' && modalContent.message === 'Duplicate year') {
                document.getElementById('year').focus();
            }
        };
    return (

        <div className={cx('create-wrapper')}>
            <h1 className={cx('create-header')}>
                Tạo bảng tiêu chuẩn quân trang năm 
                <input id='year' value={year} onChange={e => setYear(e.target.value)} />
                <Button disabled = {year === ''} primary onClick={handleSubmit} className={cx('create-button')}>Tạo</Button>
            </h1>
            <div className={cx('create-body')}>
                <table>
                    <thead>
                        <tr>
                            <th>Năm PH CCĐ</th>
                            {dataHeaders?.map(dataHeader => (
                                <th className={cx('data-title-th')} key={dataHeader}>{dataHeader}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {listCCD?.map(CCD => (
                            <tr key={CCD}>
                                <td>{CCD}</td>
                                {dataKeys?.map(dataKey => (
                                    <td className={cx('data-td')} key={dataKey}><input className={cx('data-input')} name={dataKey} onChange={e => handleInputChange(e, CCD)} /></td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {modalContent.show && (
                <div className={cx('modal')}>
                    <div className={cx('modal-content')}>
                        <h2>{modalContent.title}</h2>
                        <p>{modalContent.message}</p>
                        <Button onClick={handleModalClose}>OK</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateCriterion;