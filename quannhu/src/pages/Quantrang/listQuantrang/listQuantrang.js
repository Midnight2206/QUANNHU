import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical} from '@fortawesome/free-solid-svg-icons';

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
                    to: '/quantrang/increase'
                },
                {
                    type: 'volatility',
                    title: 'Quân số giảm',
                },
            ],
        },
    },
    {
        title: 'Tiêu chuẩn quân trang',
        to: '/quantrang/criterion',
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
    const [head, setHead] = useState([]);
    const [militaries, setMilitaries] = useState([]);
    const [dispensations, setDispensations] = useState([])
    const [tableDatas, setTableDatas] = useState([])

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
            const res = await httpRequest.get('/quantrang', {params: {year: selectedYear}})
            const fetchedMilitaries = res.data.militaries;
            const fetchedDispensations = res.data.dispensations;
            setMilitaries(res.data.militaries);
            setDispensations(res.data.dispensations)
            setHead(res.data.columnNames);
            setYears(res.data.tableNames);
            fetchedMilitaries.map((military, i) => {
                const [fetchedDispensation] = fetchedDispensations[i]
                setTableDatas(prev => ([...prev, {...military, ...fetchedDispensation}]))
            })
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        
    };
    const handleYearChange = (event) => {
        const newYear = event.target.value;
        setSelectedYear(newYear);
    };
    const handleOnClickRow = (id) => {
        navigate(`/quantrang/individual/${id}`);
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
                            <option value={year.Tables_in_listquantrang} key={i}>
                                {year.Tables_in_listquantrang}
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
                            <th>#</th>
                            {head.map((item, index) => (
                                <th className={cx(index > 9 && 'text-justify')} key={index}>
                                    {item}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableDatas.map((tableData, i) => (
                            <tr onClick={() => handleOnClickRow(tableData.ID)} key={i}>
                                <td>{i + 1}</td>
                                {head.map((h, index) => (
                                    <td key={index}>{tableData[h] || null}</td>
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
