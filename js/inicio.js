
import {creaCookie, creaNodo} from "./libreria.js";

compruebaAcceso(); //compruebo si puede acceder. Si no ha accedido correctamente, redirige a index

/**
 * Función que comprueba si se ha accedido correctamente
 */
function compruebaAcceso(){

    let clave= sessionStorage.getItem("inicio"); //obtengo la clave que se generó en el servidor

    fetch("../server/php/inicio.php",{
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify("clave:"+clave) //envio la clave al servidor
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){
                    if(data == "no") //en caso que NO tenga acceso (se ha llegado copiando la url), redirige al index
                        window.location.href= "../index.html";
                    else
                        document.getElementsByTagName("body")[0].style.display="flex";
                })
                .catch(function(er){
                    console.error("Error en la respuesta de la clave aleatoria: " + er);
                })
        }
    })
    .catch(function(er){
        console.error("Error al comprobar la clave aleatoria: " + er);
    })
}


solicitaSelectEmpleados(); //solicito los empleados


/**
 * FUNCIONAMIENTO de los inputs
 */

var inputs= document.getElementsByClassName("clave"); //obtengo los inputs de la clave

for(let i=0; i<inputs.length; i++){ //recorro los inputs
    inputs[i].addEventListener("keyup", siguienteInput); //le añado el evento keyup
    inputs[i].setAttribute("id", i); //como id, le pongo el index del array
}

function siguienteInput(e){    

    let id= parseInt(this.id); //obtengo la id del input que desencadenó el evento

    if(e.key=="Backspace"){ //se ha pulsado Borrar 
        
        if(id !=0)
            inputs[id].previousElementSibling.focus(); //gana el foco el anterior
        
    }
    else{ //se ha pulsado otra cosa o estoy en el primero

        if(id == inputs.length-1){
            //no haces nada
        }
        else
            inputs[id].nextElementSibling.focus(); //gana el foco el siguiente            
    }
}


/**
 * Función que envía la petición al servidor para que le devuelva los datos
 * necesarios para cargar el select de los empleados
 */
function solicitaSelectEmpleados(){

    let datos= sessionStorage.getItem("empleados");

    if(datos == null){ //no está en sessionStorage
        fetch("../server/php/inicio.php", {
            method:"POST",
            headers:{"Content-Type" : "application/json"},
            body: JSON.stringify("cargaEmpleados")
        })
            .then(function(resp){
                if(resp.ok){
                    resp.json()
                        .then(function(data){
                            cargaSelectEmpleados(data);
                            let datos= JSON.stringify(data);
                            sessionStorage.setItem("empleados", datos);
                        })
                        .catch(function(er){
                            console.error("Error al recibir los datos de los empleados: " + er);
                        })
                }
            })
            .catch(function(er){
                console.error("Error al soliciatar cargaEmpleados: " + er);
            })
    }
    else{ //ya estaba en sessionStorage
        let data= JSON.parse(datos);
        cargaSelectEmpleados(data);
    }    
}

/**
 * Función que carga los datos en el select
 * @param {*} data 
 */
function cargaSelectEmpleados(data){
    
    let select= document.getElementById("empleados"); //obtengo el selct

    let opt= creaNodo("option", "Selecciona el puesto");
    select.appendChild(opt);

    for(let i=0; i<data.length; i++){
        opt= creaNodo("option", data[i]);
        opt.setAttribute("value", data[i]);
        select.appendChild(opt);//lo meto en el select
    }
}



document.getElementById("boton").onclick = function(){ //se ha pulsado INICIAR SESIÓN

    event.preventDefault(); //evito que se recarge la página

    document.getElementById("error").innerHTML=""; //borro el contenido del error si lo hubiera

    var empleado= document.getElementById("empleados").value; //obtengo el empleado que se ha elegido

    if(empleado == "Selecciona el puesto"){
        document.getElementById("error").innerHTML="Debes seleccionar un empleado";
        return; //no continúa
    }
        
    //En este punto se seleccionó un empleado correcto

    let inputs= document.getElementsByClassName("clave"); //obtengo todos los inputs
    
    var clave="";
    let error=0;
    for(let i=0; i<inputs.length; i++){
        if(inputs[i].value == "") //si hay algún espacio vacío
            error++;
        clave+=inputs[i].value; //recojo la clave
    }

    if(error != 0)
        document.getElementById("error").innerHTML="No puedes dejar espacios en blanco";
    
    else{ //compruebo si la clave es correcta

        let obj={ //creo un objeto donde cargo lo que hay en el select y la passw que se puso
                cargo: empleado,
                passw: clave
        };
    
        fetch("../server/php/iniciarSesion.php", { //en el servidor compruebo si es correcta user/pass
        method:"POST",
        headers:{"Content-Type" : "application/json"},
        body: JSON.stringify(obj)
        })
            .then(function(resp){
                if(resp.ok){
                    resp.json()
                        .then(function(data){
                            if(data.correcto == "ok"){
                                creaCookie("sesion", empleado.toLowerCase());
                                window.location.href= "./"+data.empleado+".html";
                            }
                            else{
                                document.getElementById("error").innerHTML= "Usuario o contraseña incorrectas";
                            }
                        })
                        .catch(function(er){
                            console.error("Error al recibir los datos del nombre y pass " + er);
                        })
                }
            })
            .catch(function(er){
                console.error("Error al enviar nombre y pass" + er);
            })
    }
}





