const { Schema, model, Types } = require('mongoose');

const reporteSchema = new Schema({
	estado: {type: String, required: true},
	ubicacion: {
		longitud: {type: Number, required: true},
		latitud: {type: Number, required: true}
    },
	tipoProblema: {type: String, required: true},
	fechaCreacion: {type: Date, required: true},
	fechaSolucion: {type: Date, required: false},
	credibilidad: {type: Number, required: true},
	urgenciaTiempo: {type: Number, required: false},
	comentario: {type: String, required: false},
	vidaRiesgo: {type: Number, required: false},
	cronico: {type: Boolean, required: false},
	fantasma: {type: Boolean, required: false},
	usuarios: [
        {
            _id: {type: Types.ObjectId, required: false}
        }
    ]
},
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = model('Reporte', reporteSchema);