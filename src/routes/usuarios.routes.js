const { Router } = require('express');
const usuariosController = require('../controllers/usuarios.controller');

const router = Router();

router.post('/', usuariosController.createUsuario);
router.get('/', usuariosController.getUsuarios);
router.get('/:id', usuariosController.getUsuario);
router.put('/:id', usuariosController.editUsuario);
router.delete('/:id', usuariosController.deleteUsuario);

module.exports = router;