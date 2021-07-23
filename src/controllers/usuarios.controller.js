const usuariosController = {};

const UsuarioComun = require('../models/UsuarioComun');
const UsuarioEspecial = require('../models/UsuarioEspecial');

// Usuarios Comunes
usuariosController.createUsuarioComun = async (req, res) => {
    const nuevoUsuario = new UsuarioComun(req.body);
    nuevoUsuario.reputacion = 2;
    await nuevoUsuario.save();

    res.send({status: 'Usuario Comun creado'});
};

usuariosController.getUsuariosComunes = async (req, res) => {
    const usuarios = await UsuarioComun.find();
    res.json(usuarios);
};

usuariosController.getUsuarioComun = async (req, res) => {
    const usuario = await UsuarioComun.findById(req.params.id);
    res.send(usuario);
};

usuariosController.editUsuarioComun = async (req, res) => {
    await UsuarioComun.findByIdAndUpdate(req.params.id, req.body);
    res.json({status: 'Usuario Comun actualizado'});
};

usuariosController.deleteUsuarioComun = async (req, res) => {
    await UsuarioComun.findByIdAndDelete(req.params.id);
    res.json({status: 'Usuario Comun eliminado'});
};

// Usuarios Especiales
usuariosController.createUsuarioEspecial = async (req, res) => {
    const nuevoUsuario = new UsuarioEspecial(req.body);
    nuevoUsuario.reputacion = 10;
    nuevoUsuario.validado = false;
    nuevoUsuario.imagen = req.file.path;
    await nuevoUsuario.save();

    res.send({status: 'Usuario Especial creado'});
};

usuariosController.getUsuariosEspeciales = async (req, res) => {
    const usuarios = await UsuarioEspecial.find();
    res.json(usuarios);
};

usuariosController.getUsuarioEspecial = async (req, res) => {
    const usuario = await UsuarioEspecial.findById(req.params.id);
    res.send(usuario);
};

usuariosController.editUsuarioEspecial = async (req, res) => {
    await UsuarioEspecial.findByIdAndUpdate(req.params.id, req.body);
    res.json({status: 'Usuario Especial actualizado'});
};

usuariosController.deleteUsuarioEspecial = async (req, res) => {
    await UsuarioEspecial.findByIdAndDelete(req.params.id);
    res.json({status: 'Usuario Especial eliminado'});
};

module.exports = usuariosController;