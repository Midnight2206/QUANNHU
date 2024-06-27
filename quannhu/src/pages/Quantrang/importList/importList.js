import React, { useState } from 'react';
import unorm from 'unorm';
import httpRequest from '~/utils/httpRequest';
import {read, utils} from 'xlsx';
import classNames from 'classnames/bind';
import style from './importList.module.scss'
import Button from '~/components/Button';

const cx = classNames.bind(style)

function ImportDataFromExcel() {
  const [jsonData, setJsonData] = useState(null);
  const [year, setYear] = useState('')
  const [errData, setErrData] = useState([])

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = utils.sheet_to_json(worksheet, { header: 1 });

      // Lấy dòng đầu tiên làm key, các dòng tiếp theo làm value
      const keys = rows[1];
      const values = rows.slice(2);

      // Tạo mảng các đối tượng JSON từ dữ liệu
      const jsonData = values.map(row => {
        const obj = {};
        keys.forEach((key, index) => {
          obj[key] = row[index];
        });
        return obj;
      });
      setJsonData(JSON.parse(unorm.nfc(JSON.stringify(jsonData))))
    };
    reader.readAsArrayBuffer(file);
    
  };
  const handleChangeInputYear = e => {
    setYear(e.target.value)
  }
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setErrData(prevErrData => {
      const updatedErrData = [...prevErrData];
      updatedErrData[index][unorm.nfc(name)] = value;
      return updatedErrData;
    });
    
  };
    
  const postData = async () => {
    try {
      const res = await httpRequest.post('/quantrang/import', {
        data: jsonData,
        year: year
      })
      setErrData(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  const resendData = async () => {
    try {
      const res = await httpRequest.patch('/quantrang/add', {
        data: errData,
        year: year
      })
      setErrData(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  const handleResend = () => resendData()
  const handleClickImportButton = () => postData()
  console.log(jsonData)
  return (
    <div className={cx('wrapper')}>
      <div className={cx('title')}>
          <h1>IMPORT DANH SÁCH CẤP PHÁT QUÂN TRANG NĂM</h1>
          <input className={cx('inputYear')} placeholder='Năm' onChange={handleChangeInputYear}/>
          <Button primary to={'/quantrang'}>Trở lại</Button>
      </div>
      <div className={cx('body')}>
        <div className={cx('importFile')}>
          <input type="file" onChange={handleFileChange} />
          <button className={cx('importButton')} onClick={handleClickImportButton}>Import</button>
        </div>
        <div className={cx('errorData')}>
          <h1>Danh sách quân nhân trùng thông tin</h1>
          {errData.length >0 ? errData.map((errdt, i) => {
            return (
              
                <div className={cx("wrapper-errdt")} key={i}>
                  <input className={cx("wrapper-errdt-input")} name='fullName' onChange={(e) => handleInputChange(e, i)} placeholder="Họ và tên" defaultValue={errdt.fullName}/>
                  <input className={cx("wrapper-errdt-input")} name='rank' readOnly={true} placeholder="Cấp bậc" defaultValue={errdt.rank}/>
                  <input className={cx("wrapper-errdt-input")} name='unit' readOnly={true} placeholder="Đơn vị" defaultValue={errdt.unit}/>
                  <input className={cx("wrapper-errdt-input")} name='PHCDD' readOnly={true} placeholder="PH CCĐ" defaultValue={errdt.PHCDD}/>
                  <input className={cx("wrapper-errdt-input")} name='gender' readOnly={true} placeholder="Giới tính" defaultValue={errdt.gender}/>
  
                </div>
                
              
            )
          }) : null}
          <Button primary onClick={() => handleResend()}>Gửi lại</Button>
        </div>
      </div>
      
    </div>
  );
}

export default ImportDataFromExcel;


