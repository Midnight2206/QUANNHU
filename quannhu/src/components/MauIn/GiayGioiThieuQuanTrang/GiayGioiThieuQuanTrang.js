import classNames from "classnames/bind";
import 'bootstrap/dist/css/bootstrap.min.css';

import style from './GiayGioiThieuQuanTrang.module.scss'
import React from "react";

const cx = classNames.bind(style)

const GiayGioiThieuQuanTrang = React.forwardRef( ({data}, ref) => {
    function formatDate(dateString) {
        if(dateString) {
            const [day, month, year] = dateString.split('/').map(Number);
            return `Ngày ${day} tháng ${month} năm ${year}`;
        } else {
            return '';
        }
      }
    
    return ( 
        <div ref={ref} className={cx("invoice")}>
                    <div className={cx("invoice-header")}>
                        <div className={cx('invoice-title')}>
                            <div className={cx('left-title')}>
                                <p className={cx('top-para')}>SƯ ĐOÀN 372</p>
                                <p>
                                    <strong>TRUNG ĐOÀN 925</strong>
                                </p>
                                    <hr className={cx('underline')} />
                                <p>Số: {data.number} /GT-QN</p>
                            </div>
                            <div className={cx('right-title')}>
                                <p className={cx('top-para')}><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong></p>
                                <p>
                                    <strong>Độc lập - Tự do - Hạnh phúc</strong>
                                </p>
                                    <hr className={cx('underline')} />
                                <p><i>Bình Định, {formatDate(data?.otherInfo?.dateMove)} </i></p>
                            </div>
                        </div>
                        <p className={cx('invoice-name')}><strong>GIẤY GIỚI THIỆU QUÂN TRANG</strong></p>
                        <p className={cx('invoice-name')}><strong>(Kèm theo sổ quân trang cá nhân)</strong></p>
                        {/* Phần thông tin người nhận */}
                        <div className={cx("invoice-recipient-info")}>
                            <p>Đơn vị: Trung đoàn 925</p>
                            <div className={cx('line-dup')}>
                                <p className={cx('line-left')}>Giới thiệu đ/c: {data?.info?.fullName}</p>
                                <p className={cx('line-right')}>Nhập ngũ: </p>
                            </div>
                            <div className={cx('line-dup')}>
                                <p className={cx('line-left')}>Cấp bậc: {data?.info?.rank}</p>
                                <p className={cx('line-right')}>Chức vụ:</p>
                            </div>
                            <p>Nay chuyển đến đơn vị: {data?.otherInfo?.tranferTo}</p>
                            <p>Theo quyết định số: {data?.otherInfo?.numberOfDecision}</p>
                            <p><strong>I. TRUNG ĐOÀN 925</strong></p>
                            <p>1. Quân trang thường xuyên: Hết tiêu chuẩn quân trang năm {+data?.otherInfo?.toAnyYear - 1}.</p>
                            <p>2. Quân trang niên hạn: Hết tiêu chuẩn quân trang niên hạn năm {+data?.otherInfo?.toAnyYear - 1}.</p>
                            <p><strong>II. ĐÈ NGHỊ ĐƠN VỊ MỚI BẢO ĐẢM</strong></p>
                            <p>1. Quân trang thường xuyên: Tiêu chuẩn quân trang từ năm {data?.otherInfo?.toAnyYear}.</p>
                            <p>2. Quân trang niên hạn: Tiêu chuẩn quân trang niên hạn năm {data?.otherInfo?.toAnyYear}.</p>
                        </div>
                    </div>

                    

                    <div className={cx("invoice-footer")}>
                        {/* Phần chữ ký */}
                        <div className={cx("invoice-signature")}>
                            <p><b>CHỨ KÝ QUÂN NHÂN</b>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <b>{data?.info?.fullName}</b>
                            </p>
                            <p><b>TRỢ LÝ QUÂN NHU</b>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <b>3/ Trần Văn Khánh</b>
                            </p>
                            <p><b>TL. TRUNG ĐOÀN TRƯỞNG</b> <br/>
                                <b>CHỦ NHIỆM HẬU CẦN</b>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <b>Trung tá Nguyễn Minh Tuấn</b>
                            </p>
                            {/* Thêm thông tin khác nếu cần */}
                        </div>
                    </div>
                </div>
     );
})

export default GiayGioiThieuQuanTrang;