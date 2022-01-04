const reportesController = {};

const reporte = require('../models/Reportes');
const usuario = require('../models/Usuarios');


// -----------------------------------------------


// Crear reporte
reportesController.createReporte = async (req, res) => {
    const nuevoReporte = new reporte(req.body);

    // Si el usuario que reportó el problema es invitado la credibilidad será 1
    if(!await usuario.findById(nuevoReporte.usuarios)) {
        nuevoReporte.credibilidad = 1;
    }
    // Si el usuario no es invitado se toma su credibilidad
    else {
        const getUsuario = await usuario.findById(nuevoReporte.usuarios);
        nuevoReporte.credibilidad = getUsuario.reputacion;
    }

    nuevoReporte.urgencia = 0;
    nuevoReporte.urgenciaTiempo = 0; // Se coloca la urgenciaTiempo como 0 inicialmente
    nuevoReporte.estado = 'Desatendido'; // Se coloca el estado como desatendido inicialmente
    nuevoReporte.fechaCreacion = Date.now(); // Se coloca la fecha de creación

    // Si se recibe que es cronico desde el frontend se revisan las coincidencias de ubicación con otros problemas del mismo tipo
    if(nuevoReporte.cronico == true) {
        // Si hay 2 coincidencias se coloca como crónico, sino como no cronico
        nuevoReporte.cronico = await reportesController.reporteCronico(nuevoReporte._id, nuevoReporte.ubicacion.latitud, nuevoReporte.ubicacion.longitud, nuevoReporte.tipoProblema);
    }

    await nuevoReporte.save(); // Se guarda el reporte
    res.status(200).json(nuevoReporte._id); // Se regresa el id del reporte al frontend

    reportesController.urgenciaTiempo(nuevoReporte._id); // Se inicia el algoritmo de urgenciaTiempo
};



// Reportar problema ya existente
reportesController.replicarReporte = async (req, res) => {
    const getReporte = await reporte.findById(req.params.id);

    // Si el usuario que reportó el problema es invitado la credibilidad será 1 
    if(!await usuario.findById(req.body.usuarios)) {
        getReporte.credibilidad += 1;
    }
    // Si el usuario no es invitado se toma su credibilidad
    else {
        const getUsuario = await usuario.findById(req.body.usuarios);
        getReporte.credibilidad += getUsuario.reputacion;
    }

    getReporte.usuarios.push(req.body.usuarios); // Se agrega el usuario al arreglo de usuarios que reportaron el problema

    // Si se colocó que hay vidas en riesgo se agrega un punto al vidaRiesgo ya existente
    if(req.body.vidaRiesgo == true)
            getReporte.vidaRiesgo++;

    // Si se recibe que es cronico desde el frontend se revisan las coincidencias de ubicación con otros problemas del mismo tipo
    if(req.body.cronico == true) {
        // Si hay 2 coincidencias se coloca como crónico, sino como no cronico
        getReporte.cronico = await reportesController.reporteCronico(getReporte._id, getReporte.ubicacion.latitud, getReporte.ubicacion.longitud, getReporte.tipoProblema);
    }

    await reporte.findByIdAndUpdate(req.params.id, getReporte); // Se replica/actualiza el reporte
    res.json(getReporte._id); // Se regresa el id del reporte al frontend
};


// -----------------------------------------------


// Listar todos los reportes de un tipo
reportesController.getTipoReportes = async (req, res) => {
    const getReportes = await reporte.find({tipoProblema: req.params.tipo});
    res.json(getReportes);
};

// Listar todos los reportes en un estado
reportesController.getEstadoReportes = async (req, res) => {
    let aux = req.params.estado
    let separar = aux.split("$")
    let getReportes = [], reportes = [], cont = 0;
    
    // getReportes = await reporte.find();
    // res.json(getReportes);

    
    if(separar[0] == "En proceso")
         getReportes = await reporte.find({$or: [{estado: "En ruta"}, {estado:"En proceso"}]});
    else
         getReportes = await reporte.find({estado: separar[0]});
    
    //'alumbrado':'inundacion': 'fuga': 'faltaAlcantarilla': 'alcantarillaObstruida': 'escombros': 'vehiculo': 'arbol': 'socavon': 'cables': 'incendio':

    // ** ATENCION: CREO QUE FALTA AGREGAR ALGUNAS INSTITUCIONES (desde el registro, quizas)

        switch (separar[1].substr(0,2)) { //checa las iniciales del usuario para saber a que institucion pertenece
            case "SP":
                cont = 0;
                getReportes.forEach(e => {
                    if(e.tipoProblema == "inundacion" || e.tipoProblema == "fuga" || e.tipoProblema == "faltaAlcantarilla" || e.tipoProblema == "alcantarillaObstruida"){
                        reportes.push(e) //guarda en un nuevo arreglo los reportes que correspondan al tipo que soluciona la institucion del usuario que realiza la peticion
                    }
                    cont++;
                });
            break;      
                        
            case "IF":
                cont = 0;
                getReportes.forEach(e => {
                    if(e.tipoProblema == "socavon"){
                        reportes.push(e)
                    }
                    cont++;
                });
            break;
    
            case "BM":
                cont = 0;
                getReportes.forEach(e => {
                    if(e.tipoProblema == "incendio"){
                        reportes.push(e)
                    }
                    cont++;
                }); 
            break;
            
            case "CF":
                cont = 0;
                getReportes.forEach(e => {
                    if(e.tipoProblema == "alumbrado" || e.tipoProblema == "cables"){
                        reportes.push(e)
                    }
                    cont++;
                });
            break;
                
            default:
                console.log("Ocurrio algo raro (y por ende se enviaron todos los reportes)")
                reportes = getReportes;
            break;
        }
                
    res.json(reportes);
    
};

