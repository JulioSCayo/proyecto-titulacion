const usuariosController = {};

const bcryptjs = require('bcryptjs');
const UsuarioComun = require('../models/UsuarioComun');
const UsuarioEspecial = require('../models/UsuarioEspecial');
const usuarioResponsable = require('../models/UsuarioResponsable');
const jwt = require('jsonwebtoken');



// ------------------ USUARIO COMUN
usuariosController.createUsuarioComun = async (req, res) => {
    const nuevoUsuario = new UsuarioComun(req.body);

    nuevoUsuario.contrasena = usuariosController.encriptar(nuevoUsuario.contrasena);
    nuevoUsuario.reputacion = 2;

    await nuevoUsuario.save();


    const token = jwt.sign({_id: nuevoUsuario._id}, 'llaveSecreta');
    console.log(token)


    res.status(200).json({token})
    // res.send({status: 'Usuario Comun creado'});

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



// ------------------ USUARIO ESPECIAL
usuariosController.createUsuarioEspecial = async (req, res) => {
    const nuevoUsuario = new UsuarioEspecial(req.body);

    nuevoUsuario.contrasena = usuariosController.encriptar(nuevoUsuario.contrasena);
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



// ------------------ USUARIO REPONSABLE
usuariosController.createUsuarioResp = async (req, res) => {
    const responsable = new usuarioResponsable(req.body);

    await responsable.save();
    res.send({status: 'Usuario creado'});
};

usuariosController.getUsuariosResps = async (req, res) => {
    const responsable = await usuarioResponsable.find();
    res.json(responsable);
};

usuariosController.getUsuarioResp = async (req, res) => {
    const responsable = await usuarioResponsable.findById(req.params.id);
    res.send(responsable);
};

usuariosController.editUsuarioResp = async (req, res) => {
    await usuarioResponsable.findByIdAndUpdate(req.params.id, req.body);
    res.json({status: 'Usuario Responsable actualizado'});
};

usuariosController.deleteUsuarioResp = async (req, res) => {
    await usuarioResponsable.findByIdAndDelete(req.params.id);
    res.json({status: 'Usuario Responsable eliminado'});
};



// ------------------ METODOS
usuariosController.encriptar = (contrasena) => {
    //se encripta la contraseña que le pasan como parametro con un salto de 8 y despues la retorna
    return bcryptjs.hashSync(contrasena, 8);
};

usuariosController.desencriptar = (contrasenaEnviada, contraseña) => {
    // contraseñas de prueba
    let contraseñaPasada = contrasenaEnviada,
        contraseñaGuardadaEnLaBD = contraseña;

    // compara la contraseña que le pasaron y la del usuario que se encuentra almacenada
    // entonces se encripta la contraseña que le pasaron y la compara con la encriptada guardada en la bd
    // esto por motivos de seguridad, para no desencriptar una y compararala asi
    return bcryptjs.compare(contraseñaPasada, contraseñaGuardadaEnLaBD);
};


usuariosController.signin = async (req, res) => {
    const { nombreUsuario, contrasena } = req.body;

    const usuario = await UsuarioComun.findOne({nombreUsuario});
    if(!usuario) return res.status(401).send("El usuario no existe");

    //los parametros de este metodo son la contraseña de texto plano, la contraseña encriptada y el callback
    bcryptjs.compare(contrasena, usuario.contrasena, (err, coinciden) => {
        if(err){
            return res.status(401).send("error al comparar la contraseña");
        }
        if(coinciden == true){
            const token = jwt.sign({_id: usuario._id}, 'llaveSecreta')
            // console.log("El token es: ", token)
    
            return res.status(200).json({token})
        }else{
            return res.status(401).send("El usuario no existe");
        }
    })

};


usuariosController.privateTask =  (req, res) => {

    res.json([
        {
            _id: 1,
            nombre: "saul",
            descripcion: "doble queso",
        },
        {
            _id: 2,
            nombre: "izcali",
            descripcion: "triple queso",
        }
        
    ])
}






usuariosController.verificarToken = (req, res, next) => {
    // console.log(req.headers.authorization)

    if(!req.headers.authorization){
        return res.status(401).send("autorizacion no permitida");
    }
    
    const token = req.headers.authorization.split(' ')[1]

    if(token === 'null'){
        return res.status(401).send("autorizacion no permitida");
    }

    const payload = jwt.verify(token, 'llaveSecreta')
    console.log("payload", payload)

    req.usuarioId = payload._id
    next();
}





module.exports = usuariosController;