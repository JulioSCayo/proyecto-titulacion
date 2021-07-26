const { Router } = require('express');
const usuariosController = require('../controllers/usuarios.controller');

const router = Router();

router.post('/registro/', usuariosController.createUsuario);
router.get('/registro/', usuariosController.getUsuarios);
router.get('/registro/:id', usuariosController.getUsuario);
router.put('/registro/:id', usuariosController.editUsuario);
router.delete('/registro/:id', usuariosController.deleteUsuario);


router.post('/registro-responsable/', usuariosController.createUsuarioResp);
router.get('/registro-responsable/', usuariosController.getUsuariosResps);
router.get('/registro-responsable/:id', usuariosController.getUsuarioResp);
router.put('/registro-responsable/:id', usuariosController.editUsuarioResp);
router.delete('/registro-responsable/:id', usuariosController.deleteUsuarioResp);




module.exports = router;