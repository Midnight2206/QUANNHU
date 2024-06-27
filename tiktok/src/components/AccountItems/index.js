import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './AccountItems.module.scss';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
function AccountItems({ children }) {
    return (
        <div className={cx('wrapper')}>
            <img
                className={cx('avatar')}
                src="https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/f545441df5454841679362047c4c8745.jpeg?x-expires=1698570000&x-signature=5AetLhmxgr6pY4cU%2FxmgNTTVGCQ%3D"
                alt="avatar"
            />
            <div className={cx('info')}>
                <h4 className={cx('name')}>
                    <span>Trần Nguyễn Trúc Mai</span>
                    <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />
                </h4>
                <div className={cx('nickname')}>
                    <p>TrucMai</p>
                </div>
            </div>
        </div>
    );
}

export default AccountItems;
