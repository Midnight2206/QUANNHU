import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

import Search from '~/components/Search/Search';
import style from './Quantrang.module.scss';
import Button from '~/components/Button';
import Menu from '~/components/Popper/Menu';
import httpRequest from '~/utils/httpRequest';
const MENU_ITEMS = [
    {
        title: 'Tăng giảm quân số',
        children: {
            title: 'Volatility',
            data: [
                {
                    type: 'volatility',
                    title: 'Quân số tăng',
                    to: '/quantrang/increase',
                },
                {
                    type: 'volatility',
                    title: 'Quân số giảm',
                    to: '/quantrang/decrease/list',
                },
            ],
        },
    },
    {
        title: 'Tiêu chuẩn quân trang',
        to: '/quantrang/criterion',
    },
    {
        title: 'Import Danh sách cấp phát',
        to: '/quantrang/importlist',
    },
    {
        title: 'Quân trang dùng chung',
        to: '/quantrang/shared',
    },
];

const cx = classNames.bind(style);

function Quantrang() {
    const navigate = useNavigate();
    const [selectedYear, setSelectedYear] = useState(() => {
        const savedYear = localStorage.getItem('selectedYear');
        return savedYear || '2022';
    });

    const [years, setYears] = useState([]);
    const [infoKeys, setInfoKeys] = useState([]);
    const [sizeKeys, setSizeKeys] = useState([]);
    const [dataKeys, setDataKeys] = useState([]);
    const [listDatas, setListDatas] = useState([]);
    const [infoHeaders, setInfoHeaders] = useState([])
    const [sizeHeaders, setSizeHeaders] = useState([])
    const [dataHeaders, setDataHeaders] = useState([])

    const handleMenuChange = (menuItem) => {
        switch (menuItem.type) {
            case 'language':
                // Handle change language
                break;
            default:
        }
    };

    useEffect(() => {
        localStorage.setItem('selectedYear', selectedYear);
    }, [selectedYear]);

    useEffect(() => {
        fetchData(selectedYear);
    }, [selectedYear]);

    const fetchData = async (selectedYear) => {
        try {
            const res = await httpRequest.get('/quantrang', { params: { year: selectedYear } });
            setInfoKeys(res.data.infoKeys);
            setSizeKeys(res.data.sizeKeys);
            setDataKeys(res.data.dataKeys);
            setInfoHeaders(res.data.infoHeaders);
            setSizeHeaders(res.data.sizeHeaders);
            setDataHeaders(res.data.dataHeaders)
            setYears(res.data.years);
            setListDatas(res.data.listDatas);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const handleYearChange = (event) => {
        const newYear = event.target.value;
        setSelectedYear(newYear);
    };
    const handleOnClickRow = (id) => {
        navigate(`/quantrang/individual/${id}`, { state: { year: selectedYear } });
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
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
                <Search year={selectedYear} />
                <div className={cx('action')}>
                    <Button primary to={`/quantrang/add?year=${selectedYear}`}>
                        Thêm
                    </Button>
                    <Menu items={MENU_ITEMS} onChange={handleMenuChange}>
                        <button className={cx('more-btn')}>
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                        </button>
                    </Menu>
                </div>
            </div>
            <div className={cx('body')}>
                <h3>DANH SÁCH CẤP PHÁT QUÂN TRANG NĂM {selectedYear}</h3>
                <Table hover bordered responsive className={cx('table')}>
                    <thead>
                        <tr>
                            <th className={cx('info')}>#</th>
                            {infoHeaders.map((infoHeader) => (
                                <th className={cx('info')} key={infoHeader}>
                                    {infoHeader}
                                </th>
                            ))}
                            {sizeHeaders.map((sizeHeader) => (
                                <th className={cx('size')} key={sizeHeader}>
                                    {sizeHeader}
                                </th>
                            ))}
                            {dataHeaders.map((dataHeader) => (
                                <th className={cx('data')} key={dataHeader}>
                                    {dataHeader}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {listDatas.map((listData, i) => (
                            <tr onClick={() => handleOnClickRow(listData.info.ID)} key={listData._id}>
                                <td className={cx('info')}>{i + 1}</td>
                                {infoKeys.map((infoKey) => (
                                    <td className={cx('info')} key={infoKey}>
                                        {listData.info[infoKey]}
                                    </td>
                                ))}
                                {sizeKeys.map((sizeKey) => (
                                    <td className={cx('size')} key={sizeKey}>
                                        {listData.size[sizeKey]}
                                    </td>
                                ))}
                                {dataKeys.map((dataKey) => (
                                    <td className={cx('data')} key={dataKey}>
                                        {listData.data[dataKey]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default Quantrang;
