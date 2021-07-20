const usuariosController = {};

const Usuario = require('../models/Usuario');

usuariosController.createUsuario = async (req, res) => {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();

    res.send({status: 'Usuario creado'});
};

usuariosController.getUsuarios = async (req, res) => {
    const usuarios = await Usuario.find();
    res.json(usuarios);
};

usuariosController.getUsuario = async (req, res) => {
    const usuario = await Usuario.findById(req.params.id);
    res.send(usuario);
};

usuariosController.editUsuario = async (req, res) => {
    await Usuario.findByIdAndUpdate(req.params.id, req.body);
    res.json({status: 'Usuario actualizado'});
};

usuariosController.deleteUsuario = async (req, res) => {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({status: 'Usuario eliminado'});
};

module.exports = usuariosController;