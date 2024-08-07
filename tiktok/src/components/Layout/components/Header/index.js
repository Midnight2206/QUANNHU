import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faMagnifyingGlass, faSpider, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';
import { useState } from 'react';

import {Wrapper as PopperWrapper} from '~/components/Popper'
import styles from './Header.module.scss';
import images from '~/assets/images';
import AccountItems from '~/components/AccountItems';
import Button, {btnSizes, btnStyles} from '~/components/Button';


const cx = classNames.bind(styles);
function Header() {
    const [searchResult, setSearchResult] = useState([])
    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('logo')}>
                    <img src={images.logo} alt="Tiktok" />
                </div>
                <Tippy
                    interactive
                    visible = {true}
                    
                    render={attrs => (
                        <div className={cx('search-result')} tabIndex='-1' {...attrs}>
                            <PopperWrapper>
                                <h4 className={cx('search-title')}>Accounts</h4>
                                <AccountItems />
                                <AccountItems />
                                <AccountItems />

                            </PopperWrapper>
                        </div>
                    )}
                >
                    <div className={cx('search')}>
                        <input placeholder="Search" />
                        <button className={cx("clear")}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
    
                        <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />
    
                        <button className={cx('search-btn')}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </div>
                </Tippy>
                <div className={cx('action')}>
                    <Button btnStyle = {btnStyles.text}>Log In</Button>
                </div>
            </div>
        </header>
    );
}

export default Header;