reportesController.getReportesNoAsignados = async (req, res) => {
    const getReportes = await reporte.find({asignado: {$exists:false}});
    res.json(getReportes);
};

// Listar todos los reportes
reportesController.getReportes = async (req, res) => {
    const getReportes = await reporte.find();
    res.json(getReportes);
};

// Busca reportes asignado y que el estado sea en ruta
reportesController.getReporteAsignado = async (req, res) => {
    const getReporteAsignado = await reporte.find({$and: [{asignado: req.params.id}, {estado: "En ruta"}]});

    console.log(getReporteAsignado.toString())

    if(getReporteAsignado.toString() == ""){
        res.json(false)
    }else{
        res.json(getReporteAsignado);
    }
};

// Buscar un solo reporte
reportesController.getReporte = async (req, res) => {
    const getReporte = await reporte.findById(req.params.id);
    res.json(getReporte);
};


// -----------------------------------------------


// Editar un reporte
reportesController.editReporte = async (req, res) => {
    await reporte.findByIdAndUpdate(req.params.id, req.body);
    res.json({status: 'Reporte actualizado'});
};

// Borrar un reporte
reportesController.deleteReporte = async (req, res) => {
    await reporte.findByIdAndDelete(req.params.id);
    res.json({status: 'Reporte eliminado'});
};


// -----------------------------------------------


// Se verifica si el reporte es cronico
reportesController.reporteCronico = async (_id, latComparada, lngComparada, tipo) => {
    let coincidencias = 0;
    let cronico = false;

    const getReportes = await reporte.find({tipoProblema: tipo}); // Se obtienen todos los reportes del mismo tipo

    for(let reporteAntiguo of getReportes) { // Se revisa si el reporte coincide en la ubicación con mínimo 2 reportes ya solucionados
        if(reporteAntiguo.estado == 'Desatendido') { // Para pruebas poner en 'Desatendido' ------------------
            if( (Math.abs(reporteAntiguo.ubicacion.latitud - latComparada) * 111100) < 30 && Math.abs((reporteAntiguo.ubicacion.longitud - lngComparada) * 111100) < 30){
                coincidencias++;
            }
        }
    }

    // Se coloca como verdadero o falso dependiendo de la cantidad de coincidencias
    if(coincidencias >= 2)
        cronico = true;
    else
        cronico = false;

    return cronico;
}



// Algoritmo de puntos de urgencia/tiempo
reportesController.urgenciaTiempo = async (_id) => {
    let puntos = 0;
    let tiempo = 0;

    const getReporte = await reporte.findById(_id);

    let urgenciaTiempo = getReporte.urgenciaTiempo; // Se obtiene la urgencia actual del reporte

    // Se colocan los puntos y el tiempo dependiendo del tipo de problema
    switch (getReporte.tipoProblema) {
        case 'alumbrado': {
            puntos = 5;
            tiempo = 86400000; // 24 horas
            break;
        }
        case 'inundacion': {
            puntos = 5;
            tiempo = 7200000; // 2 horas
            break;
        }
        case 'fuga': {
            puntos = 7;
            tiempo = 2400000; // 40 minutos
            break;
        }
        case 'faltaAlcantarilla': {
            puntos = 7;
            tiempo = 43200000; // 12 horas
            break;
        }
        case 'alcantarillaObstruida': {
            puntos = 5;
            tiempo = 86400000; // 24 horas
            break;
        }
        case 'escombros': {
            puntos = 3;
            tiempo = 86400000; // 24 horas
            break;
        }
        case 'vehiculo': {
            puntos = 3;
            // tiempo = 86400000; // 24 horas
            tiempo = 10000; // Para prueba ------------------
            break;
        }
        case 'arbol': {
            puntos = 7;
            tiempo = 43200000; // 12 horas
            break;
        }
        case 'socavon': {
            puntos = 5;
            tiempo = 86400000; // 24 horas
            break;
        }
        case 'cables': {
            puntos = 5;
            tiempo = 43200000; // 12 horas
            break;
        }
        case 'incendio': {
            puntos = 10;
            // tiempo = 300000; // 5 minutos
            tiempo = 2000; // Para prueba ------------------
            break;
        }
    }

    // Intervalo que se repite mientras el problema no esté solucionado
    let intervalo = setInterval( async () => {
        urgenciaTiempo += puntos;

        getReporte.urgenciaTiempo = urgenciaTiempo;

        // Si el problema existe se entra
        if(await reporte.findById(_id)) {
            const reporteEstado = await reporte.findById(_id); // Se obtiene el reporte

            if(reporteEstado.estado == 'Desatendido') // Si el estado del reporte es Desatendido se guarda el nuevo urgenciaTiempo
                await reporte.findByIdAndUpdate(_id, getReporte);
            else
                clearInterval(intervalo); // Si no es Desatendido se detiene el algoritmo
        }
        else
            clearInterval(intervalo); // Si no existe el reporte se detiene el algoritmo
            

        console.log('Urgencia por tiempo: ' + urgenciaTiempo); // Para pruebas
    }, tiempo)
}



module.exports = reportesController;