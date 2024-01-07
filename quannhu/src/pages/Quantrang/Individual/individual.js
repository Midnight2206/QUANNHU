import classNames from 'classnames/bind';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { Fragment } from 'react';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tippy from '@tippyjs/react';

import * as httpRequest from '~/utils/httpRequest';
import { QuantrangContext } from '../quantrangContext';
import style from './Individual.module.scss';
import Button from '~/components/Button';

const cx = classNames.bind(style);

function Individual() {
    const id = useParams().slug;
    const [isUpdate, setIsUpdate] = useState(false);
    const [head, setHead] = useState([]);
    const [individualData, setIndividualData] = useState({});
    const [dispensationData, setDispensationData] = useState({});
    const [tippyData, setTippyData] = useState({});
    const [selectedYear, setSelectedYear] = useState('2022');
    const [dataUpdate, setDataUpdate] = useState({});
    const [criterion, setCriterion] = useState({});
    const [state, setState] = useContext(QuantrangContext);
    const fetchApi = async () => {
        try {
            const res = await httpRequest.get(`quantrang/individual`, {
                params: { id },
            });
            setIndividualData(res.results);
            setDispensationData(res.dispensationData);
            setState(res.results);
            setHead(res.header);
            setCriterion(res.criterion);
            setTippyData(res.receivedData);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchApi();
    }, [id]);
    useEffect(() => {
        // Thiết lập dataUpdate khi dữ liệu từ server thay đổi
        setDataUpdate(individualData[selectedYear] || {});
    }, [individualData, selectedYear]);

    const patchDataUpdate = async (individualData) => {
        try {
            await httpRequest.patch(`quantrang/individual/${id}?year=${selectedYear}`, individualData);
            fetchApi();
        } catch (error) {
            console.log(error);
        }
    };
    const years = Object.keys(individualData);
    const handleOnchangeInput = (e) => {
        const { name, value } = e.target;
        setDataUpdate((prev) => {
            return { ...prev, [name]: value };
        });
    };
    useEffect(() => {
        if (JSON.stringify(dataUpdate) !== JSON.stringify(individualData[selectedYear])) {
            setIsUpdate(true);
        } else {
            setIsUpdate(false);
        }
    }, [dataUpdate]);
    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>
                <h1>SỔ QUÂN TRANG CÁ NHÂN ĐIỆN TỬ</h1>
                <div className={cx('choose-year')}>
                    <label className={cx('choose-year-lable')} htmlFor="year">
                        Năm:
                    </label>
                    <select
                        className={cx('choose-year-select')}
                        id="year"
                        name="year"
                        value={selectedYear}
                        onChange={handleYearChange}
                    >
                        {years.map((year, i) => (
                            <option value={year} key={i}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={cx('option')}>
                    <Button primary to={'/quantrang'}>
                        Trở lại
                    </Button>
                    <Button primary onClick={() => patchDataUpdate(dataUpdate)} disabled={!isUpdate}>
                        Chỉnh sửa
                    </Button>
                    <Button primary to={`/quantrang/dispensation/${id}?year=${selectedYear}`}>
                        Cấp phát
                    </Button>
                </div>
            </div>
            <form className={cx('header')}>
                <div className={cx('colunm')}>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Họ và tên: </label>
                        <input
                            defaultValue={
                                individualData[selectedYear] ? individualData[selectedYear]['Họ và tên'] : null
                            }
                            name="Họ và tên"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Họ và tên"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Giới tính: </label>
                        <input
                            defaultValue={
                                individualData[selectedYear] ? individualData[selectedYear]['Giới tính'] : null
                            }
                            name="Giới tính"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Giới tinh:"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Cấp bậc: </label>
                        <input
                            defaultValue={
                                individualData[selectedYear] ? individualData[selectedYear]['Cấp bậc'] : null
                            }
                            name="Cấp bậc"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Cấp bậc:"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Đơn vị: </label>
                        <input
                            defaultValue={individualData[selectedYear] ? individualData[selectedYear]['Đơn vị'] : null}
                            name="Đơn vị"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Đơn vị"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>PH CCD: </label>
                        <input
                            defaultValue={individualData[selectedYear] ? individualData[selectedYear]['PH CCĐ'] : null}
                            name="PH CCĐ"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="PH CCD"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Sổ QTCN số: </label>
                        <input
                            defaultValue={individualData[selectedYear] ? individualData[selectedYear]['Sổ QTCN số'] : null}
                            name="Sổ QTCN số"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Sổ QTCN số"
                        />
                    </div>
                </div>
                <div className={cx('colunm')}>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Quân phục: </label>
                        <input
                            defaultValue={
                                individualData[selectedYear] ? individualData[selectedYear]['Quân phục'] : null
                            }
                            name="Quân phục"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Quân phục"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Mũ: </label>
                        <input
                            defaultValue={individualData[selectedYear] ? individualData[selectedYear]['Mũ'] : null}
                            name="Mũ"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Mũ"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Giày: </label>
                        <input
                            defaultValue={individualData[selectedYear] ? individualData[selectedYear]['Giày'] : null}
                            name="Giày"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Giày"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Chiếu: </label>
                        <input
                            defaultValue={individualData[selectedYear] ? individualData[selectedYear]['Chiếu'] : null}
                            name="Chiếu"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Chiếu"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>QT niên hạn: </label>
                        <input
                            defaultValue={
                                individualData[selectedYear] ? individualData[selectedYear]['QT niên hạn'] : null
                            }
                            name="QT niên hạn"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="QT niên hạn"
                        />
                    </div>
                </div>
            </form>
            <div className={cx('body')}>
                <Table bordered responsive className={cx('table')}>
                    <thead>
                        <tr>
                            <th className={cx('year')}>Năm</th>
                            {head.map((item, index) => (
                                <th className={cx('text-justify')} key={index}>
                                    {item}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {years.map((year, i) => {
                            return (
                                <Fragment key={i}>
                                    <tr key={i}>
                                        <td rowSpan={2}>{year}</td>
                                        {head.map((h, index) =>
                                            tippyData[year][h] ? (
                                                <Tippy
                                                    key={h}
                                                    content={
                                                        <div>
                                                            {tippyData[year][h].map((item, ind) => {
                                                                return (
                                                                    <span key={ind}>
                                                                        {item.receiver} - {item.adress} nhận theo phiếu số{' '}
                                                                        {item.num} ngày {item.time} <br />
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    }
                                                >
                                                    <td key={index}>{dispensationData[year][h] || null}</td>
                                                </Tippy>
                                            ) : (
                                                <td key={index}>{dispensationData[year][h] || null}</td>
                                            ),
                                        )}
                                    </tr>
                                    <tr key={year}>
                                            {head.map((h) => {
                                                return (<td className={cx('bg-dark', 'text-light')} key={h}>{criterion[year][h] || null}</td>)
                                            })}
                                    </tr>
                                </Fragment>
                            )
                        })}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default Individual;
