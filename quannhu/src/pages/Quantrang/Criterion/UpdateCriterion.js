import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import style from './Criterion.module.scss';
import httpRequest from '~/utils/httpRequest';
import Button from '~/components/Button';
const cx = classNames.bind(style);
function UpdateCriterion({ years, listCCD, dataHeaders, dataKeys }) {
    const [year, setYear] = useState(years[0]);
    const [data, setData] = useState({});
    const [modalContent, setModalContent] = useState({
        show: false,
        title: '',
        message: ''
    });
    const handleInputChange = (e, CCD) => {
        const { name, value } = e.target;
        setData(prevCriterion => ({
            ...prevCriterion,
            [CCD]: {
                ...prevCriterion[CCD],
                [name]: value
            }
        }));
    };
    console.log(data);
    const postData = async () => {
        try {
            const res = await httpRequest.put(`quantrang/criterion?year=${year}`, data);
            if (res.status === 200) {
                setModalContent({ show: true, title: 'Thành công', message: res.message });
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                
                if (status === 500) {
                    setModalContent({ show: true, title: 'Thất bại', message: data.error });
                }
            }
        }
    }
    const handleModalClose = () => {
        setModalContent({ show: false, title: '', message: '' });
        if (modalContent.title === 'Thất bại' && modalContent.message === 'Duplicate year') {
            document.getElementById('year').focus();
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            const res = await httpRequest.get(`quantrang/criterion/update?year=${year}`);
            setData(res.data.data);
        };
        
        fetchData();
    }, [year])
    console.log(data);
    return (
        <div className={cx('update-wrapper')}>
            <div className={cx('update-header')}>
                <h1 className={cx('update-title')}>
                    Tiêu chuẩn quân trang năm
                    <select value={year} onChange={(e) => setYear(e.target.value)}>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                <Button onClick={() => postData()} primary className={cx('update-btn')}>Chỉnh sửa</Button>
                </h1>
            </div>
            <div className={cx('update-body')}>
                <table className={cx('update-table')}>
                    <thead>
                        <tr>
                            <th>Năm PHCDD</th>
                            {dataHeaders.map((header) => (
                                <th className={cx('data-title-th')} key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {listCCD.map((CCD) => (
                            <tr key={CCD}>
                                <td>{CCD}</td>
                                {dataKeys.map((key) => (
                                    <td className={cx('data-td')} key={key}>
                                        <input name={key} onChange={e => handleInputChange(e, CCD)} className={cx('data-input')} type="text" defaultValue={data?.[CCD]?.[key]} />
                                    </td>
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
}

export default UpdateCriterion;
