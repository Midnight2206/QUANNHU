import Bills from "../configs/mongoDB/bill";
import Listquantrang from "../configs/mongoDB/listquantrang"
class warehouseController {
  async saveBill(req, res, next) {
    try {
      const year = req.query.year;
      const id = req.query.ID;
      const data = req.body.dataInputCriterion;
      const info = req.body.info;
      const date = req.body.selectedDate;
  
      // Lấy danh sách quân trang có năm tương ứng
      const listquantrang = await Listquantrang.findOne({ year });
      if (!listquantrang) {
        console.log(`Không tìm thấy dữ liệu cho năm ${year}`);
        return res.status(404).json({ message: `Không tìm thấy dữ liệu cho năm ${year}` });
      }
  
      // Lấy phần tử có ID tương ứng trong list
      const itemToUpdate = listquantrang.list.find(item => item.info.ID === id);  
      if (!itemToUpdate) {
        console.log(`Không tìm thấy phần tử có ID ${id}`);
        return res.status(404).json({ message: `Không tìm thấy phần tử có ID ${id}` });
      }
  
      // Lấy dữ liệu hiện có từ list.data
      const currentData = itemToUpdate.data;
  
      // Cộng dữ liệu mới vào dữ liệu hiện có
      for (const [key, value] of Object.entries(data)) {
        currentData[key] = (currentData[key] || 0) + parseInt(value);
      }
  
      // Cập nhật lại list.data với dữ liệu đã được cộng
      itemToUpdate.data = currentData;
  
      // Lưu lại thay đổi trong danh sách quân trang
      await listquantrang.save();
  
      // Tạo mới bản ghi Bills
      const newRecord = new Bills({
        year,
        date,
        info,
        data,
      });
  
      // Lưu bản ghi Bills
      const record = await newRecord.save();
      res.status(201).json({ message: "Record created successfully", num: record.num });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Error on server" });
    }
  }
}  

module.exports = new warehouseController();
