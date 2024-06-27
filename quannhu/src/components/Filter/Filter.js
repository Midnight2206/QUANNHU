import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faFilter } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef, useMemo } from 'react';

import styles from './Filter.module.scss';
import { trim } from 'lodash';

const cx = classNames.bind(styles);

function Filter({ title, name, data, onOkClick, onValueChange, onChangeFilted}) {
    const dataNotNull = data.map(item => {
        if (trim(item) === '') {
            return '<blank>';
        } else {
            return trim(item);
        }
    });
    const [filted, setFilted] = useState(false)
    const uniqueData = useMemo(() => [...new Set(dataNotNull)], [dataNotNull]);
    const [selectedValue, setSelectedValue] = useState([]);
    const [isFilterTableVisible, setIsFilterTableVisible] = useState(false);
    const filterTableRef = useRef(null);

    const handleChange = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        setSelectedValue((prev) => {
            const newValue = isChecked ? [...prev, value] : prev.filter((item) => item !== value);
            return newValue;
        });
    };

    const handleHideFilterTable = () => setIsFilterTableVisible(!isFilterTableVisible);
    const handleClickCancelBtn = () => setIsFilterTableVisible(false);
    useEffect(() => {
        onValueChange({[name]: selectedValue});
    }, [selectedValue, name]);
    useEffect(() => {
        onChangeFilted(name, filted);
    }, [filted, name]);
    const handleChangeAll = (event) => {
        const isChecked = event.target.checked;
        const newValue = isChecked ? uniqueData : [];
        setSelectedValue(newValue);
        
    };
    
    const handleOkClick = () => {
        if (onOkClick) {
            onOkClick();
        }
        setIsFilterTableVisible(false);
        setFilted(selectedValue.length > 0 && selectedValue.length < uniqueData.length);
    };

    useEffect(() => {
        if (isFilterTableVisible && filterTableRef.current) {
            const buttonRect = filterTableRef.current.getBoundingClientRect();
            const filterTableRect = filterTableRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;

            if (buttonRect.right + filterTableRect.width > viewportWidth) {
                filterTableRef.current.style.right = 'auto';
                filterTableRef.current.style.left = '0';
            } else {
                filterTableRef.current.style.right = '0';
                filterTableRef.current.style.left = 'auto';
            }
        }
    }, [isFilterTableVisible]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <label className={cx('label')} htmlFor="filter">
                    {title}
                </label>
                <button className={cx('button')} onClick={handleHideFilterTable}>
                    <FontAwesomeIcon icon={filted ? faFilter : (isFilterTableVisible ? faChevronUp : faChevronDown)} />
                </button>
            </div>
            {isFilterTableVisible && (
                <div className={cx('filter-table')} ref={filterTableRef}>
                    {uniqueData?.map((item, index) => (
                        <label key={index}>
                            <input
                                type="checkbox"
                                value={item}
                                checked={selectedValue.includes(item)}
                                onChange={handleChange}
                            />
                            {item}
                        </label>
                    ))}
                    <label>
                        <input
                            type="checkbox"
                            checked={uniqueData.length === selectedValue.length}
                            onChange={handleChangeAll}
                        />
                        Tất cả
                    </label>
                    <div className={cx('footer')}>
                        <button className={cx('footer-btn')} onClick={handleOkClick}>
                            OK
                        </button>
                        <button className={cx('footer-btn')} onClick={handleClickCancelBtn}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Filter;
