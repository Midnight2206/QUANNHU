import classNames from "classnames/bind";
import 'bootstrap/dist/css/bootstrap.min.css';

import style from './GiaoNhanSoQTCN.module.scss'
import React from "react";

const cx = classNames.bind(style)

const GiaoNhanSoQTCN = React.forwardRef( ({data}, ref) => {
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
                                <p className={cx('top-para')}>TIỂU ĐOÀN KTHCSB</p>
                                <p><strong>QUÂN NHU</strong></p>
                            </div>
                            <div className={cx('center-title')}>
                                <h3><strong>GIẤY GIAO NHẬN</strong></h3>
                                <p><i>{formatDate(data?.otherInfo?.dateOfSubmission)}</i></p>
                            </div>
                            <div className={cx('right-title')}>
                                <p><strong>Mẫu số 03/TMKHQN</strong></p>
                                <p>Số: {data.id} /GGN</p>
                            </div>
                        </div>
                        {/* Phần thông tin người nhận */}
                        <div className={cx("invoice-recipient-info")}>
                            
                            <p className={cx('line-left')}>Họ và tên người giao: {data?.otherInfo?.bookSubmitter}</p>
                            
                            <p>     Đã nộp sổ QTCN số {data?.info?.lotteryNumber} của đồng chí {data?.info?.fullName} và giấy giới thiệu quân trang số .......... Ngành Quân nhu xác nhận nội dung bảo đảm như sau:</p>
                            <p>     Đ/c: {data?.info?.fullName}</p>
                            <p>     PH, CCĐ lần đầu năm: {data?.info?.PHCDD}</p>
                            <p>     Cỡ số: Quân phục: {data?.size?.uniform}; Giày: {data?.size?.shoe}; Mũ: {data?.size?.hat}; Chiếu: {data?.size?.mat}; QT niên hạn: {data?.size?.duaration}</p>
                            <p>     Bảo đảm quân trang từ năm: {data?.otherInfo?.fromAnyYear}</p>
                            {/* Thêm thông tin khác nếu cần */}
                        </div>
                    </div>

                    

                    <div className={cx("invoice-footer")}>
                        {/* Phần chữ ký */}
                        <div className={cx("invoice-signature")}>
                            <p><b>Người Giao</b>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <b>{data?.otherInfo?.bookSubmitter}</b>
                            </p>
                            <p><b>Người Nhận</b>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                            </p>
                            <p><b>Trợ lý quân nhu</b>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <b>3/ Trần Văn Khánh</b>
                            </p>
                            {/* Thêm thông tin khác nếu cần */}
                        </div>
                    </div>
                </div>
     );
})

export default GiaoNhanSoQTCN;