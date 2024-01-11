import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames/bind';

import style from './importList.module.scss';

const cx = classNames.bind(style);
function ImportList() {
    const [excelData, setExcelData] = useState(null);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];

        // Tạo đối tượng FileReader để đọc file
        const reader = new FileReader();

        // Sự kiện khi đọc file hoàn tất
        reader.onload = function (e) {
            try {
                // Đọc dữ liệu từ file
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Lấy dữ liệu từ sheet đầu tiên (index 0)
                const sheetName = workbook.SheetNames[0];
                const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

                // Lưu dữ liệu vào state
                setExcelData(sheetData);
            } catch (error) {
                console.error('Error reading the Excel file:', error);
            }
        };

        // Đọc file nhị phân
        reader.readAsArrayBuffer(file);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: '.xlsx, .xls',
    });

    return (
        <div>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Thả file Excel vào đây hoặc click để chọn</p>
            </div>

            {excelData && (
                <div>
                    <h2>Dữ liệu từ file Excel:</h2>
                    <pre>{JSON.stringify(excelData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}


export default ImportList;
