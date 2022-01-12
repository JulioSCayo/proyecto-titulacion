const usuariosController = {};

const bcryptjs = require('bcryptjs');
const usuario = require('../models/Usuarios');
const jwt = require('jsonwebtoken');
const fs = require('fs');



// ------------------ USUARIO COMUN
usuariosController.createUsuarioComun = async (req, res) => {
    const nuevoUsuario = new usuario(req.body);

    nuevoUsuario.contrasena = usuariosController.encriptar(nuevoUsuario.contrasena);
    nuevoUsuario.reputacion = 2;

    await nuevoUsuario.save();

    res.status(200).json({'estado': 'ok'})
};



// ------------------ USUARIO ESPECIAL
usuariosController.createUsuarioEspecial = async (req, res) => {
    const nuevoUsuario = new usuario(req.body);

    nuevoUsuario.contrasena = usuariosController.encriptar(nuevoUsuario.contrasena);
    nuevoUsuario.reputacion = 10;
    nuevoUsuario.usuarioEspecial.validado = false;
    nuevoUsuario.usuarioEspecial.imagen = req.file.path;

    console.log(req.body);

    await nuevoUsuario.save();
    res.send({status: 'Usuario Especial creado'});
};



// ------------------ USUARIO REPONSABLE
usuariosController.createUsuarioResp = async (req, res, next) => {
    let numResp = 0;
    let usuarioTemp = "";
    const responsable = new usuario(req.body);
    responsable.usuarioResponsable.institucion = req.body.institucion;

    const users = await usuario.find();

    await users.forEach(i => {
        if(i.usuarioResponsable){ //checamos si el usuario recorrido tiene el atributo usuarioResponsable, para saber si es de este tipo
            if(i.usuarioResponsable.institucion == responsable.usuarioResponsable.institucion){
                numResp++;
            }
        }
    });

      setTimeout(() =>{
      console.log("El numero de responsables es de: ", numResp);
        switch(responsable.usuarioResponsable.institucion){                              // Nomenclaturas del nombre de usuario
            case 'SIAPA': usuarioTemp = "SP" + (numResp + 1).toString().padStart(4, "0000") + "R"; break;           //SP00xxR
            case 'Infrectructura': usuarioTemp = "IF" + (numResp + 1).toString().padStart(4, "0000") + "R"; break;  //IF00xxR
            case 'Bomberos': usuarioTemp = "BM" + (numResp + 1).toString().padStart(4, "0000") + "R"; break;        //BM00xxR
            case 'CFE': usuarioTemp = "CF" + (numResp + 1).toString().padStart(4, "0000") + "R"; break;             //CF00xxR
            case 'Proteccion': usuarioTemp = "PC" + (numResp + 1).toString().padStart(4, "0000") + "R"; break;             //CF00xxR
            case 'Movilidad': usuarioTemp = "SM" + (numResp + 1).toString().padStart(4, "0000") + "R"; break;             //CF00xxR
        }
  
        responsable.nombreUsuario = usuarioTemp;
        responsable.contrasena = usuariosController.encriptar(usuarioTemp);
        // responsable.contrasena = usuarioTemp;
        console.log("el nombre temporal es  ---->   ", responsable.nombreUsuario);
        responsable.save();
        
        res.json(usuarioTemp)
    }, 1);
    
};



// Buscar usuarios
usuariosController.getUsuarios = async (req, res) => {
    const usuarios = await usuario.find();
    res.json(usuarios);
};


usuariosController.nombresUsuarios = async (req, res) => {
    let usuarios = await usuario.find();
    let listaNombres = [];

        // usuarios.foreach(e => {
        //     listaNombres.push(e.nombreUsuario)
        // })
        
        for(let i of usuarios){
            listaNombres.push(i.nombreUsuario)

        }
        

        console.log(listaNombres)


    res.json(listaNombres);
    // res.json(usuarios);
};


// Buscar usuarios por su tipo
usuariosController.getUsuariosComunes = async (req, res) => {
    const usuarios = await usuario.find({$and: [ {usuarioResponsable: {$exists:false}}, {usuarioEspecial: {$exists:false}}, {usuarioAdmin: {$exists:false}}]});
    res.json(usuarios);
};

usuariosController.getUsuariosEspeciales = async (req, res) => {
    try{
        let usuarios1 = await usuario.find({$and: [ {usuarioEspecial: {$exists:true}}, { 'usuarioEspecial.validado': true}]});
        let usuarios2 = await usuario.find({$and: [ {usuarioEspecial: {$exists:true}}, { 'usuarioEspecial.validado': false}]});

            return res.status(200).json({usuarios1, usuarios2})
    }catch(error){
        console.log(error)
    }
};

usuariosController.getUsuariosResponsables = async (req, res) => {
    const usuarios = await usuario.find({usuarioResponsable: {$exists:true}});
    res.json(usuarios);
};



// Buscar un usuario
usuariosController.getUsuario = async (req, res) => {
    const usuarioEncontrado = await usuario.findById(req.params.id);
    res.send(usuarioEncontrado);
};



// Editar un usuario
usuariosController.editUsuario = async (req, res) => {
    var { nombreUsuario, contrasena } = req.body;

    if(nombreUsuario != '') {
    console.log(nombreUsuario);
    await usuario.findByIdAndUpdate(req.params.id, {nombreUsuario: nombreUsuario});
    }
    if(contrasena != '') {
    console.log(contrasena);
    contrasena = usuariosController.encriptar(contrasena);
    await usuario.findByIdAndUpdate(req.params.id, {contrasena: contrasena});
    }
    res.json({status: 'Usuario actualizado'});
};



