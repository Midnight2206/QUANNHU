import decreaseMilitaly from "../configs/mongoDB/decreaseMilitaries";
import fieldDisplayMapping from "../configs/mapping";
import Listquantrang from "../configs/mongoDB/listquantrang";

class decreaseController {
  async render(req, res) {
    try {
      const infoKeys = Object.keys(decreaseMilitaly.schema.tree.info).filter(
        (element) => element !== "ID"
      );
      const infoHeaders = infoKeys.map((element) => {
        return fieldDisplayMapping[element];
      });
      const sizeKeys = Object.keys(decreaseMilitaly.schema.tree.size);
      const sizeHeaders = sizeKeys.map((element) => {
        return fieldDisplayMapping[element];
      });
      const otherInfoKeys = Object.keys(decreaseMilitaly.schema.tree.otherInfo);
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
        });
    } catch (error) {
      console.log(error);
    }
  }
  async decrease(req, res) {
    try {
      const { year, data } = req.body;
      if (!year || !data) {
        return res.status(400).json({ message: "Missing required fields" });
      } else {
        if (year === data.otherInfo.toAnyYear) {
          const listquantrang = await Listquantrang.findOne({ year: year });
          if (listquantrang) {
            const updatedData = listquantrang.list.filter(
              (item) => item.info.ID !== data.info.ID
            );
            listquantrang.list = updatedData;
            await listquantrang.save();
            const decreaseData = new decreaseMilitaly(data);
            await decreaseData.save();
            res.status(200).json({ message: `Quân nhân được giảm khỏi danh sách cấp phát năm ${year}` });
          } else {
            res.status(400).json({ message: `Lỗi dữ liệu` });
          }
        } else {
          const decreaseData = new decreaseMilitaly(data);
          await decreaseData.save();
          res.status(200).json({ message: `Quân nhân được thêm vào danh sách giảm không bảo đảm năm sau` });
        }
      }

    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async list(req, res) {
    try {
      const data = await decreaseMilitaly.find();
      const infoKeys = Object.keys(decreaseMilitaly.schema.tree.info).filter(
        (element) => element !== "ID"
      );
      const infoHeaders = infoKeys.map((element) => {
        return fieldDisplayMapping[element];
      });
      const sizeKeys = Object.keys(decreaseMilitaly.schema.tree.size);
      const sizeHeaders = sizeKeys.map((element) => {
        return fieldDisplayMapping[element];
      });
      const otherInfoKeys = Object.keys(decreaseMilitaly.schema.tree.otherInfo);
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
        
    }
  }
  async filter(req, res) {
    try {
        const { PHCDD, tranferTo, toAnyYear, dateMove, internalTransfer } = req.body.params;
        const query = {};

        if (PHCDD && PHCDD.length) {
            if (PHCDD.includes('<blank>')) {
                query['info.PHCDD'] = { $in: PHCDD.filter(item => item !== '<blank>').concat([null, undefined]) };
            } else {
                query['info.PHCDD'] = { $in: PHCDD };
            }
        }

        if (tranferTo && tranferTo.length) {
            if (tranferTo.includes('<blank>')) {
                query['otherInfo.tranferTo'] = { $in: tranferTo.filter(item => item !== '<blank>').concat([null, undefined]) };
            } else {
                query['otherInfo.tranferTo'] = { $in: tranferTo };
            }
        }
        if (toAnyYear && toAnyYear.length) {
            if (toAnyYear.includes('<blank>')) {
                query['otherInfo.toAnyYear'] = { $in: toAnyYear.filter(item => item !== '<blank>').concat([null, undefined]) };
            } else {
                query['otherInfo.toAnyYear'] = { $in: toAnyYear };
            }
        }
        if (dateMove && dateMove.length) {
            if (dateMove.includes('<blank>')) {
                query['otherInfo.dateMove'] = { $in: dateMove.filter(item => item !== '<blank>').concat([null, undefined]) };
            } else {
                query['otherInfo.dateMove'] = { $in: dateMove };
            }
        }
        if (internalTransfer && internalTransfer.length) {
            if (internalTransfer.includes('<blank>')) {
                query['otherInfo.internalTransfer'] = { $in: internalTransfer.filter(item => item !== '<blank>').concat([null, undefined]) };
            } else {
                query['otherInfo.internalTransfer'] = { $in: internalTransfer };
            }
        }

        // Thực hiện truy vấn lấy dữ liệu từ database
        const result = await decreaseMilitaly.find(query);

        // Gửi kết quả về cho client
        res.status(200).json({ data: result });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
}
module.exports = new decreaseController();
