import mongoose from 'mongoose';
import AutoIncrement from 'mongoose-sequence';
import fieldDisplayMapping from '../mapping';
const AutoIncrementPlugin = AutoIncrement(mongoose);
const Schema = mongoose.Schema
const InfoSchema = new Schema({
    receiver: {type: String},
    unit: {type: String},
    criterionOf: {type: String},
    ID: {type: String}
})
const DataSchema = new Schema({
    underwear: { type: Number },
    tShirt: { type: Number },
    towel: { type: Number },
    sock: { type: Number },
    leatherShoe: { type: Number },
    womanLeatherGie: { type: Number },
    trouser: { type: Number },
    shortSleevedShirt: { type: Number },
    winterMilitaryUniform: { type: Number },
    summerVestment: { type: Number },
    winterVestment: { type: Number },
    sandal: { type: Number },
    sedgeMat: { type: Number },
    quiltCover: { type: Number },
    tulleCurtain: { type: Number },
    balo: { type: Number },
    baloLining: { type: Number },
    longSleevedShirt: { type: Number },
    longSleevedShirtWhite: { type: Number },
    liningShirt: { type: Number },
    warmClothes: { type: Number },
    seasonalClothes: { type: Number },
    rainSuit: { type: Number },
    hardHat: { type: Number },
    kepiHat: { type: Number },
    caravat: { type: Number },
    caravatClip: { type: Number },
    pillow: { type: Number },
    leatherBelt: { type: Number },
    armorialMilitary28: { type: Number },
    armorialMilitary33: { type: Number },
    rankInsignia: { type: Number },
    branchInsignia: { type: Number },
})
for (const field in fieldDisplayMapping) {
    InfoSchema.virtual(`${field}_display`).get(function () {
        return fieldDisplayMapping[field];
    });
}

// Tạo các thuộc tính ảo từ fieldDisplayMapping cho DataSchema
for (const field in fieldDisplayMapping) {
    DataSchema.virtual(`${field}_display`).get(function () {
        return fieldDisplayMapping[field];
    });
}
const Bills = new Schema({
    year: {type: String},
    date: {type: Object}, 
    info: InfoSchema,
    data: DataSchema
})
Bills.plugin(AutoIncrementPlugin, { inc_field: 'num' });
module.exports =  mongoose.model('Bills', Bills)
