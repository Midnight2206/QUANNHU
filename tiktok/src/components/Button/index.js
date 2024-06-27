import classNames from 'classnames/bind';
import styles from './Button.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);
export const btnStyles = {
    primary: 'primary',
    text: 'text',
    outline: 'outline',
    blackOutline: 'black-outline',
};
export const btnSizes = {
    small: 'small',
    large: 'large',
};

function Button({ children, to, disable, href, btnStyle = btnStyles.primary, onClick, btnSize, ...passProps }) {
    let Comp = 'button';
    const classes = cx('wrapper', {
        [btnStyle]: btnStyle,
        [btnSize]: btnSize,
    });
    const props = {
        onClick,
        ...passProps,
    };
    if (to) {
        Comp = Link;
    } else if (href) {
        Comp = 'a';
    }
    if (disable) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
    }
    return (
        <Comp className={classes} {...props}>
            <span className={cx('content')}>{children}</span>
        </Comp>
    );
}

export default Button;
