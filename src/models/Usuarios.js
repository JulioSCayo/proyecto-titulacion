const { Schema, model } = require('mongoose');

const usuarioComunSchema = new Schema({

});

const usuarioEspecialSchema = new Schema({
	imagen: {type: String, required: false},
	validado: {type: Boolean, required: false}
});

const usuarioResponsableSchema = new Schema({
    institucion: {type: String, required: false},
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
},  {
    timestamps: false,
    versionKey: false
    });


const usuarioSchema = new Schema({
    nombre: {type: String, required: false},
	apellidoPaterno: {type: String, required: false},
	apellidoMaterno: {type: String, required: false},
	correoElectronico: {type: String, required: false},
	nombreUsuario: {type: String, required: true},
	contrasena: {type: String, required: true},
	reputacion: {type: Number, required: false},
    usuarioComun: {type: usuarioComunSchema},
    usuarioEspecial: {type: usuarioEspecialSchema},
    usuarioResponsable: {type: usuarioResponsableSchema}
},  {
    timestamps: true,
    versionKey: false
    })

module.exports = model('Usuario', usuarioSchema);


