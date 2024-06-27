import mongoose from "mongoose";
import AutoIncrement from 'mongoose-sequence';
const AutoIncrementPlugin = AutoIncrement(mongoose);
const Schema = mongoose.Schema;
const decreaseMilitaly = new Schema({
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
    tranferTo: { type: String },
    toAnyYear: { type: String },
    dateMove: { type: String },
    numberOfDecision: { type: String },
    internalTransfer: { type: String },
  },
});
decreaseMilitaly.plugin(AutoIncrementPlugin, { inc_field: 'number' });
module.exports = mongoose.model("decreaseMilitaly", decreaseMilitaly);
