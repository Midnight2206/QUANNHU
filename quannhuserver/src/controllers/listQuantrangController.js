import connect from "../configs/model";
import * as crypto from "crypto";
import * as unorm from "unorm";

class listQuantrangController {
  async render(req, res, next) {
    let listquantrangConect;
    let listdispensationsConect
    const year = req.query.year
    try {
      listquantrangConect = await connect.listquantrang.getConnection();
      listdispensationsConect = await connect.listdispensations.getConnection()

      // Lấy danh sách tên các bảng
      const [tableNames] = await listquantrangConect.query("SHOW TABLES");

      // Nhận tableName từ client (ví dụ: nhận từ query params)
      const tableName = year;

      if (!tableName) {
        res.status(400).json({ error: "Missing tableName in request" });
        return;
      }

      // Kiểm tra xem tableName có tồn tại trong danh sách tableNames không
      const isTableNameValid = tableNames.some(
        (table) => table.Tables_in_listquantrang === tableName
      );

      if (!isTableNameValid) {
        res.status(400).json({ error: "Invalid tableName" });
        return;
      }

      // Lấy thông tin cột và dữ liệu từ bảng cụ thể
      const [columns1] = await listquantrangConect.query(`DESCRIBE \`${tableName}\``);
      const [columns2] = await listdispensationsConect.query(`DESCRIBE \`${tableName}\``)
      const mergeArrCol = (col1, col2) => {
        col2 = col2.slice(1)
        return [...col1, ...col2]
      }
      const columns = mergeArrCol(columns1, columns2)
      const columnNames = columns.map((column) => column.Field);
      const [militaries] = await listquantrangConect.query(
        `SELECT * FROM \`${tableName}\``
      );
      const dispensations = []
      for (const military of militaries) {
        
          const [dispensation] = await listdispensationsConect.query(
            `SELECT * FROM \`${tableName}\` WHERE ID = ?`,
            [military.ID]
          );
          dispensations.push(dispensation)
        
      }
      console.log(dispensations)
      
      // Trả về dữ liệu cho client
      res.status(201).json({ columnNames, militaries, dispensations, tableNames });
    } catch (error) {
      console.error("Lỗi khi thực hiện truy vấn:", error);
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    } finally {
      if (listquantrangConect) {
        listquantrangConect.release();
      }
      if(listdispensationsConect) {
        listdispensationsConect.release()
      }
    }
  }
  async add(req, res, next) {
    const data = req.body;
    const year = req.query.year;
    let connection;
    let duplicateID = [];
    const setID = (fullName, CDD, sex) => {
      const inputString = fullName + CDD;
      const normalizedString = unorm.nfkd(inputString);
      const hash = crypto.createHash("sha256");
      hash.update(normalizedString);
      let sexId;
      sex === "Nam" ? (sexId = 1) : (sexId = 0);
      return hash.digest("hex") + sexId;
    };

    // Kiểm tra năm có hợp lệ
    if (!year) {
      return res
        .status(404)
        .json({ success: false, message: "No year data has been entered yet" });
    }

    // Kiểm tra nếu dữ liệu không tồn tại hoặc không phải là đối tượng
    if (!data || typeof data !== "object") {
      return res
        .status(404)
        .json({ success: false, message: "Invalid data format" });
    }

    try {
      // Sử dụng pool.getConnection để lấy kết nối từ pool
      connection = await connect.listquantrang.getConnection();
      const [tableNames] = await connection.query("SHOW TABLES");
      const isTableNameValid = tableNames.some(
        (table) => table.Tables_in_listquantrang === year
      );
      if (!isTableNameValid) {
        return res
          .status(405)
          .json({ success: false, message: "No data found for this year" });
      }

      // Lấy danh sách ID trong DB
      let [listID] = await connection.query(`SELECT ID FROM \`${year}\``);

      // Sử dụng Promise.all để đảm bảo tất cả các truy vấn được thực hiện trước khi release kết nối
      await Promise.all(
        Object.values(data).map(async (item, index) => {
          // Kiểm tra nếu item không phải là đối tượng
          if (typeof item !== "object") {
            console.log(`Invalid data format for item at index ${index}`);
            return;
          }
          const itemId = setID(
            item["Họ và tên"],
            item["PH CDD"],
            item["Giới tính"]
          );
          // Kiểm tra trùng lặp ID
          
          if (listID.some((item) => item.ID === itemId)) {
            duplicateID.push(item);
          } else {
            // Tạo ID cho dữ liệu
            item.ID = itemId;
            listID.push({'ID': itemId})
            // Thực hiện truy vấn SQL để chèn dữ liệu vào cơ sở dữ liệu
            await connection.query(`INSERT INTO \`${year}\` SET ?`, item);
          }
        })
      );

      // Phản hồi cho client
      if (duplicateID.length === 0) {
        res
          .status(200)
          .json({ success: true, message: "Data inserted successfully" });
      } else {
        res
          .status(400)
          .json({
            success: false,
            message: "Duplicate data",
            failData: duplicateID,
          });
      }
    } catch (error) {
      console.error("Lỗi khi chèn dữ liệu:", error);
      res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    } finally {
      if (connection) {
        // Release kết nối vào pool sau khi sử dụng xong
        connection.release();
      }
    }
  }
  async search(req, res, searchQuery, year) {
    let connection;
    try {
      connection = await connect.listquantrang.getConnection();
      const tableName = year;
      const [tableNames] = await connection.query("SHOW TABLES");
      if (!tableName) {
        res.status(400).json({ error: "Missing tableName in request" });
        return;
      }
      const isTableNameValid = tableNames.some(
        (table) => table.Tables_in_listquantrang === tableName
      );
      if (!isTableNameValid) {
        res.status(400).json({ error: "Invalid tableName" });
        return;
      }

      if (!searchQuery) {
        res
          .status(400)
          .json({ error: "Missing search query in request params" });
        return;
      }

      const [results] = await connection.query(
        `SELECT * FROM \`${tableName}\` WHERE \`Họ và tên\` COLLATE utf8mb4_general_ci LIKE ?`,
        [`%${searchQuery}%`]
      );
      return results;
    } catch (error) {
      console.error("Lỗi khi thực hiện truy vấn:", error);
      // res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}

module.exports = new listQuantrangController();
