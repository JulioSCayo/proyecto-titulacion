const { Schema, model } = require('mongoose');

const usuarioEspecialSchema = new Schema({
    nombre: {type: String, required: true},
	apellidoPaterno: {type: String, required: true},
	apellidoMaterno: {type: String, required: true},
	correoElectronico: {type: String, required: true},
	nombreUsuario: {type: String, required: true},
	contrasena: {type: String, required: true},
	reputacion: {type: Number, required: true},
	imagen: {type: String, required: true},
	validado: {type: Boolean, required: true}
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model('usuarioEspecial', usuarioEspecialSchema);