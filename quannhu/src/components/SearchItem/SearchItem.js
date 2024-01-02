
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import Image from '~/components/Image';
import styles from './SearchItem.module.scss';
import images from '~/assets/images';

const cx = classNames.bind(styles);

function SearchItem({ data }) {
    return (
        <Link to={`/quantrang/individual/${data.ID}`} className={cx('wrapper')}>
            <Image className={cx('avatar')} src={images.avatar} alt={data.full_name} />
            <div className={cx('info')}>
                <h4 className={cx('name')}>
                    <span>{data['Họ và tên']} - PH, CCĐ: {data['PH CCĐ']}</span>
                </h4>
                <span className={cx('username')}>{data['Đơn vị']}</span>
            </div>
        </Link>
    );
}

export default SearchItem;