// Borrar un usuario
usuariosController.deleteUsuario = async (req, res) => {
    const usuarioElim = await usuario.findById(req.params.id);

    if(usuarioElim.usuarioEspecial){
        try {
            console.log(usuarioElim.usuarioEspecial.imagen);
            fs.unlinkSync(usuarioElim.usuarioEspecial.imagen);
        }
        catch { }
    }

    await usuario.findByIdAndDelete(req.params.id);
    res.json({status: 'Usuario eliminado'});
};



// Buscar usuario o correo repetido
usuariosController.buscarUsuarioRepetido = async (req, res) => {
    const { nombreUsuario } = req.body;
    var existe;

    console.log(nombreUsuario);

    const usuarioIngresado = await usuario.findOne({nombreUsuario});
    if(!usuarioIngresado){   
        // return res.status(401).send("El usuario no existe");
        existe = false;
    }else{
        // return res.status(300).send("El usuario si existe");
        existe = true;
    }
    res.status(200).json({existe});
};

usuariosController.buscarCorreoRepetido = async (req, res) => {
    const { correoElectronico } = req.body;
    var existe;

    const usuarioIngresado = await usuario.findOne({correoElectronico});
    if(!usuarioIngresado){   
        // return res.status(401).send("El usuario no existe");
        existe = false;
    }else{
        // return res.status(300).send("El usuario si existe");
        existe = true;  
    }
    res.status(200).json({existe});
};



// Encriptar y desencriptar
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

usuariosController.compararContrasenas = async (req, res) => {
    const { id, contrasena } = req.body;

    const usr = await usuario.findById(id);
    const contrasenaBD = usr.contrasena;
    console.log(contrasenaBD);
    
    bcryptjs.compare(contrasena, contrasenaBD, (err, coinciden) => {
        if(err){
            return res.status(401).send("error al comparar la contraseña");
        }
        res.status(200).json({coinciden});
    });
};



// Ingresar
usuariosController.signin = async (req, res) => {
    const { nombreUsuario, contrasena } = req.body;

    const usuarioIngresado = await usuario.findOne({nombreUsuario});
    if(!usuarioIngresado) return res.status(401).send("El usuario no existe");

    //los parametros de este metodo son la contraseña de texto plano, la contraseña encriptada y el callback
    bcryptjs.compare(contrasena, usuarioIngresado.contrasena, (err, coinciden) => {
        if(err){
            return res.status(401).send("error al comparar la contraseña");
        }
        if(coinciden == true){
            const token = jwt.sign({_id: usuarioIngresado._id}, 'llaveSecreta')
            let tipoUsuario = "comun";
            let idUsuario = usuarioIngresado._id;

            if(!usuarioIngresado) return res.status(401).send("El usuario no existe");

            if(usuarioIngresado.usuarioAdmin)
                tipoUsuario = "admin";
            else if(usuarioIngresado.usuarioEspecial)
                tipoUsuario = "especial";
            else if (usuarioIngresado.usuarioResponsable)
                tipoUsuario = "responsable";
    
            return res.status(200).json({token, idUsuario, tipoUsuario, nombreUsuario})
        }else{
            return res.status(401).send("El usuario no existe");
        }
    })

};


usuariosController.TipoUsuario = async (req, res) => {
    const usuarioEncontrado  = await usuario.findById(req.params.id);
    console.log(usuarioEncontrado)

    if(!usuarioEncontrado) return res.status(401).send("El usuario no existe");

            let tipoUsuario = "comun";

            if(usuarioEncontrado.usuarioAdmin)
                tipoUsuario = "admin";
            else if(usuarioEncontrado.usuarioEspecial)
                tipoUsuario = "especial";
            else if (usuarioEncontrado.usuarioResponsable)
                tipoUsuario = "responsable";
    
            return res.status(200).json(tipoUsuario)
};



// Verificar token
usuariosController.verificarToken = (req, res, next) => {

    if(!req.headers.authorization){
        return res.status(401).send("autorizacion no permitida");
    }
    
    const token = req.headers.authorization.split(' ')[1]

    if(token === 'null'){
        return res.status(401).send("autorizacion no permitida");
    }

    const payload = jwt.verify(token, 'llaveSecreta')
    console.log("payload", payload)

    res.usuarioId = payload._id
    next();
}


// Metodo para crear usuario administrador
usuariosController.createAdmin = async (req, res) => {
    const nuevoUsuario = new usuario(req.body);

    nuevoUsuario.contrasena = usuariosController.encriptar(nuevoUsuario.contrasena);
    nuevoUsuario.usuarioAdmin.admin = true;

    await nuevoUsuario.save();

    res.status(200).json({'estado': 'ok'})
};



//metodo de prueba para saber si funciona el token
// usuariosController.privateTask =  (req, res) => {
//     res.json([
//         {
//             _id: 1, nombre: "saul", descripcion: "doble queso",
//         },
//         {
//             _id: 2, nombre: "julio", descripcion: "triple queso",
//         }
//     ])
// }

usuariosController.cambiarContrasenaPerdida = async (req, res) => {
    let { contrasena } = req.body;
    
    contrasena = usuariosController.encriptar(contrasena);
    await usuario.findByIdAndUpdate(req.params.id, {contrasena: contrasena});

    res.send("Bien");
};



module.exports = usuariosController;