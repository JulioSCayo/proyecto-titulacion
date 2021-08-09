const { Router } = require('express');
const usuariosController = require('../controllers/usuarios.controller');
const ImagenEspecial = require('../middleware/file');

const router = Router();

router.post('/registro/', usuariosController.createUsuarioComun);

router.get('/buscarComun/', usuariosController.getUsuariosComunes);
router.get('/buscarEspecial/', usuariosController.getUsuariosEspeciales);
router.get('/buscarResponsable/', usuariosController.getUsuariosResponsables);

router.post('/registro-especial/', ImagenEspecial.single('imagen'), usuariosController.createUsuarioEspecial);
router.post('/registro-responsable/', usuariosController.createUsuarioResp);

router.get('/registro/', usuariosController.getUsuarios);
router.get('/registro/:id', usuariosController.getUsuario);
router.put('/registro/:id', usuariosController.editUsuario);
router.delete('/registro/:id', usuariosController.deleteUsuario);

router.post('/usuarioRepetido/', usuariosController.buscarUsuarioRepetido);
// router.get('/CorreoRepetido/:id', usuariosController.buscarCorreoRepetido);



router.post('', usuariosController.signin);
router.get('/privateTask/', usuariosController.verificarToken, usuariosController.privateTask);


module.exports = router;
