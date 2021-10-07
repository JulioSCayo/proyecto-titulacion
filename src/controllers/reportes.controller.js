const reportesController = {};

const reporte = require('../models/Reportes');
const usuario = require('../models/Usuarios');

// Crear reporte
reportesController.createReporte = async (req, res) => {
    const nuevoReporte = new reporte(req.body);
    const getUsuario = await usuario.findById(nuevoReporte.usuarios);
    
    console.log("........................................................")
    console.log(req.body);

    nuevoReporte.folio = '1';
    nuevoReporte.estado = 'Desatendido';
    nuevoReporte.credibilidad = getUsuario.reputacion;
    nuevoReporte.fechaCreacion = Date.now();

    console.log(nuevoReporte);
    await nuevoReporte.save();
    res.status(200).json({'estado': 'ok'})
};

// Reportar problema ya existente
reportesController.replicarReporte = async (req, res) => {
    const getReporte = await reporte.findById(req.params.id);
    const getUsuario = await usuario.findById(req.body.usuarios);
    console.log(getUsuario);

    getReporte.credibilidad = getReporte.credibilidad + getUsuario.reputacion;
    getReporte.usuarios.push(req.body.usuarios);

    console.log(getReporte);
    await reporte.findByIdAndUpdate(req.params.id, getReporte);
    res.json({status: "Reporte replicado"});
};

// Listar todos los reportes de un tipo
reportesController.getTipoReportes = async (req, res) => {
    const getReportes = await reporte.find({tipoProblema: req.body.tipo});
    res.json(getReportes);
};

// Listar todos los reportes
reportesController.getReportes = async (req, res) => {
    const getReportes = await reporte.find();
    res.json(getReportes);
};

// Buscar un solo reporte
reportesController.getReporte = async (req, res) => {
    const getReporte = await reporte.findById(req.params.id);
    res.json(getReporte);
};

// Editar un reporte
reportesController.editReporte = async (req, res) => {
    await reporte.findByIdAndUpdate(req.params.id, req.body);
    res.json({status: 'Reporte actualizado'});
};

// Borrar un reporte
reportesController.deleteReporte = async (req, res) => {
    await reporte.findByIdAndDelete(req.params.id);
    res.json({status: 'Reporte eliminado'});
};

module.exports = reportesController;