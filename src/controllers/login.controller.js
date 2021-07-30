
const loginController = {};

const bcryptjs = require('bcryptjs');
const UsuarioComun = require('../models/UsuarioComun');
const UsuarioEspecial = require('../models/UsuarioEspecial');



//VAMOSA VER SI FUNCIONA CON TODOS LOS TIPOS DE USUARIO, DE MOMENTO QUIZAS SOLO PARA EL COMUN
loginController.signin = async (req, res) => {
    const { nombreUsuario, contrasena } = req.body;

    const usuario = UsuarioComun.findOne({nombreUsuario});
    if(!usuario) return res.status(401).send("El usuario no existe");
    // if(usuario.contrasena !== contrasena) return res.status(401).send("La contrasena no coincide")
    bcryptjs.compare(usuario.contrasena, contrasena);
    console.log( bcryptjs.compare(usuario.contrasena, contrasena))

    // jwt.sign()
    res.send('probando el login');
};
