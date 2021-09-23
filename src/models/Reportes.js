const { Schema, model, Types } = require('mongoose');

const reporteSchema = new Schema({
	folio: {type: String, required: true},
	estado: {type: String, required: true},
	ubicacion: {
		longitud: {type: Number, required: true},
		latitud: {type: Number, required: true}
    },
	tipoProblema: {type: String, required: true},
	fechaCreacion: {type: Date, required: true},
	fechaSolucion: {type: Date, required: false},
	credibilidad: {type: Number, required: true},
	urgencia: {type: Number, required: false},
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