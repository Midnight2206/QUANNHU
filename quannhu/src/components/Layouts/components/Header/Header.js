import classNames from 'classnames/bind';

import Button, {btnSizes, btnStyles} from '~/components/Button';
import logo from '~/assets/images/logo.png';
import styles from './Header.module.scss';

const cx = classNames.bind(styles);

function Header() {
    return (
        <header className={cx('wrapper')}>
            <div className={cx('container')}>
                <img className={cx('logo')} src={logo} />
                <div className={cx('search')}>SEARCH</div>
                <div className={cx('action')}>
                    <Button>Đăng nhập</Button>
                </div>
            </div>
        </header>
    );
}

export default Header;
