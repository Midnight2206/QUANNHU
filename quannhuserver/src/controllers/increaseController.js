import increaseMilitaries from "../configs/mongoDB/increaseMilitaries";
import fieldDisplayMapping from "../configs/mapping";
import Listquantrang from "../configs/mongoDB/listquantrang";
import * as crypto from "crypto";
import * as unorm from "unorm";
class increaseController {
  async render(req, res, next) {
    try {
      const data = await increaseMilitaries.find();
      const infoKeys = Object.keys(increaseMilitaries.schema.tree.info).filter(
        (element) => element !== "ID"
      );
      const infoHeaders = infoKeys.map((element) => {
        return fieldDisplayMapping[element];
      });
      const sizeKeys = Object.keys(increaseMilitaries.schema.tree.size);
      const sizeHeaders = sizeKeys.map((element) => {
        return fieldDisplayMapping[element];
      });
      const otherInfoKeys = Object.keys(
        increaseMilitaries.schema.tree.otherInfo
      );
      const otherInfoHeaders = otherInfoKeys.map((element) => {
        return fieldDisplayMapping[element];
      });
      res
        .status(200)
        .json({
          infoKeys,
          sizeKeys,
          otherInfoKeys,
          infoHeaders,
          sizeHeaders,
          otherInfoHeaders,
          data,
        });
    } catch (error) {
      console.log(error);
    }
  }
  async increase(req, res, next) {
    try {
      const data = req.body.data;
      const year = data.otherInfo.fromAnyYear;
      const years = await Listquantrang.distinct("year");
      const setID = (fullName, CDD, sex) => {
        const inputString = fullName + CDD;
        const hash = crypto.createHash("sha256");
        hash.update(inputString);
        let sexId;
        sex === "Nam" ? (sexId = 1) : (sexId = 0);
        return hash.digest("hex") + sexId;
      };
      data.info.ID = setID(
        data.info.fullName,
        data.info.PHCDD,
        data.info.gender
      );

      if (years.includes(year)) {
        const listID = [];
        const recoder = await Listquantrang.findOne({ year: year });

        // Lặp qua mảng list và lấy toàn bộ giá trị của thuộc tính ID
        for (const item of recoder.list) {
          listID.push(item.info.ID);
        }
        if (listID.includes(data.info.ID)) {
          res.status(500).json({
            message: `Đã có 1 quân nhân trong danh sách năm ${year} cùng tên ${data.fullName}, giới tính ${data.gender}, năm PH CCĐ ${data.PHCDD}, nếu bạn chắc chắn muốn thêm quân nhân, vui lòng thêm 1 ký tự A, B, C, ... vào phía sau họ và tên để dễ dàng quản lý sau này`,
          });
        } else {
          Listquantrang.findOneAndUpdate(
            { year: year },
            { $set: { list: [...recoder.list, data] } },
            { new: true, upsert: false }
          )
            .then(() => {
              const newRecord = new increaseMilitaries(data);
              newRecord.save().then(() => res.json("Thành công"));
            })
            .catch(res.status(500).json("Thất bại"));
        }
      } else {
        const newRecord = new increaseMilitaries(data);
        newRecord
          .save()
          .then(() => res.status(200).json("Thành công"))
          .catch(res.status(500).json("Thất bại"));
      }
    } catch (error) {
      console.log(error);
      res.status(500).json("Lôi server");
    }
  }
  async list(req, res) {
    try {
      const data = await increaseMilitaries.find();
      const infoKeys = Object.keys(increaseMilitaries.schema.tree.info).filter(
        (element) => element !== "ID"
      );
      const infoHeaders = infoKeys.map((element) => {
        return fieldDisplayMapping[element];
      });
      const sizeKeys = Object.keys(increaseMilitaries.schema.tree.size);
      const sizeHeaders = sizeKeys.map((element) => {
        return fieldDisplayMapping[element];
      });
      const otherInfoKeys = Object.keys(
        increaseMilitaries.schema.tree.otherInfo
      );
      const otherInfoHeaders = otherInfoKeys.map((element) => {
        return fieldDisplayMapping[element];
      });
      res.status(200).json({
        infoKeys,
        sizeKeys,
        otherInfoKeys,
        infoHeaders,
        sizeHeaders,
        otherInfoHeaders,
        data,
      });
    } catch (error) {}
  }
  async filter(req, res) {
    try {
      const { PHCDD, tranferFrom, moveInTime, fromAnyYear } = req.body.params;
      const query = {};

      if (PHCDD && PHCDD.length) {
        if (PHCDD.includes("<blank>")) {
          query["info.PHCDD"] = {
            $in: PHCDD.filter((item) => item !== "<blank>").concat([
              null,
              undefined,
            ]),
          };
        } else {
          query["info.PHCDD"] = { $in: PHCDD };
        }
      }
      if (tranferFrom && tranferFrom.length) {
        if (tranferFrom.includes("<blank>")) {
          query["otherInfo.tranferFrom"] = {
            $in: tranferFrom
              .filter((item) => item !== "<blank>")
              .concat([null, undefined]),
          };
        } else {
          query["otherInfo.tranferFrom"] = { $in: tranferFrom };
        }
      }
      if (moveInTime && moveInTime.length) {
        if (moveInTime.includes("<blank>")) {
          query["otherInfo.moveInTime"] = {
            $in: moveInTime
              .filter((item) => item !== "<blank>")
              .concat([null, undefined]),
          };
        } else {
          query["otherInfo.moveInTime"] = { $in: moveInTime };
        }
      }
      if (fromAnyYear && fromAnyYear.length) {
        if (fromAnyYear.includes("<blank>")) {
          query["otherInfo.fromAnyYear"] = {
            $in: fromAnyYear
              .filter((item) => item !== "<blank>")
              .concat([null, undefined]),
          };
        } else {
          query["otherInfo.fromAnyYear"] = { $in: fromAnyYear };
        }
      }
      // Thực hiện truy vấn lấy dữ liệu từ database
      const result = await increaseMilitaries.find(query);

      // Gửi kết quả về cho client
      res.status(200).json({ data: result });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new increaseController();
