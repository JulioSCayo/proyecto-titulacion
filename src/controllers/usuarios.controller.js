const usuariosController = {};

const UsuarioComun = require('../models/UsuarioComun');
const UsuarioEspecial = require('../models/UsuarioEspecial');
const ImagenEspecial = require('../middleware/file');


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

//  ESTA MADRE DE ABAJO ES PARA INTENTAR HACER LO DE LA IMAGEN
// usuariosController.createUsuarioEspecial = ImagenEspecial.single('imagen'), async (req, res) => {

//     const url = req.protocol + '://' + req.get('host');
//     let imagenUrl = null;

//     if(req.file.filename) {
//         imagenUrl = url + '/public/' + req.file.filename;
//     }
//     else {
//         imagenUrl = null;
//     }

//     const nuevoUsuario = new UsuarioEspecial(req.body);
//     nuevoUsuario.reputacion = 10;
//     nuevoUsuario.validado = false;
//     nuevoUsuario.imagen = imagenUrl;
//     await nuevoUsuario.save();

//     res.send({status: 'Usuario Especial creado'});
// };


// EN ESTE PONE LA IMAGEN CON UNA URL PROVISIONAL PARA QUE NO TRUENE, LOS DEMÁS ATRIBUTOS SI JALAN
usuariosController.createUsuarioEspecial = async (req, res) => {

    const nuevoUsuario = new UsuarioEspecial(req.body);
    nuevoUsuario.reputacion = 10;
    nuevoUsuario.validado = false;
    nuevoUsuario.imagen = 'ruta/provisional.png'; // Provisional hasta poder subir y guardar imagenes
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