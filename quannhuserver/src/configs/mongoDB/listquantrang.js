import mongoose from 'mongoose'
import { Schema } from "mongoose";
import unorm from 'unorm';
import fieldDisplayMapping from '../mapping.js'

const normalizeVietnamese = (data) => {
  if (typeof data === 'string') {
    return unorm.nfc(data); // Chuẩn hóa chuỗi tiếng Việt sang NFC
  }
  return data;
};

const normalizeKeysAndValues = (obj) => {
  const normalizedObj = {};
  for (const [key, value] of Object.entries(obj)) {
    const normalizedKey = unorm.nfc(key); // Chuẩn hóa key
    const normalizedValue = normalizeVietnamese(value); // Chuẩn hóa value
    normalizedObj[normalizedKey] = normalizedValue;
  }
  return normalizedObj;
};

const ItemSchema = new Schema(normalizeKeysAndValues({
  info: {
    fullName: { type: String },
    ID: { type: String },
    gender: {type: String},
    PHCDD: { type: Number },
    rank: { type: String },
    unit: { type: String },
    lotteryNumber: {type: Number}
  },
  size: {
    uniform: { type: String },
    shoe: { type: String },
    hat: { type: String },
    mat: { type: String },
    duaration: { type: String },
  },
  data: {
    underwear: { type: Number, default: 0 },
    tShirt: { type: Number, default: 0 },
    towel: { type: Number, default: 0 },
    sock: { type: Number, default: 0 },
    leatherShoe: { type: Number, default: 0 },
    womanLeatherGie: { type: Number, default: 0 },
    trouser: { type: Number, default: 0 },
    shortSleevedShirt: { type: Number, default: 0 },
    winterMilitaryUniform: { type: Number, default: 0 },
    summerVestment: { type: Number, default: 0 },
    winterVestment: { type: Number, default: 0 },
    sandal: { type: Number, default: 0 },
    sedgeMat: { type: Number, default: 0 },
    quiltCover: { type: Number, default: 0 },
    tulleCurtain: { type: Number, default: 0 },
    balo: { type: Number, default: 0 },
    baloLining: { type: Number, default: 0 },
    longSleevedShirt: { type: Number, default: 0 },
    longSleevedShirtWhite: { type: Number, default: 0 },
    liningShirt: { type: Number, default: 0 },
    warmClothes: { type: Number, default: 0 },
    seasonalClothes: { type: Number, default: 0 },
    rainSuit: { type: Number, default: 0 },
    hardHat: { type: Number, default: 0 },
    kepiHat: { type: Number, default: 0 },
    caravat: { type: Number, default: 0 },
    caravatClip: { type: Number, default: 0 },
    pillow: { type: Number, default: 0 },
    leatherBelt: { type: Number, default: 0 },
    armorialMilitary28: { type: Number, default: 0 },
    armorialMilitary33: { type: Number, default: 0 },
    rankInsignia: { type: Number, default: 0 },
    branchInsignia: { type: Number, default: 0 },
  },
}));
for (const field in fieldDisplayMapping) {
  if (ItemSchema.paths['info.' + field]) {
    ItemSchema.virtual(`info.${field}_display`).get(function () {
      return fieldDisplayMapping[field];
    });
  }
}

// Định nghĩa thuộc tính ảo cho các trường của schema size
for (const field in fieldDisplayMapping) {
  if (ItemSchema.paths['size.' + field]) {
    ItemSchema.virtual(`size.${field}_display`).get(function () {
      return fieldDisplayMapping[field];
    });
  }
}

// Định nghĩa thuộc tính ảo cho các trường của schema data
for (const field in fieldDisplayMapping) {
  if (ItemSchema.paths['data.' + field]) {
    ItemSchema.virtual(`data.${field}_display`).get(function () {
      return fieldDisplayMapping[field];
    });
  }
}
const ListquantrangSchema = new Schema({
  year: { type: String, unique: true },
  list: [ItemSchema],
});

const Listquantrang = mongoose.model("Listquantrang", ListquantrangSchema);

module.exports = Listquantrang;
