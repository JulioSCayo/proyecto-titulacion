const { Router } = require('express');
const reportesController = require('../controllers/reportes.controller');

const router = Router();

// Crear reporte
router.post('/nuevo-reporte/', reportesController.createReporte);

// Reportar problema ya existente
router.put('/replicar-reporte/:id', reportesController.replicarReporte);

// Listar todos los reportes de un tipo
router.get('/reportes-tipo/', reportesController.getTipoReportes);

// Listar todos los reportes
router.get('/reportes/', reportesController.getReportes);

// Buscar un solo reporte
router.get('/reporte/:id', reportesController.getReporte);

// Editar un reporte
router.put('/reporte/:id', reportesController.editReporte);

// Borrar un reporte
router.delete('/reporte/:id', reportesController.deleteReporte);

module.exports = router;
