import classNames from 'classnames/bind';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
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
    const [originalData, setOriginalData] = useState({})
    const navigate = useNavigate();
    const location = useLocation();
    const id = useParams().slug;
    const [isUpdate, setIsUpdate] = useState(false);
    const [getDataSuccess, setDataSuccess] = useState(false)
    const [dataKeys, setDataKeys] = useState([]);
    const [sizeKeys, setSizeKeys] = useState([]);
    const [infoKeys, setInfoKeys] = useState([]);
    const [years, setYears] = useState([]);
    const [results, setResults] = useState([]);
    const [tippyData, setTippyData] = useState({});
    const [selectedYear, setSelectedYear] = useState(location.state.year || 2022);
    const [dataUpdate, setDataUpdate] = useState({});
    const [criterion, setCriterion] = useState({});
    const [fieldDisplayMapping, setFieldDisplayMapping] = useState([])
    const [state, setState] = useContext(QuantrangContext);
    const handleOnclickDispensationBtn = () => {
        const selectedResult = results.find(result => result.year == selectedYear);
        if (selectedResult) {
            navigate(`/quantrang/dispensation/${id}?year=${selectedYear}`, {state: {data: selectedResult}});
        } else {
            // Xử lý trường hợp kết quả không được tìm thấy
        }
    }
    const fetchApi = async () => {
        if(getDataSuccess) {setDataSuccess(false)}
        try {
            const res = await httpRequest.get(`quantrang/individual`, {
                params: { id, year: selectedYear },
            });
            setYears(res.years);
            setResults(res.results);
            setState(res.results);
            setInfoKeys(res.infoKeys);
            setSizeKeys(res.sizeKeys);
            setDataKeys(res.dataKeys);
            setCriterion(res.criterion);
            setTippyData(res.receivedData);
            setFieldDisplayMapping(res.fieldDisplayMapping);
            setDataSuccess(true)
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchApi();
    }, [id, selectedYear]);
    useEffect(() => {
        // Thiết lập dataUpdate khi dữ liệu từ server thay đổi
        setDataUpdate((prev) => {
            const data = results.find(result => result.year == selectedYear);
            if(data) {
                return {
                    ...prev,
                    info: data.info,
                    size: data.size
                };
            }
        });
        setOriginalData((prev) => {
            const data = results.find(result => result.year == selectedYear);
            if(data) {
                return {
                    ...prev,
                    info: data.info,
                    size: data.size
                };
            }
        });
    }, [results, selectedYear]);

    const patchDataUpdate = async (individualData) => {
        try {
            await httpRequest.patch(`quantrang/individual/${id}?year=${selectedYear}`, individualData);
            fetchApi();
        } catch (error) {
            console.log(error);
        }
    };
    const handleOnchangeInputInfo = (e) => {
        const { name, value } = e.target;
        setDataUpdate((prev) => {
            return { ...prev, info: {...prev.info, [name]: value} };
        });
    };
    const handleOnchangeInputSize = (e) => {
        const { name, value } = e.target;
        setDataUpdate((prev) => {
            return { ...prev, size: {...prev.size, [name]: value} };
        });
    };
    const handleClickDecreseBtn = () => {
        navigate(`/quantrang/decrease`, {state: {data: results.find(result => result.year == selectedYear)}});
    
    }
    useEffect(() => {
        if (JSON.stringify(dataUpdate) !== JSON.stringify(originalData)) {
            setIsUpdate(true);
        } else {
            setIsUpdate(false);
        }
    }, [dataUpdate]);
    
    return (
        setDataSuccess ? (<div className={cx('wrapper')}>
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
                    onChange={e => setSelectedYear(e.target.value)}
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
                <Button onClick={ handleOnclickDispensationBtn} primary>
                    Cấp phát
                </Button>
                <Button primary onClick={handleClickDecreseBtn}>Giảm</Button>
            </div>
        </div>
        <form className={cx('header')}>
            <div className={cx('colunm')}>
                {infoKeys.map((infoKey) => ( infoKey !== 'ID' ?
                    <div key={infoKey} className={cx('info-element')}>
                        <label className={cx('label-info')}>{fieldDisplayMapping[infoKey]} </label>
                        <input
                            disabled={infoKey === 'fullName' || infoKey === 'gender' || infoKey === 'PHCDD' || infoKey === 'lotteryNumber'}
                            defaultValue={
                                results.find((result) => result.year == selectedYear)?.info?.[infoKey] || ''
                            }
                            name={infoKey}
                            onChange={handleOnchangeInputInfo}
                            className={cx('input-info')}
                            placeholder={fieldDisplayMapping[infoKey]}
                        />
                    </div> : null
                ))}
            </div>
            <div className={cx('colunm')}>
                {sizeKeys.map((sizeKey) => ( 
                    <div key={sizeKey} className={cx('info-element')}>
                        <label className={cx('label-info')}>{fieldDisplayMapping[sizeKey]} </label>
                        <input
                            defaultValue={
                                results.find((result) => result.year == selectedYear)?.size?.[sizeKey] || ''
                            }
                            name={sizeKey}
                            onChange={handleOnchangeInputSize}
                            className={cx('input-info')}
                            placeholder={fieldDisplayMapping[sizeKey]}
                        />
                    </div>
                ))}
            </div>
        </form>
        <div className={cx('body')}>
            <Table bordered responsive className={cx('table')}>
                <thead>
                    <tr>
                        <th className={cx('year')}>Năm</th>
                        {dataKeys.map((dataKey) => (
                            <th className={cx('text-justify')} key={dataKey}>
                                {fieldDisplayMapping[dataKey]}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {results.map((result) => {
                        return (
                            <Fragment key={result._id}>
                                <tr key={result._id}>
                                    <td rowSpan={2}>{result.year}</td>
                                    {dataKeys.map((dataKey) =>
                                        tippyData?.[result.year][dataKey] ? (
                                            <Tippy
                                                key={dataKey}
                                                content={
                                                    <div>
                                                        {tippyData?.[result.year][dataKey].map((item, ind) => {
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
                                                <td key={dataKey}>{result.data[dataKey] || null}</td>
                                            </Tippy>
                                        ) : (
                                            <td key={dataKey}>{result.data[dataKey] || null}</td>
                                        ),
                                    )}
                                </tr>
                                <tr key={result.year}>
                                        {dataKeys.map((h) => {
                                            return (<td className={cx('bg-dark', 'text-light')} key={h}>{criterion[result.year] ? criterion[result.year][h] || null : null}</td>)
                                        })}
                                </tr>
                            </Fragment>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    </div>) : null
    );
}

export default Individual;
