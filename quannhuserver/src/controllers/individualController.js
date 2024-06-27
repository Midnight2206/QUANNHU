import * as crypto from "crypto";
import * as unorm from "unorm";
import fieldDisplayMapping from "../configs/mapping"
import Listquantrang from "../configs/mongoDB/listquantrang";
import Bills from "../configs/mongoDB/bill";
import Criterion from "../configs/mongoDB/criterion";

class IndividualController {
  async render(req, res) {
    const id = req.query.id;
    const year = req.query.year;

    try {
      const criterion = {};
      let results = [];
      const receivedData = {};
      const years = await Listquantrang.distinct("year");
      years.map((year) => {
        receivedData[year] = {};
      });
      const infoKeys = Object.keys(Listquantrang.schema.paths.list.schema.tree.info).filter(item => !item.includes('_'))
      const sizeKeys = Object.keys(Listquantrang.schema.paths.list.schema.tree.size).filter(item => !item.includes('_'));
      const dataKeys = Object.keys(Listquantrang.schema.paths.list.schema.tree.data).filter(item => !item.includes('_'));
      await Bills.find({ "info.ID": id })
        .then((docs) => {
          docs.map((doc) => {
            Object.keys(doc.data).map((item) => {
              let bill = {};

              bill.num = doc.num;
              bill.receiver = doc.info["Người nhận"];
              bill.adress = doc.info["Đơn vị"];
              bill.time = doc.date;
              if (typeof receivedData[doc.year][item] === "object") {
                receivedData[doc.year][item].push(bill);
              } else {
                receivedData[doc.year][item] = [bill];
              }
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
      const docs = await Listquantrang.find(
        { "list.info.ID": id },
        { "list.$": 1, year: 1 }
      );
      if (docs.length > 0) {
        results = docs.map((doc) => {
          // Lấy year của tài liệu hiện tại
          const { year } = doc;

          // Lấy danh sách từ tài liệu hiện tại và gắn ID của tài liệu và year vào mỗi phần tử trong danh sách
          return doc.list.map((item) => {
            return { ...item._doc, year }; // Gắn ID của tài liệu và year vào mỗi phần tử trong danh sách
          });
        });

        // Kết hợp tất cả các mảng con thành một mảng lớn
        results = results.flat();
      } else {
        console.log("Không tìm thấy tài liệu với ID:", id);
        return null;
      }
      for (const year of years) {
        const doc = await Criterion.findOne({ year: year });
        const result = results.find((result) => result.year === year);
        if (doc && result) {
          criterion[year] = doc.data[result.info.PHCDD];
        } else {
          console.log(`Không tìm thấy dữ liệu cho năm ${year}`);
          // Hoặc có thể gán giá trị mặc định cho criterion[year] nếu không tìm thấy dữ liệu
          // criterion[year] = defaultValue;
        }
      }
      res
        .status(200)
        .json({ results, criterion, dataKeys, infoKeys, sizeKeys, years, fieldDisplayMapping });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async update(req, res) {
    const id = req.params.id;
    const year = req.query.year;
    const data = req.body;
    try {
      
      
        const updatedDoc = await Listquantrang.findOneAndUpdate(
          { year: year, "list.info.ID": id},
          {$set: {
            "list.$.info": data.info,
            "list.$.size": data.size
          }},
          { new: true }
      );
      
      if (updatedDoc) {
          console.log("Phần tử đã được cập nhật:", updatedDoc);
      } else {
          console.log("Không tìm thấy phần tử để cập nhật.");
      }
      
      res.status(200).json({ message: "Cập nhật dữ liệu thành công." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
    
  }
}

module.exports = new IndividualController();
