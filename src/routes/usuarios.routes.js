const { Router } = require('express');
const usuariosController = require('../controllers/usuarios.controller');
const ImagenEspecial = require('../middleware/file');

const router = Router();

// Registro de usuarios
router.post('/registro/', usuariosController.createUsuarioComun);
router.post('/registro-especial/', ImagenEspecial.single('imagen'), usuariosController.createUsuarioEspecial);
router.post('/registro-responsable/', usuariosController.createUsuarioResp);
router.post('/registro-administrador/', usuariosController.createAdmin);

// Buscar usuarios por su tipo
router.get('/buscarComun/', usuariosController.getUsuariosComunes);
router.get('/buscarEspecial/', usuariosController.getUsuariosEspeciales);
router.get('/buscarResponsable/', usuariosController.getUsuariosResponsables);

// Buscar, editar y borrar usuarios
router.get('/registro/', usuariosController.getUsuarios);
router.get('/registro/:id', usuariosController.getUsuario);
router.put('/registro/:id', usuariosController.editUsuario);
router.delete('/registro/:id', usuariosController.deleteUsuario);

// Buscar usuario o correo repetido
router.post('/usuarioRepetido/', usuariosController.buscarUsuarioRepetido);
router.get('/CorreoRepetido/:id', usuariosController.buscarCorreoRepetido);

// Ingresar
router.post('', usuariosController.signin);

// router.get('/privateTask/', usuariosController.verificarToken, usuariosController.privateTask);


module.exports = router;
