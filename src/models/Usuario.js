const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const usuarioComunSchema = new Schema({
    nombre: {type: String, required: true},
	apellidoPaterno: {type: String, required: true},
	apellidoMaterno: {type: String, required: true},
	correoElectronico: {type: String, required: true},
	nombreUsuario: {type: String, required: true},
	contrasena: {type: String, required: true},
	reputacion: {type: Number, required: true},
}, {
    timestamps: true,
    versionKey: false
});


module.exports = model('usuarioComun', usuarioComunSchema);
