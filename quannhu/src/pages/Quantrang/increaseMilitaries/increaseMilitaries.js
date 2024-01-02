import classNames from 'classnames/bind';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

import style from './increaseMilitaries.module.scss';
import Button from '~/components/Button';

const cx = classNames.bind(style);
function IncreaseMilitaries() {
    const [selectedYear, setSelectedYear] = useState('2022');
    const [years, setYears] = useState(['2022']);

    const handleOnchangeInput = () => {};
    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>
                <h1>QUÂN SỐ TĂNG TRONG NĂM</h1>
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
                    <div className={cx('option')}>
                        <Button primary>Tạo mới</Button>
                    </div>
                </div>
            </div>
            <form className={cx('header')}>
                <div className={cx('colunm')}>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Họ và tên: </label>
                        <input
                            defaultValue={''}
                            name="Họ và tên"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Họ và tên"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Giới tính: </label>
                        <input
                            defaultValue={''}
                            name="Giới tính"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Giới tinh:"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Cấp bậc: </label>
                        <input
                            defaultValue={''}
                            name="Cấp bậc"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Cấp bậc:"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Đơn vị: </label>
                        <input
                            defaultValue={''}
                            name="Đơn vị"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Đơn vị"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>PH CCD: </label>
                        <input
                            defaultValue={''}
                            name="PH CCĐ"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="PH CCD"
                        />
                    </div>
                </div>
                <div className={cx('colunm')}>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Quân phục: </label>
                        <input
                            defaultValue={''}
                            name="Quân phục"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Quân phục"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Mũ: </label>
                        <input
                            defaultValue={''}
                            name="Mũ"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Mũ"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Giày: </label>
                        <input
                            defaultValue={''}
                            name="Giày"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Giày"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Chiếu: </label>
                        <input
                            defaultValue={''}
                            name="Chiếu"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Chiếu"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>QT niên hạn: </label>
                        <input
                            defaultValue={''}
                            name="QT niên hạn"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="QT niên hạn"
                        />
                    </div>
                </div>
                <div className={cx('colunm')}>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Chuyển từ: </label>
                        <input
                            defaultValue={''}
                            name="Chuyển từ"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Chuyển từ"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Tháng: </label>
                        <input
                            defaultValue={''}
                            name="Tháng"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Tháng"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>BĐ Từ năm: </label>
                        <input
                            defaultValue={''}
                            name="BĐ Từ năm"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="BĐ Từ năm"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Nộp sổ QTCN: </label>
                        <input
                            defaultValue={''}
                            name="Nộp sổ QTCN"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Nộp sổ QTCN"
                        />
                    </div>
                    <div className={cx('info-element')}>
                        <label className={cx('label-info')}>Sổ QTCN số: </label>
                        <input
                            defaultValue={''}
                            name="Sổ QTCN số"
                            onChange={handleOnchangeInput}
                            className={cx('input-info')}
                            placeholder="Sổ QTCN số"
                        />
                    </div>
                </div>
            </form>
            <div className={cx('action')}>
                <Button primary>OK</Button>
            </div>
            <div className={cx('body')}>
                <Table>
                    <thead></thead>
                    <tbody></tbody>
                </Table>
            </div>
            <div className={cx('footer')}></div>
        </div>
    );
}

export default IncreaseMilitaries;
