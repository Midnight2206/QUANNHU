import Criterion from "../configs/mongoDB/criterion";
import Listquantrang from "../configs/mongoDB/listquantrang";
import fieldDisplayMapping from "../configs/mapping";

class criterionController {
  async render(req, res, next) {
    try {
        const years = await Criterion.distinct("year");
      const dataKeys = Object.keys(
        Listquantrang.schema.paths.list.schema.tree.data
      ).filter((item) => !item.includes("_"));
      const dataHeaders = dataKeys.map((element) => {
        return fieldDisplayMapping[element];
      });
      const listCCD = await Listquantrang.distinct("list.info.PHCDD")
        .then((results) => {
          return results;
        })
        .catch((err) => {
          console.error("Lỗi khi truy vấn dữ liệu:", err);
        });
      res.status(200).json({ listCCD, dataHeaders, dataKeys, years });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
      console.log(error);
    }
  }
  async create(req, res, next) {
    try {
      // Lấy dữ liệu từ body request và query string
      const { year } = req.query;
      const data = req.body;
      //Kiểm tra xem year đã tồn tại trong db hay chưa
      const existingRecord = await Criterion.findOne({ year });
      if (existingRecord) {
        return res
          .status(400)
          .json({ error: "Năm đã tồn tại, bạn vui lòng kiểm tra lại!" });
      }
      // Tạo mới bản ghi trong cơ sở dữ liệu
      const newRecord = new Criterion({
        year,
        data,
      });

      // Lưu vào cơ sở dữ liệu
      await newRecord.save();

      res
        .status(200)
        .json({ message: "Tạo bảng tiêu chuẩn quân trang thành công" });
    } catch (error) {
      console.error("Error creating record:", error);
      res.status(500).json({ error: "Lỗi server" });
    }
  }
  
  async renderUpdate(req, res, next) { 
    try {
      const { year } = req.query;
      const data = await Criterion.findOne({ year})
      res.status(200).json(data);
  }
  catch (error) {
    console.error("Error creating record:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  }
  async update(req, res, next) {
    try {
      // Lấy dữ liệu từ body request và query string
      const { year } = req.query;
      const data = req.body;
      // Update dữ liệu
      Criterion.findOneAndUpdate(
        { year: year },
        { $set: { data: data } },
        { new: true }
      )
        .then(() =>
          res.status(200).json({ message: "Record updated successfully" })
        )
        .catch(() => res.status(500).json({ error: "Internal Server Error" }));
    } catch (error) {
      console.error("Error creating record:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
module.exports = new criterionController();
