import Bills from "../configs/mongoDB/bill";
import connect from "../configs/model";

class warehouseController {
  async saveBill(req, res, next) {
    let connection
    try {
      connection = await connect.listquantrang.getConnection();
      const year = req.query.year;
      const id = req.query.ID;
      const data = req.body.dataInputCriterion;
      const info = req.body.info;
      const date = req.body.selectedDate;

      const newRecord = new Bills({
        year,
        date,
        info,
        data,
      });
      //   // Tạo mảng chứa các cặp tên cột và giá trị mới từ đối tượng data
      const updateData = Object.entries(data).map(([columnName, value]) => [
        columnName,
        value,
      ]);

      const [[currentData]] = await connection.query(
        `SELECT * FROM \`${year}\` WHERE ID = ?`,
        [id]
      );
      
      // Kiểm tra xem ID có tồn tại trong SQL không
      if (currentData.length === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }
      
      // Lặp qua các cặp tên cột và giá trị mới từ đối tượng data
      Object.entries(data).forEach(async ([columnName, value]) => {
        // Cộng giá trị mới vào giá trị hiện tại (nếu cột đó không phải là kiểu số, bạn có thể cần xử lý đặc biệt)
        const updatedValue = currentData[columnName] + parseInt(value, 10);
      
        // Thực hiện câu truy vấn cập nhật giá trị
        await connection.query(
          `UPDATE \`${year}\` SET \`${columnName}\` = ? WHERE ID = ?`,
          [updatedValue, id]
        );
      });
      newRecord
        .save()
        .then((record) =>
          res.status(201).json({ message: "Record created successfully", num: record.num })
        )
        .catch(() => res.status(500).json({ message: "Error on server" }));
    } catch (error) {
      res.status(500).json({ error });
    } finally {
        if (connection) {
          connection.release();
        }
      }
  }
}

module.exports = new warehouseController();
