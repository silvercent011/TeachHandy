const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AlunoSchema = new Schema({
    _id: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    matricula: { type: String, required: true, unique: true },
    dt_nascimento: { type: String, default: null},
    nivel: { type: String, required: true },
    turma: { type: String, required: true },
    turno: { type: String, required: true },
    email: {type: String, default: null},
    created: { type: Date, default: null },
    updated: { type: Date, default: null },
    enabled: { type: Boolean, default: true}
});

module.exports = mongoose.model('Aluno', AlunoSchema, 'alunos')