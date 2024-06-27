import SharedMilitaryEquipment from "../configs/mongoDB/sharedMilitaryEuipment";
import Parts from "../configs/mongoDB/part";

class sharedMilitaryEquipmentController {
  async create(req, res, next) {
    try {
      const newEquipment = req.body.data;
      const newRecorder = new SharedMilitaryEquipment(newEquipment);
      await newRecorder.save();
      res.status(200).json({ message: "Equipment created successfully." });
    } catch (error) {
      console.error("Error creating equipment:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
  async createPart(req, res, next) {
    try {
      const namePart = req.body.data;
      const existingPart = await Parts.findOne({ name: namePart });

      // Nếu phần đã tồn tại, trả về một thông báo lỗi
      if (existingPart) {
        return res.status(400).json({ message: "Part already exists." });
      }
      const newRecoder = new Parts({ name: namePart });
      await newRecoder.save();
      res.status(200).json({ message: "Part created successfully." });
    } catch (error) {
      console.error("Error creating part:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
  async render(req, res, next) {
    try {
        const parts = await Parts.find();
        const partsName = parts.map(part => part.name)
        const equipments = await SharedMilitaryEquipment.find()
        res.status(200).json({partsName, equipments})
    } catch (error) {
        console.error("Error render:", error);
        res.status(500).json({ message: "Internal server error." });
    }
  }
}

module.exports = new sharedMilitaryEquipmentController();
