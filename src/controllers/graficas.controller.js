const reportesGraficasController = {};

const mongoose = require('mongoose');
const fs = require('fs');

const reporte = require('../models/Reportes');
const usuario = require('../models/Usuarios');


reportesGraficasController.getReportes = async (req, res) => {
    // console.log(req.params.usuario)
    let aux = req.params.usuario;
    let separar = aux.split("$");
    console.log(separar);

    var getDaysInMonth = function(month, year) {
        return new Date(year, month, 0).getDate();
       };
       
    let ultimoDiaDelMes = getDaysInMonth(parseInt(separar[1], 10), parseInt(separar[2], 10))

    let start = separar[2]+'-'+separar[1]+'-01T14:48:00.000Z'
    let end = separar[2]+'-'+separar[1]+'-'+ultimoDiaDelMes+'T14:48:00.000Z'   // aqui debe estar la cantidad de dias que tiene este mes

    console.log(start)
    console.log(end)

    // AHORA DEBO BUSCAR EN LA BASE DE DATOS DEPENDIENDO POR MES Y AÑO
    const getReportes = await reporte.find({"$and" : [{"fechaCreacion" : {"$gte" : start}}, {"fechaCreacion" : {"$lte" : end}}]})
    // const getReportes = await reporte.find({"$and" : [{"fechaCreacion" : {"$gte" : ISODate("2022-01-01T00:00:00Z")}}, {"fechaCreacion" : {"$lte" : ISODate("2022-01-15T00:00:00Z")}}]})
    
    res.json(separarReportesPorInstitucion(separar[0].substr(0,2), getReportes));
    // res.json(getReportes)
};


reportesGraficasController.getReportesGrafica2 = async (req, res) => {
    let aux = req.params.usuario;
    let separar = aux.split("$");
    console.log(separar);

    var getDaysInMonth = function(month, year) {
        return new Date(year, month, 0).getDate();
       };
       
    let ultimoDiaDelMes = getDaysInMonth(parseInt(separar[1], 10), parseInt(separar[2], 10))

    let start = separar[2]+'-'+separar[1]+'-01T14:48:00.000Z'
    let end = separar[2]+'-'+separar[1]+'-'+ultimoDiaDelMes+'T14:48:00.000Z'   // aqui debe estar la cantidad de dias que tiene este mes

    // La primera busqueda obtiene los reportes solucionados durante el mes dado
    // la otra obtiene el resto de reportes dentro de ese mes
    let reportesSolucionados = await reporte.find({"$and" : [{"fechaSolucion" : {"$gte" : start}}, {"fechaSolucion" : {"$lte" : end}}, {estado: 'Solucionado'} ]})
    let reporteshechos = await reporte.find({"$and" : [{"fechaCreacion" : {"$gte" : start}}, {"fechaCreacion" : {"$lte" : end}} ]})
    // let reportesSolucionados = await reporte.find({"$and" : [{"fechaCreacion" : {"$gte" : start}}, {"fechaCreacion" : {"$lte" : end}}, {estado: 'Solucionado'} ]})
    // let reportesNoSolucionados = await reporte.find({"$and" : [{"fechaCreacion" : {"$gte" : start}}, {"fechaCreacion" : {"$lte" : end}}, {estado: {$ne: 'Solucionado'}} ]})

    let solucionados = separarReportesPorInstitucion(separar[0].substr(0,2), reportesSolucionados)
    let elResto = separarReportesPorInstitucion(separar[0].substr(0,2), reporteshechos)

    res.json({ solucionados, elResto})
};


reportesGraficasController.getReportesGrafica5 = async (req, res) => {
    let aux = req.params.usuario;
    let separar = aux.split("$");
    console.log(separar);

    let start = separar[1] + '-01-01T14:48:00.000Z'
    let end = separar[1]+'-12-31T14:48:00.000Z' 
   
    console.log(start)
    console.log(end)

    let getReportes = await reporte.find({"$and" : [{"fechaCreacion" : {"$gte" : start}}, {"fechaCreacion" : {"$lte" : end}}, {"cronico" : true}]})

    res.json(separarReportesPorInstitucion(separar[0].substr(0,2), getReportes))
};






function separarReportesPorInstitucion(institucion, getReportes){
    let reportes = [], cont = 0;
    //'alumbrado':'inundacion': 'fuga': 'faltaAlcantarilla': 'alcantarillaObstruida': 'escombros': 'vehiculo': 'arbol': 'socavon': 'cables': 'incendio':
    switch (institucion) { //checa las iniciales del usuario para saber a que institucion pertenece
        case "SP":
            cont = 0;
            getReportes.forEach(e => {
                if(e.tipoProblema == "inundacion" || e.tipoProblema == "fuga" || e.tipoProblema == "faltaAlcantarilla" || e.tipoProblema == "alcantarillaObstruida"){
                    reportes.push(e) //guarda en un nuevo arreglo los reportes que correspondan al tipo que soluciona la institucion del usuario que realiza la peticion
                }
                cont++;
            });
        break;      

        case "PC":
            cont = 0;
            getReportes.forEach(e => {
                if(e.tipoProblema == "escombros" || e.tipoProblema == "arbol"){
                    reportes.push(e) 
                }
                cont++;
            });
        break;      

        case "SM":
            cont = 0;
            getReportes.forEach(e => {
                if(e.tipoProblema == "vehiculo"){
                    reportes.push(e) 
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

    // console.log(reportes)
    return reportes
}



module.exports = reportesGraficasController;