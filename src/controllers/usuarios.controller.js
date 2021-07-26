const usuariosController = {};

const bcryptjs = require('bcryptjs');
const Usuario = require('../models/Usuario');
const usuarioResponsable = require('../models/UsuarioResponsable');


// ------------------ USUARIO COMUN
usuariosController.createUsuario = async (req, res) => {
    const nuevoUsuario = new Usuario(req.body);

    //encriptamos contraseña
    nuevoUsuario.contrasena = usuariosController.encriptar(nuevoUsuario.contrasena)
    
    // console.log(usuariosController.desencriptar("123", "$2a$08$MAz11GKX/qthLaxNEq2Iw.wEGeSRW23NP.8zOt3SjLIM4.qL9b496"));

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


// ------------------ USUARIO REPONSABLE
usuariosController.createUsuarioResp = async (req, res) => {
    const responsable = new usuarioResponsable(req.body);
    await responsable.save();
    
    console.log(req.body);
    
    res.send({status: 'Usuario creado'});
};

usuariosController.getUsuariosResps = async (req, res) => {
    const responsable = await usuarioResponsable.find()
    res.json(responsable);

    console.log("usuarios obtenidos")
};

usuariosController.getUsuarioResp = async (req, res) => {
    const responsable = await usuarioResponsable.findById(req.params.id);
    res.send(responsable);

    console.log("usuario obtenido")
};

usuariosController.editUsuarioResp = async (req, res) => {
    await usuarioResponsable.findByIdAndUpdate(req.params.id, req.body);
    res.json({status: 'Usuario actualizado'});

    console.log("usuario obtenido")
};

usuariosController.deleteUsuarioResp = async (req, res) => {
    await usuarioResponsable.findByIdAndDelete(req.params.id);
    res.json({status: 'Usuario eliminado'});

    console.log("usuario ")
};



// ENCRIPTACION Y DESENCRIPTACION
usuariosController.encriptar = (contrasena) => {
    //se encripta la contraseña que le pasan como parametro con un salto de 8 y despues la retorna
    return bcryptjs.hashSync(contrasena, 8);
};


usuariosController.desencriptar = (contrasenaEnviada, contraseña) => {
    // contraseñas de prueba
    let contraseñaPasada = contrasenaEnviada,
        contraseñaGuardadaEnLaBD = contraseña

    // compara la contraseña que le pasaron y la del usuario que se encuentra almacenada
    // entonces se encripta la contraseña que le pasaron y la compara con la encriptada guardada en la bd
    // esto por motivos de seguridad, para no desencriptar una y compararala asi
    return bcryptjs.compare(contraseñaPasada, contraseñaGuardadaEnLaBD)
};




module.exports = usuariosController;