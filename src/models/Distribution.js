const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DistributionSchema = new Schema({
    _id: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    matricula: { type: String, required: true, unique: true },
    senha: { type: String, required: true},
    email: {type: String, required: true, unique: true },
    created: { type: Date, default: null },
    updated: { type: Date, default: null },
});

module.exports = mongoose.model('Distribution', DistributionSchema, 'distributions')