const { Router } = require('express');
const usuariosController = require('../controllers/usuarios.controller');
const ImagenEspecial = require('../middleware/file');

const router = Router();

router.post('/registro/', usuariosController.createUsuarioComun);
router.get('/registro/', usuariosController.getUsuariosComunes);
router.get('/registro/:id', usuariosController.getUsuarioComun);
router.put('/registro/:id', usuariosController.editUsuarioComun);
router.delete('/registro/:id', usuariosController.deleteUsuarioComun);

router.post('/registro-especial/', ImagenEspecial.single('imagen'), usuariosController.createUsuarioEspecial);
router.get('/registro-especial/', usuariosController.getUsuariosEspeciales);
router.get('/registro-especial/:id', usuariosController.getUsuarioEspecial);
router.put('/registro-especial/:id', usuariosController.editUsuarioEspecial);
router.delete('/registro-especial/:id', usuariosController.deleteUsuarioEspecial);

router.post('/registro-responsable/', usuariosController.createUsuarioResp);
router.get('/registro-responsable/', usuariosController.getUsuariosResps);
router.get('/registro-responsable/:id', usuariosController.getUsuarioResp);
router.put('/registro-responsable/:id', usuariosController.editUsuarioResp);
router.delete('/registro-responsable/:id', usuariosController.deleteUsuarioResp);


router.post('', usuariosController.signin);
router.get('/privateTask/', usuariosController.verificarToken, usuariosController.privateTask);


module.exports = router;
