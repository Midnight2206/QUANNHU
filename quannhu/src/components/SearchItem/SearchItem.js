
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import Image from '~/components/Image';
import styles from './SearchItem.module.scss';
import images from '~/assets/images';

const cx = classNames.bind(styles);

function SearchItem({ data, year }) {
    const navigate = useNavigate()
    const handleOnClick = () => {
        navigate(`/quantrang/individual/${data.info.ID}`, {state: {year: year}})
    }
    return (
        <div onClick={() => handleOnClick()} className={cx('wrapper')}>
            <Image className={cx('avatar')} src={images.avatar} alt={data.full_name} />
            <div className={cx('info')}>
                <h4 className={cx('name')}>
                    <span>{data.info.fullName} - PH, CCĐ: {data.info.PHCDD}</span>
                </h4>
                <span className={cx('username')}>{data.info.unit}</span>
            </div>
        </div>
    );
}

export default SearchItem;