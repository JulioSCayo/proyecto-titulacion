const { Schema, model } = require('mongoose');

const usuarioResponsableSchema = new Schema({
        institucion: {type: String, required: true},
        nombreUsuario: {type: String, required: true},
        contrasena: {type: String, required: true},
        reporteAsignado: {
            folio: {type: String, required: false},
            tipoProblema: {type: String, required: false},
            urgencia: {type: Number, required: false},
            fechaCreacion: {type: Date, required: false},
            estado: {type: String, required: false},
            ubicacion: {
                longitud: {type: Number, required: false},
                latitud: {type: Number, required: false}
            }
        }
    }, {
	timestamps: true,
    versionKey: false
});

module.exports = model('usuarioResponsable', usuarioResponsableSchema);