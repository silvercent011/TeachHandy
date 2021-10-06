const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DistributionSchema = new Schema({
    _id: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    matricula: { type: String, required: true},
    senha: { type: String, required: true},
    email: {type: String, required: true, unique: true },
    jobtitle: {type: String, required: true},
    created: { type: Date, default: null },
    updated: { type: Date, default: null },
    sharedTimes: { type: Number, default: 0 },
});

module.exports = mongoose.model('DistributionStudent', DistributionSchema, 'distributions_students')