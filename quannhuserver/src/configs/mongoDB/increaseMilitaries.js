import mongoose from "mongoose";
import AutoIncrement from 'mongoose-sequence';
const AutoIncrementPlugin = AutoIncrement(mongoose);
const Schema = mongoose.Schema;
const increaseMilitaries = new Schema({
  info: {
    fullName: { type: String },
    gender: { type: String },
    rank: { type: String },
    unit: { type: String },
    PHCDD: { type: String },
    ID: { type: String },
    lotteryNumber: { type: String },
  },
  size: {
    uniform: { type: String },
    hat: { type: String },
    shoe: { type: String },
    mat: { type: String },
    duaration: { type: String },
  },
  otherInfo: {
    tranferFrom: { type: String },
    moveInTime: { type: String },
    fromAnyYear: { type: String },
    bookSubmitter: { type: String },
    dateOfSubmission: { type: String },
  },
});
increaseMilitaries.plugin(AutoIncrementPlugin, { inc_field: 'id' });
module.exports = mongoose.model("increaseMilitaries", increaseMilitaries);
