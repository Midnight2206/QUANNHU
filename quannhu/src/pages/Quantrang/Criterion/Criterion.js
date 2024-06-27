import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import style from './Criterion.module.scss';
import * as httpRequest from '~/utils/httpRequest';
import Button from '~/components/Button';
import CreateCriterion from './CreateCriterion';
import UpdateCriterion from './UpdateCriterion';

const cx = classNames.bind(style);
function Criterion() {
    const [createCriterion, setCreateCriterion] = useState(true);
    const [dataHeaders, setDataHeaders] = useState([]);
    const [dataKeys, setDataKeys] = useState([]);
    const [listCCD, setListCCD] = useState([]);
    const [years, setYears] = useState([]);

    const fetchApi = async () => {
        try {
            const res = await httpRequest.get(`quantrang/criterion`);
            setDataHeaders(res.dataHeaders);
            setDataKeys(res.dataKeys);
            setListCCD(res.listCCD);
            setYears(res.years);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchApi();
    }, []);
    const toggleCreateCriterion = () => {
        setCreateCriterion((prevState) => !prevState); // Đảo ngược giá trị của createCriterion
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('body')}>
                {createCriterion ? (
                    <CreateCriterion dataHeaders={dataHeaders} dataKeys={dataKeys} listCCD={listCCD} />
                ) : years.length === 0 ? (
                    <h2 style={{ color: 'red' }}>Bạn chưa có bảng tiêu chuẩn quân trang nào trong csdl</h2>
                ) : (
                        <UpdateCriterion years={years} listCCD={listCCD} dataHeaders={dataHeaders} dataKeys={dataKeys} />
                )}
            </div>
            <div className={cx('footer')}>
                <Button onClick={toggleCreateCriterion} primary>
                    {createCriterion ? 'Chuyển sang Chỉnh sửa' : 'Chuyển sang Tạo mới'}
                </Button>
                <Button primary to="/quantrang">
                    Trở lại
                </Button>
            </div>
        </div>
    );
}

export default Criterion;
