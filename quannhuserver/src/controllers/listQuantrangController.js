import * as crypto from "crypto";
import * as unorm from "unorm";
import Listquantrang from "../configs/mongoDB/listquantrang";
import fieldDisplayMapping from "../configs/mapping";

class listQuantrangController {
  async render(req, res, next) {
    const year = req.query.year;
    try {
      const doc = await Listquantrang.findOne({year: year})
      const listDatas = doc.list
      const infoKeys = Object.keys(Listquantrang.schema.paths.list.schema.tree.info).filter(item => !item.includes('_'))
      const infoHeaders = infoKeys.map(element => {
        return fieldDisplayMapping[element]
      })
      const sizeKeys = Object.keys(Listquantrang.schema.paths.list.schema.tree.size).filter(item => !item.includes('_'));
      const sizeHeaders = sizeKeys.map(element => {
        return fieldDisplayMapping[element]
      })
      const dataKeys = Object.keys(Listquantrang.schema.paths.list.schema.tree.data).filter(item => !item.includes('_'));
      const dataHeaders = dataKeys.map(element => {
        return fieldDisplayMapping[element]
      })
      
      const years = await Listquantrang.distinct('year')
      res
        .status(201)
        .json({infoKeys, sizeKeys, dataKeys, years, listDatas, dataHeaders, infoHeaders, sizeHeaders});
    } catch (error) {
      console.error("Lỗi khi thực hiện truy vấn:", error);
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    } 
  }
  async import(req, res) {
    try {
      const data = req.body.data;
      const year = req.body.year;
      const listID = [];
      const errData = [];
      const setID = (fullName, CDD, sex) => {
        const inputString = fullName + CDD;
        const normalizedString = unorm.nfkd(inputString);
        const hash = crypto.createHash("sha256");
        hash.update(normalizedString);
        let sexId;
        sex === "Nam" ? (sexId = 1) : (sexId = 0);
        return hash.digest("hex") + sexId;
      };
      const infoKeys = Object.keys(
        Listquantrang.schema.paths.list.schema.tree.info
      );
      const sizeKeys = Object.keys(
        Listquantrang.schema.paths.list.schema.tree.size
      );
      const dataKeys = Object.keys(
        Listquantrang.schema.paths.list.schema.tree.data
      );
      const newRecoder = {
        year: year,
        list: [],
      };

      for (let dt of data) {
        let ID = setID(
          dt.fullName,
          dt.PHCDD,
          dt.gender
        );
        if (listID.includes(ID)) {
          errData.push(dt);
        } else {
          listID.push(ID);
          const listItem = {
            info: {},
            size: {},
            data: {},
          };
          for (let element of infoKeys) {
            listItem.info[element] = dt[element];
            listItem.info.ID = ID;
          }
          for (let element of sizeKeys) {
            listItem.size[element] = dt[element];
          }
          for (let element of dataKeys) {
            listItem.data[element] = dt[element];
          }
          newRecoder.list.push(listItem);
        }
      }

      await Listquantrang.create(newRecoder);

      if (errData.length === 0) {
        res.status(200).json([]);
      } else {
        res.status(200).json(JSON.parse(unorm.nfc(JSON.stringify(errData))));
      }
    } catch (error) {
      console.error("Lỗi:", error);
      res.status(500).json("Lỗi máy chủ");
    }
  }
  async add(req, res, next) {
    try {
      const data = req.body.data;
      const year = req.body.year;
      const listID = [];
      const recoder = await Listquantrang.findOne({ year: year });

      // Lặp qua mảng list và lấy toàn bộ giá trị của thuộc tính ID
      for (const item of recoder.list) {
        listID.push(item.info.ID);
      }
      const errData = [];
      const setID = (fullName, CDD, sex) => {
        const inputString = fullName + CDD;
        const normalizedString = unorm.nfkd(inputString);
        const hash = crypto.createHash("sha256");
        hash.update(normalizedString);
        let sexId;
        sex === "Nam" ? (sexId = 1) : (sexId = 0);
        return hash.digest("hex") + sexId;
      };
      const infoKeys = Object.keys(
        Listquantrang.schema.paths.list.schema.tree.info
      );
      const sizeKeys = Object.keys(
        Listquantrang.schema.paths.list.schema.tree.size
      );
      const dataKeys = Object.keys(
        Listquantrang.schema.paths.list.schema.tree.data
      );
      for (let dt of data) {
        let ID = setID(
          dt.fullName,
          dt.PHCDD,
          dt.gender
        );
        if (listID.includes(ID)) {
          errData.push(dt);
        } else {
          listID.push(ID);
          const listItem = {
            info: {},
            size: {},
            data: {},
          };
          for (let element of infoKeys) {
            listItem.info[element] = dt[element];
            listItem.info.ID = ID;
          }
          for (let element of sizeKeys) {
            listItem.size[element] = dt[element];
          }
          for (let element of dataKeys) {
            listItem.data[element] = dt[element];
          }
          Listquantrang.findOneAndUpdate(
            { year: year },
            { $push: { list: listItem } },
            { new: true }
          )
            .then((updatedList) => {
              console.log("Dữ liệu đã được thêm vào mảng list:");
            })
            .catch((error) => {
              console.error("Lỗi khi thêm dữ liệu:", error);
            });
        }
      }
      if (errData.length === 0) {
        res.status(200).json([]);
      } else {
        res.status(200).json(JSON.parse(unorm.nfc(JSON.stringify(errData))));
      }
    } catch (error) {
      console.error("Lỗi:", error);
      res.status(500).json("Lỗi máy chủ");
    }
  }
  async search(req, res, next) {
    try {
      const year = req.query.year
      const searchQuery = unorm.nfc(req.query.q)
      Listquantrang.findOne({year: year})
        .then (doc => {
          if(doc) {
            const regex = new RegExp(searchQuery, 'i')
            const results = doc.list.filter(item => regex.test(item.info.fullName))
            res.status(200).json(results)
          } else {
            res.status(400).json('Không tìm thấy năm yêu cầu')
          }

        })
        .catch((err) => {
          console.error("Lỗi khi tìm kiếm:", err);

        })
    } catch (error) {
      console.error("Lỗi khi thực hiện truy vấn:", error);
      // res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
}

module.exports = new listQuantrangController();
