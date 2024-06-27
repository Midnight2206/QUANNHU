import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';

import style from './sharedMilitaryEquipment.module.scss'
import Button from '~/components/Button';
import CreateEquipment from './createEquipment'
import httpRequest from '~/utils/httpRequest';

const cx = classNames.bind(style)
function SharedMilitaryEquipment() {
    const [namePart, setNamePart] = useState('')
    const [showCreateEquipment, setShowCreateEquipment] = useState(false)
    const [equipments, setEquipments] = useState([])
    const [parts, setParts] = useState([])
    const handleCloseCreateEquipment = () => {
        setShowCreateEquipment(false)
    }
    const postNamePart = async () => {
        try {
            await httpRequest.post('shared/create-part', {data: namePart})
            
        } catch (error) {
            console.log(error)
        }
    }
    const getAPI = async () => {
        try {
            const res = await httpRequest.get('shared')
            setParts(res.data.partsName)
            setEquipments(res.data.equipments)
        } catch (error) {
            
        }
    }
    useEffect(() => {
        getAPI()
    }, [])
    console.log(equipments)
    return <div className={cx("wrapper")}>
        <div className={cx("header")}>
            <h1>QUÂN TRANG DÙNG CHUNG</h1>
            <Button onClick={() => setShowCreateEquipment(true)} primary>Tạo mới loại quân trang</Button>
            <div>
                <input onChange={e => setNamePart(e.target.value)} placeholder='Nhập tên đơn vị'/>
                <Button onClick={() => {postNamePart()}} primary>Thêm đơn vị</Button>
            </div>
        </div>
        <div className={cx("body")}>
            {showCreateEquipment && <CreateEquipment onHide = {handleCloseCreateEquipment} />}
            <Table hover bordered responsive>
                <thead>
                    <tr>
                        <th>Tên quân trang</th>
                        <th>ĐVT</th>
                        {parts.map(part => (
                            <th key={part}>{part}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {equipments.map(equipment => (
                        <tr key={equipment.name}>
                            
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
        <div className={cx("footer")}></div>
    </div>
}

export default SharedMilitaryEquipment;