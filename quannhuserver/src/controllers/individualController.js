import * as crypto from "crypto";
import * as unorm from "unorm";
import connect from "../configs/model";
import Bills from '../configs/mongoDB/bill'
import Criterion from "../configs/mongoDB/criterion";

class IndividualController {
  async render(req, res) {
    const id = req.query.id
    let connection;
    let listDispensationConnect
    try {
      const criterion = {}
      const head = []
      connection = await connect.listquantrang.getConnection();
      listDispensationConnect = await connect.listdispensations.getConnection();
      const [tableNames] = await connection.query("SHOW TABLES");
      const results = {};
      const dispensationData = {}
      const receivedData = {}
      tableNames.map((tableName) => {
        receivedData[tableName.Tables_in_listquantrang] = {}
      })
      await Bills.find({'info.ID': id})
        .then((docs) => {
          docs.map(doc => {
            Object.keys(doc.data).map(item => {
              let bill = {}
              
              bill.num = doc.num
              bill.receiver = doc.info['Người nhận']
              bill.adress = doc.info['Đơn vị']
              bill.time = doc.date
              if(typeof receivedData[doc.year][item] === 'object') {
                receivedData[doc.year][item].push(bill)
              } else {
                receivedData[doc.year][item] = [bill]
              }
            })
          })
        })
        .catch((err) => {
          console.log(err)
        })
      // Sử dụng Promise.all để chờ tất cả các truy vấn hoàn thành trước khi tiếp tục
      await Promise.all(
        tableNames.map(async (tableName) => {
          const query = `SELECT * FROM \`${tableName.Tables_in_listquantrang}\` WHERE ID = ?`;
          const [[result]] = await connection.query(query, [id]);

          // Gán kết quả vào đối tượng results
          results[tableName.Tables_in_listquantrang] = result;
          criterion[tableName.Tables_in_listquantrang] = 
          await Criterion.findOne({year: tableName.Tables_in_listquantrang})
            .then(doc => doc.data[result['PH CCĐ']])
            .catch(err => console.log(err))
        })
      );
      await Promise.all(
        tableNames.map(async (tableName) => {
          const query = `SELECT * FROM \`${tableName.Tables_in_listquantrang}\` WHERE ID = ?`;
          const [[result]] = await listDispensationConnect.query(query, [id]);
          // Gán kết quả vào đối tượng results
          dispensationData[tableName.Tables_in_listquantrang] = result
          const [columns] = await listDispensationConnect.query(`DESCRIBE \`${tableName.Tables_in_listquantrang}\``)
          const columnNames = columns.map(column => column.Field);
          head.push(columnNames)
        })
      );
      const heads = head.reduce((accumulator, currentArray) => {
        const uniqueElements = new Set([...accumulator, ...currentArray]);
        return Array.from(uniqueElements);
      }, []);
      const header = heads.slice(1)
      // Trả về kết quả cho client
      res.status(200).json( {results, dispensationData, receivedData, header, criterion});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      if (connection) {
        connection.release();
      }
      if (listDispensationConnect) {
        listDispensationConnect.release()
      }
    }
  }
  async update(req, res, id, year, data) {
    let connection;
    try {
      connection = await connect.listquantrang.getConnection();
      const setID = (fullName, CDD, sex) => {
        const inputString = fullName + CDD;
        const normalizedString = unorm.nfkd(inputString);
        const hash = crypto.createHash("sha256");
        hash.update(normalizedString);
        let sexId;
        sex === "Nam" ? (sexId = 1) : (sexId = 0);
        return hash.digest("hex") + sexId;
      };
      const itemId = setID(
        data["Họ và tên"],
        data["PH CDD"],
        data["Giới tính"]
      );
      let [listID] = await connection.query(`SELECT ID FROM \`${year}\``);
      if (listID.some((item) => item === itemId)) {
        res.status(406).json({message: "duplicate ID"})
      }
    //   // Tạo mảng chứa các cặp tên cột và giá trị mới từ đối tượng data
    const updateData = Object.entries(data).map(([columnName, value]) => [columnName, value]);

    // // Tạo chuỗi SET cho prepared statements
    const setClause = updateData.map(([columnName]) => `\`${columnName}\` = ?`).join(', ');

    // // Tạo mảng giá trị cho prepared statements
    const setValues = updateData.map(([, value]) => value);

    // // Thực hiện câu truy vấn cập nhật với prepared statements
    await connection.query(`UPDATE \`${year}\` SET ${setClause} WHERE ID = ?`, [...setValues, id]);

    res.status(200).json({ message: "Cập nhật dữ liệu thành công." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}

module.exports = new IndividualController();