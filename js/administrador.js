
import {creaNodo, divideArrayEnArrays} from "./libreria.js";

compruebaAcceso(); //compruebo si puede acceder. Si no ha accedido correctamente, redirige a 


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
                        document.getElementsByTagName("body")[0].style.display="initial";
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

document.getElementById("tabAcceso").addEventListener("click", cambiaPestanya);
document.getElementById("tabVentas").addEventListener("click", cambiaPestanya);
document.getElementById("tabCarta").addEventListener("click", cambiaPestanya);

/**
 * Función que cambia las pestañas
 */
function cambiaPestanya(){

    let id= this.id;
    let tab= document.getElementsByClassName("tabs")[0];
    tab.getElementsByClassName.background="none";
    tab.style.borderTopLeftRadius="0px";
    tab.style.borderBottomLeftRadius="0px";
    tab.style.borderTopRightRadius="0px";
    tab.style.borderBottomRightRadius="0px";

    switch(id){
        case "tabAcceso":  tabAcceso(tab); break;
        case "tabVentas":  tabVentas(tab); break;
        case "tabCarta": tabCarta(tab); break;
    }
}

/**
 * Se ha pulsado la pestaña Acceso
 * @param {*} tab -> Referencia de la pestaña pulsada
 */
function tabAcceso(tab){    
    tab.style.borderTopLeftRadius="10px";
    tab.style.borderBottomLeftRadius="10px";
    tab.style.background="linear-gradient(to right, #c1d7ec 0%, #c1d7ec 33%, #f0ecec 33%, #f0ecec 100%)";
    document.getElementById("divAcceso1").style.borderBottom="none";
    document.getElementById("divAcceso1").style.borderRight= "none";
    muestraDivAcceso();
}

/**
 * Se ha pulsado la pestaña Ventas
 * @param {*} tab -> Referencia de la pestaña pulsada
 */
function tabVentas(tab){
    tab.style.borderTopLeftRadius="10px";
    tab.style.borderBottomLeftRadius="10px";
    tab.style.borderTopRightRadius="10px";
    tab.style.borderBottomRightRadius="10px";
    tab.style.background= "linear-gradient(to right, #f0ecec 0%, #f0ecec 33%, #c1d7ec 33%, #c1d7ec 66%, #f0ecec 66%, #f0ecec 100% )";
    muestraDivVentas();
}

/**
 * Se ha pulsado la pestaña Carta
 * @param {*} tab -> Referencia de la pestaña pulsada
 */
function tabCarta(tab){
    tab.style.borderTopLeftRadius="0px";
    tab.style.borderBottomLeftRadius="0px";
    tab.style.borderTopRightRadius="10px";
    tab.style.borderBottomRightRadius="10px";
    tab.style.background= "linear-gradient(to right, #f0ecec 0%, #f0ecec 66%, #c1d7ec 66%, #c1d7ec 100%)";
    muestraDivCarta();
}


/***************************************
 * ACCESO
 ***************************************/
function muestraDivAcceso(){

    let divBotonesVentas= document.getElementById("divBotonesVentas").childNodes;
    let divDatosVentas= document.getElementById("divDatosVentas").childNodes;

    while(divBotonesVentas.length!=0)
        divBotonesVentas[0].remove();
    
    while(divDatosVentas.length!=0)
        divDatosVentas[0].remove();

    
    let divBotonesCarta= document.getElementById("divBotonesCarta").childNodes;
    let divDatosCarta= document.getElementById("divDatosCarta").childNodes;

    while(divBotonesCarta.length!=0)
        divBotonesCarta[0].remove();
    
    while(divDatosCarta.length!=0)
        divDatosCarta[0].remove();

    
    document.getElementById("ventas").style.display="none";
    document.getElementById("carta").style.display="none";
    document.getElementById("acceso").style.display="flex";

    solicitaEnlacesPass();
    solicitaDatosPersonal();
}

/**
 * Función que solicita los datos de las categorias
 * para poder cambiar la clave de acceso
 */
function solicitaEnlacesPass(){

    fetch("../server/php/administrador/administrador.php",{
        method:"POST",
        headers:{"Content-Type":"applicaton/json"},
        body: JSON.stringify("passAcceso")
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){
                    rellenaSelect(data);
                })
                .catch(function(er){
                    console.error("Error al recibir los datos de los enlaces para cambiar la pass: " + er);
                })
        }
    })
    .catch(function(er){
        console.error("Error al solicitar los enlaces para cambiar pass: " + er);
    })
}

/**
 * Función que rellena el select multiple
 * @param {*} data -> Datos procedentes del servidor (las categorias)
 */
function rellenaSelect(data){

    let divAcceso1= document.getElementById("divAcceso1");

    let nodos= divAcceso1.childNodes;

    while(nodos.length!=0)
        nodos[0].remove();

    let h2= creaNodo("h2", "Clave acceso aplicación");
    divAcceso1.appendChild(h2);
    let select= creaNodo("select");
        select.setAttribute("multiple", true);
        select.setAttribute("id", "selectAcceso1");
    
    for(let i=0; i<data.length; i++){
        let opt= creaNodo("option", data[i]);
        let id= i;
        id++;
            opt.setAttribute("id", "enlace"+id);
        select.appendChild(opt);
    }

    divAcceso1.appendChild(select);
    let br1= creaNodo("br");

    let divBotones= creaNodo("div");
        divBotones.setAttribute("id", "divBotones");

    let boton1= creaNodo("button");
        boton1.setAttribute("id", "bAdd");
        boton1.addEventListener("click", addEnlace);
    let imgAdd= creaNodo("img");
        imgAdd.setAttribute("src", "../img/administrador/acceso/add.png");
    boton1.appendChild(imgAdd);
    
    let boton2= creaNodo("button");
        boton2.setAttribute("id", "bRemove")
        boton2.addEventListener("click", removeEnlace);
    let imgRemove= creaNodo("img");
        imgRemove.setAttribute("src", "../img/administrador/acceso/remove.png");
    boton2.appendChild(imgRemove);

    divBotones.appendChild(boton1);
    divBotones.appendChild(boton2);
    divAcceso1.appendChild(divBotones);

    let br2= creaNodo("br");

    let select2= creaNodo("select");
        select2.setAttribute("multiple", true);
        select2.setAttribute("id", "selectAcceso2");

    divAcceso1.appendChild(select2);
    let br3= creaNodo("br");
        divAcceso1.appendChild(br3);

    let boton3= creaNodo("button", "Cambiar");
        boton3.setAttribute("id", "bChangeAcceso");
        boton3.addEventListener("click", cambiarClaveAcceso);
    divAcceso1.appendChild(boton3);

    let width= window.innerWidth; 

    if(width<=1400){ //es menor que 1400px
        document.getElementById("acceso").style.flexDirection="column";
        document.getElementById("divAcceso1").style.borderBottom= "solid 1px black";
        document.getElementById("divAcceso2").style.marginBottom= "200px";
    }
    else{
        document.getElementById("divAcceso1").style.borderRight= "solid 1px black";
    }
}


/**
 * Función que solicita los datos del personal para cambiar su pass
 */
function solicitaDatosPersonal(){

    fetch("../server/php/administrador/administrador.php",{
        method:"POST",
        headers:{"Content-Type":"applicaton/json"},
        body: JSON.stringify("datosPersonal")
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){
                    rellenaBotonesPersonal(data);
                })
                .catch(function(er){
                    console.error("Error al recibir los datos del personal: " + er);
                })
        }
    })
    .catch(function(er){
        console.error("Error al solicitar los datos del personal: " + er);
    })
}

/**
 * Función que dibuja los botones del personal
 * @param {*} data -> Datos procedentes del servidor
 */
function rellenaBotonesPersonal(data){

    let divAcceso2= document.getElementById("divAcceso2");

    let nodos= divAcceso2.childNodes;

    while(nodos.length!=0)
        nodos[0].remove();

    let h2= creaNodo("h2", "Clave de acceso del personal");

    let divBotonesPersonal= creaNodo("div");
        divBotonesPersonal.setAttribute("id", "divBotonesPersonal");

    for(let i=0; i<data.length; i++){
        
        let boton= creaNodo("button");
        boton.addEventListener("click", formPersonal);
        let id= data[i].split(".")[0];
        boton.setAttribute("id", "boton"+id);

        let img= creaNodo("img");
            let url= "../img/administrador/acceso/"+ data[i];
            img.setAttribute("src",url);
        boton.appendChild(img);
        divBotonesPersonal.appendChild(boton);
    }

    divAcceso2.appendChild(h2);
    divAcceso2.appendChild(divBotonesPersonal);
}

/**
 * Función que se ejecuta al pulsar sobre uno de los botones
 * del personal
 */
function formPersonal(){

    let divFormPersonal= creaNodo("div");
        divFormPersonal.setAttribute("id", "divFormPersonal");
    let divAcceso2= document.getElementById("divAcceso2");
        divAcceso2.appendChild(divFormPersonal);
    let botonPulsado= this;
    
    fetch("../server/php/administrador/administrador.php", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify("solicitaPersonal")
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){
                    rellenaSelectPersonal(botonPulsado, data);
                })
                .catch(function(er){
                    console.error("Error al recibir los datos del personal: " + er);
                })
        }
    })
    .catch(function(er){
        console.error("Error al solicitar info del personal: " + er);
    })    
}

/**
 * Función que rellena el select con el tipo de personal en función del botón 
 * pulsado
 * @param {*} botonPulsado -> Botón que se pulsó
 * @param {*} data -> Datos procedentes del servidor
 */
function rellenaSelectPersonal(botonPulsado, data){
    
    let divFormPersonal= document.getElementById("divFormPersonal");

    let nodos= divFormPersonal.childNodes;

    while(nodos.length!=0)
        nodos[0].remove();

    let label= creaNodo("label", "Selecciona el empleado: ");

    let selectPersonal= creaNodo("select");
        selectPersonal.setAttribute("id", "selectPersonal");
        let opt= creaNodo("option", "Selecciona un empleado");
        selectPersonal.appendChild(opt);
        selectPersonal.addEventListener("change", cambiaSelectPersonal);

    switch(botonPulsado.id){
        case "botoncamarero": 
                    for(let valor of data[1]){
                        let opt= creaNodo("option", valor.nombre);
                            opt.setAttribute("value", valor.cod_usuario);
                            selectPersonal.appendChild(opt);
                    }
                    break;
        case "botoncocinero":
                    for(let valor of data[2]){
                        let opt= creaNodo("option", valor.nombre);
                            opt.setAttribute("value", valor.cod_usuario);
                            selectPersonal.appendChild(opt);
                    }
                    break;
        case "botoncaja":
                    for(let valor of data[3]){
                        let opt= creaNodo("option", valor.nombre);
                            opt.setAttribute("value", valor.cod_usuario);
                            selectPersonal.appendChild(opt);
                    }
                    break;
        case "botonadministrador":
                for(let valor of data[4]){
                    let opt= creaNodo("option", valor.nombre);
                        opt.setAttribute("value", valor.cod_usuario);
                        selectPersonal.appendChild(opt);
                }
                break;
    }

    divFormPersonal.appendChild(label);
    divFormPersonal.appendChild(selectPersonal);
}

/**
 * Función que se ejecuta al cambiar el select del personal
 */
function cambiaSelectPersonal(){

    let divFormPersonal= document.getElementById("divFormPersonal");

    let nodosDivFormPersonal= divFormPersonal.childNodes;

    while(nodosDivFormPersonal.length!=2)
        nodosDivFormPersonal[2].remove();

    
    let optSelect= this.selectedOptions[0].textContent;

    if(optSelect!="Selecciona un empleado"){
        let h4= creaNodo("h4", "Vas a cambiar la contraseña de ");
        let span= creaNodo("span", optSelect);
        h4.appendChild(span);

        divFormPersonal.appendChild(h4);

        let label1= creaNodo("label", "Introduce la nueva contraseña: ");
        let inputPass1= creaNodo("input");
            inputPass1.setAttribute("type", "password");
            inputPass1.setAttribute("id", "password1");
        let br1= creaNodo("br");

        let label2= creaNodo("label", "Confirmar nueva contraseña: ");
        let inputPass2= creaNodo("input");
            inputPass2.setAttribute("type", "password");
            inputPass2.setAttribute("id", "password2");
        
        let br2= creaNodo("br");

        let boton= creaNodo("button", "Cambiar contraseña");
            boton.setAttribute("id", "bCambiarPass");
            boton.addEventListener("click", cambiarPassPersonal);

        divFormPersonal.appendChild(label1);
        divFormPersonal.appendChild(inputPass1);
        divFormPersonal.appendChild(br1);
        divFormPersonal.appendChild(label2);
        divFormPersonal.appendChild(inputPass2);
        divFormPersonal.appendChild(br2);
        divFormPersonal.appendChild(boton);

    }    
}

/**
 * Función que cambia la contraseña del personal seleccionado
 */
function cambiarPassPersonal(){

    let pass1= document.getElementById("password1").value;
    let pass2= document.getElementById("password2").value;

    let usuario= document.getElementById("selectPersonal").selectedOptions[0].value;

    let pError= document.getElementById("error");

    if(pError!=null)
        pError.remove();

    if(pass1==pass2){ //son iguales

        if(pass1.length==8){
            fetch("../server/php/administrador/administrador.php", {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify("cambiaPassPersonal:"+pass1+":"+usuario)
            })
            .then(function(resp){
                if(resp.ok){
                    resp.json()
                        .then(function(data){
                            if(data=="ok"){ //se ha cambiado correctamente
                                alert("Contraseña cambiada correctamente");
                                let nodos= document.getElementById("divFormPersonal").childNodes;
                                while(nodos.length!=0)
                                    nodos[0].remove();
    
                            }    
                        })
                        .catch(function(er){
                            console.error("Error al intentar cambiar la contraseña del personal: " + er);
                        })
                }
            })
            .catch(function(er){
                console.error("Error al solicitar el cambio de contraseña: " + er);
            })
        }
        else{
            let p= creaNodo("p", "Las contraseñas debe tener 8 caracteres");
                p.setAttribute("id", "error");
                document.getElementById("divFormPersonal").appendChild(p);
        }
    }
    else{
        let p= creaNodo("p", "Las contraseñas no coinciden");
            p.setAttribute("id", "error");
        document.getElementById("divFormPersonal").appendChild(p);
    }
}


/**
 * Función que añade al select multiple de la derecha la opción seleccionada
 * del select multiple de la izquierda
 */
function addEnlace(){    

    let select2= document.getElementById("selectAcceso2");
    let opciones= document.getElementById("selectAcceso1").selectedOptions;

    for(let i=0; i<opciones.length; i++){
        let opt= creaNodo("option", opciones[i].textContent);
            opt.setAttribute("id2", opciones[i].id);
        select2.appendChild(opt);
    }
    while(opciones.length!=0)
        opciones[0].selected=false;
}

/**
 * Función que quita del select multiple de la derecha la opción seleccionada
 */
function removeEnlace(){

    let opciones= document.getElementById("selectAcceso2").selectedOptions; //obtengo todas las opciones seleccionadas

    while(opciones.length!=0)
        opciones[0].remove();
}



/**
 * Función que cambia la clave (enlaces pulsados) de acceso
 */
function cambiarClaveAcceso(){

    let clave="";

    let opciones= document.getElementById("selectAcceso2").childNodes;

    for(let i=0; i<opciones.length; i++)
        clave+= opciones[i].attributes.id2.value;
    
    if(clave=="")
        alert("Debes seleccionar al menos un enlace");
    else{

        if(sessionStorage.getItem("cambioClave")==null){ //no se ha creado aún

            sessionStorage.setItem("cambioClave", clave); //guardo la clave en el sessionStorage
    
            let opciones= document.getElementById("selectAcceso2").childNodes;
    
            while(opciones.length!=0)
                opciones[0].remove(); //elimino todas las opciones
    
            alert("Vuelve a introducir la nueva clave de acceso");
        }
        else{ //ya existe
    
            let claveSessionStorage= sessionStorage.getItem("cambioClave");
    
            if(claveSessionStorage == clave){ //las dos son la misma
    
                fetch("../server/php/administrador/administrador.php", {
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body: JSON.stringify("cambioClave:"+clave)
                })
                .then(function(resp){
                    if(resp.ok){
                        resp.json()
                            .then(function(data){
                                if(data=="ok"){
                                    sessionStorage.removeItem("cambioClave");
                                    while(opciones.length!=0)
                                        opciones[0].remove();
                                    
                                    alert("Clave cambiada correctamente");
                                }
                                else
                                    alert("Error al intentar actualizar");
                            })
                            .catch(function(er){
                                console.error("Error al recibir la confirmación del cambio de clave de acceso: " + er);
                            })
                    }
                })
                .catch(function(er){
                    console.error("Error al solicitar cambiar la clave: " + er);
                })
            }
            else{ //NO es la misma
                sessionStorage.removeItem("cambioClave");
                while(opciones.length!=0)
                    opciones[0].remove();
    
                alert("Las claves de acceso no coinciden. Por favor, vuelve a introducirlas");
            }    
        }
    }
}



/***************************************
 * VENTAS
 ***************************************/

/**
 * Función que muestra los botones de la sección de Ventas
 */
function muestraDivVentas(){

    let nodosAcceso1= document.getElementById("divAcceso1").childNodes;
    let nodosAcceso2= document.getElementById("divAcceso2").childNodes;

    while(nodosAcceso1.length!=0)
        nodosAcceso1[0].remove();
    
    while(nodosAcceso2.length!=0)
        nodosAcceso2[0].remove();
    
    
    let divBotonesCarta= document.getElementById("divBotonesCarta").childNodes;
    let divDatosCarta= document.getElementById("divDatosCarta").childNodes;

    while(divBotonesCarta.length!=0)
        divBotonesCarta[0].remove();
    
    while(divDatosCarta.length!=0)
        divDatosCarta[0].remove();


    document.getElementById("acceso").style.display="none";
    document.getElementById("ventas").style.display="initial";    
    document.getElementById("carta").style.display="none";


    creaBotonesVentas();
}


/**
 * Función que dibuja en el HTML los botones de la sección Ventas
 */
function creaBotonesVentas(){

    let divBotonesVentas= document.getElementById("divBotonesVentas");

    let nodos= divBotonesVentas.childNodes;

    while(nodos.length!=0)
        nodos[0].remove();


    let boton1= creaNodo("button");
        boton1.setAttribute("id", "bTotalVentas");
        boton1.addEventListener("click", totalVentas);
    let img1= creaNodo("img");
        img1.setAttribute("src", "../img/administrador/ventas/euro.png");
        boton1.appendChild(img1);
    divBotonesVentas.appendChild(boton1);


    let boton2= creaNodo("button");
        boton2.setAttribute("id", "bPlatosMasVendidos");
        boton2.addEventListener("click", platosMasVendidos);
    let img2= creaNodo("img");
        img2.setAttribute("src", "../img/administrador/ventas/topVentas.png");
        boton2.appendChild(img2);
    divBotonesVentas.appendChild(boton2);

}



/**
 * Función que se ejecuta al pulsar sobre el botón "Total Ventas" (Símbolo €)
 */
function totalVentas(){

    let nodos= document.getElementById("divDatosVentas").childNodes;

    while(nodos.length!=0)
        nodos[0].remove();

    let divDatosVentas= document.getElementById("divDatosVentas");

    let h2= creaNodo("h2", "Total ventas");

    divDatosVentas.appendChild(h2);

    let label1= creaNodo("label", "Fecha de inicio: ");
    let input1= creaNodo("input");
        input1.setAttribute("type", "date");
        input1.setAttribute("id", "fechaIni");

    divDatosVentas.appendChild(label1);
    divDatosVentas.appendChild(input1);

    let br1= creaNodo("br");
    divDatosVentas.appendChild(br1);

    let label2= creaNodo("label", "Fecha de fin: ");
    let input2= creaNodo("input");
        input2.setAttribute("type", "date");
        input2.setAttribute("id", "fechaFin");

    divDatosVentas.appendChild(label2);
    divDatosVentas.appendChild(input2);

    let br2= creaNodo("br");
    divDatosVentas.appendChild(br2);

    let boton= creaNodo("button", "Filtrar");
        boton.setAttribute("id", "bFiltroVentas");
        boton.addEventListener("click", filtroVentas);
    divDatosVentas.appendChild(boton);

}

/**
 * Función que hace el filtro de las ventas
 */
function filtroVentas(){   

    let fechaIni= document.getElementById("fechaIni").value;
    let fechaFin= document.getElementById("fechaFin").value;

    let fechaIniDate= creaFecha(fechaIni);
    let fechaFinDate= creaFecha(fechaFin);

    let hoy= new Date();

    if(fechaIniDate!="" && fechaFinDate!=""){ //en las dos hay algo
        
        if(fechaIniDate > fechaFinDate){ //la fecha fin es más pequeña, las intercambio
            let aux= fechaIniDate;
            fechaIniDate= fechaFinDate;
            fechaFinDate= aux;
        }

        if(fechaIniDate>hoy || fechaFinDate>hoy) //ninguna de las dos puede ser posterior a hoy
            alert("No puedes introducir una fecha posterior a hoy");
        else{
            //Ahora todo es correcto

            let fechaIni= fechaSQL(fechaIniDate);
            let fechaFin= fechaSQL(fechaFinDate);

            let obj= {
                    "fechaInicio": fechaIni,
                    "fechaFin": fechaFin
            }

            obj= JSON.stringify(obj);

            fetch("../server/php/administrador/administrador.php",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify("fechas*"+obj)
            })
            .then(function(resp){
                if(resp.ok){
                    resp.json()
                        .then(function(data){

                            let nodos= document.getElementById("divDatosVentas").childNodes;
                            let div= document.getElementById("divDatosVentas");
                            while(nodos.length!=8)
                                nodos[8].remove();

                            let h2= creaNodo("h2", "Ingresos: " + data[1].ingresosBrutos.toFixed(2) + "€");
                                h2.setAttribute("id", "h2Total");
                                div.appendChild(h2);
                            
                            let h22= creaNodo("h2", "IVA Repercutido: " + data[1].ivaRepercutido.toFixed(2) + " €");
                                div.appendChild(h22);
                            
                            let h23= creaNodo("h2","Ingresos netos: " + data[1].ingresosNetos.toFixed(2) + " €" )
                                div.appendChild(h23);
                                
                            let h24= creaNodo("h2", "Total pedidos: " + data[2].length);
                            div.appendChild(h24);

                            localStorage.setItem("datosVenta", JSON.stringify(data[2]));

                            muestraTablaVentas();
                        })
                        .catch(function(er){
                            console.error("Error al recibir los datos del filtrado por fecha: " + er);
                        })
                }
            })
            .catch(function(er){
                console.error("Error al solicitar filtro fecha: " + er);
            })
        }

    }
    else if(fechaIniDate!="" || fechaFinDate!=""){ //en alguna de las dos hay algo en la otra ""
        
        if(fechaIniDate=="") //solo ha rellenado la fecha fin, relleno la inicio ya que trabajaré solo con ella
            fechaIniDate= fechaFinDate;        

    }
    else{ //las dos vacías
        alert("Introduzca al menos una fecha");
    }
}

/**
 * Función que crea una fecha (Date) con la fecha (String) que le llega
 * @param {*} fecha -> String con la fecha
 * @returns -> Fecha (Date)
 */
function creaFecha(fecha){

    if(fecha!=""){
        let array= fecha.split("-");
        let anio= array[0];
        let mes= array[1]-1;
        let dia= array[2];
        let date= new Date(anio, mes, dia);
        return date;
    }
    return fecha;    
}

/**
 * Función que convierte una fecha en formato fecha SQL
 * @param {*} fecha 
 * @returns 
 */
function fechaSQL(fecha){

    let year= fecha.getFullYear();
    let month= parseInt(fecha.getMonth())+1;

    if(month<=9)
        month= "0"+month;
    
    let day= parseInt(fecha.getDate());

    if(day<=9)
        day= "0"+day;

    let fechaSQL= year + "-" + month + "-" + day;
    return fechaSQL;
}

/**
 * Función que muestra la tabla con las ventas
 */
function muestraTablaVentas(){

    let data= JSON.parse(localStorage.getItem("datosVenta")); //aquí obtengo TODOS los cod_total_pedido de las fechas que se indicó
    
    if(data.length!=0){
        fetch("../server/php/administrador/administrador.php",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify("datosPedidos:"+data)
        })
        .then(function(resp){
            if(resp.ok){
                resp.json()
                    .then(function(datos){
                        rellenaTabla(datos);
                    })
                    .catch(function(er){
                        console.error("Error al recibir los datos de los pedidos: " + er);
                    })
            }
        })
        .catch(function(er){
            console.error("Error al solicitar los datos de los pedidos: " + er);
        })

    }
    
}

/**
 * Función que dibuja la tabla
 * @param {*} datos -> Datos procedentes del servidor
 */
function rellenaTabla(datos){

    let numFilasPag= parseInt(localStorage.getItem("numFilasPag"));
    sessionStorage.setItem("datosTabla", JSON.stringify(datos));
    
    let fragmentos;
    if(isNaN(numFilasPag)){ //no es un número
        fragmentos= Math.ceil(datos.length/4); //con esto obtengo cuantas "paginas" habrá (4 registros por página)
        localStorage.setItem("numFilasPag", 4);
    }
    else
        fragmentos= Math.ceil(datos.length/numFilasPag);
    
    fragmentos--; //le resto uno, así luego lo puedo usar como índice

    sessionStorage.setItem("numPaginasTableVentas", fragmentos);
    sessionStorage.setItem("paginaActualTableVentas", 0);
    
    let newArray;
    if(isNaN(numFilasPag))
        newArray= divideArrayEnArrays(datos, 4);
    else
        newArray= divideArrayEnArrays(datos, numFilasPag);

    sessionStorage.setItem("arrayPaginacionVentas", JSON.stringify(newArray));

    creaTablaVentas(newArray, 0);
}


/**
 * Función donde se crea la cabecera (th) de la tabla
 */
function creaCabeceraTablaVentas(){

    let divTablaTotal= creaNodo("div");
        divTablaTotal.setAttribute("id", "divTablaTotal");
    
    let table= creaNodo("table");
        table.setAttribute("id", "tableVentasTotal");
    
    let thead= creaNodo("thead");

    let tr= creaNodo("tr");
        let th1= creaNodo("th", "Cod total pedido");
        let th2= creaNodo("th", "Mesa");
        let th3= creaNodo("th", "Fecha");
        let th4= creaNodo("th", "Importe");
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    tr.appendChild(th4);

    thead.appendChild(tr)

    table.appendChild(thead);

    let tbody= creaNodo("tbody");
        tbody.setAttribute("id", "tbodyVentasTotal");

    table.appendChild(tbody);

    divTablaTotal.appendChild(table);

    document.getElementById("divDatosVentas").appendChild(divTablaTotal);
}


/**
 * Función donde se crea la tabla
 * @param {*} newArray -> Array de arrays con los datos
 * @param {*} indice -> Índice de ese array para dibujar esos datos
 */
function creaTablaVentas(newArray, indice){

    let divTablaTotal= document.getElementById("divTablaTotal");

    if(divTablaTotal!=null)
        divTablaTotal.remove();


    creaCabeceraTablaVentas();

    let table= document.getElementById("tableVentasTotal");

    let tbody= document.getElementById("tbodyVentasTotal");

    for(let i=0; i<newArray[indice].length; i++){
        let tr= creaNodo("tr");
        let td1= creaNodo("td", newArray[indice][i].cod_total_pedido);
        let td2= creaNodo("td", newArray[indice][i].mesa);
        let fechaStr= fechaFormatoES(newArray[indice][i].fecha);
        let td3= creaNodo("td", fechaStr);
        let td4= creaNodo("td", newArray[indice][i].importe);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        tbody.appendChild(tr);
    }

    let filas= document.getElementById("tbodyVentasTotal").getElementsByTagName("tr").length;

    let numFilasTabla= parseInt(localStorage.getItem("numFilasPag"));

    if(filas!=numFilasTabla){

        for(let i=0; i<numFilasTabla-filas; i++){
            let tr= creaNodo("tr");
            let td1= creaNodo("td", "123");
            td1.style.visibility="hidden";
            let td2= creaNodo("td", "Mesa 123");
            td2.style.visibility="hidden";
            let td3= creaNodo("td", "123");
            td3.style.visibility="hidden";
            let td4= creaNodo("td", "123");
            td4.style.visibility="hidden";

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);

            tr.style.visibility="hidden";

            tbody.appendChild(tr);
        }
    }
    

    document.getElementById("divTablaTotal").appendChild(table);
    
    let bPrev= creaNodo("button", "<");
        bPrev.setAttribute("class", "bPaginacion");
    document.getElementById("divTablaTotal").appendChild(bPrev);

    let pagTotales= parseInt(sessionStorage.getItem("numPaginasTableVentas"));
    pagTotales++;
    let label= creaNodo("label", " Página " + (indice+1) + " de " + pagTotales + " ");
        label.setAttribute("id", "labelPagVentas");

    document.getElementById("divTablaTotal").appendChild(label);

    let bNext= creaNodo("button", ">");
        bNext.setAttribute("class", "bPaginacion");
    document.getElementById("divTablaTotal").appendChild(bNext);

    bPrev.addEventListener("click", tablePrevVentas);
    bNext.addEventListener("click", tableNextVentas);


    let select= creaNodo("select");
        select.setAttribute("id", "selectNumFilas");
        select.addEventListener("change", numFilasVentas);
    
    let num=4;
    for(let i=0; i<4; i++){
        let opt= creaNodo("option", num);
            opt.setAttribute("value", num);
        let index= parseInt(localStorage.getItem("indexSelectNumPag"));

        if(index==i)
            opt.setAttribute("selected", true);

        num= num+2;
        select.appendChild(opt);
    }
    let labelSelect= creaNodo("label", "Número de filas por página: ");
    document.getElementById("divTablaTotal").appendChild(labelSelect);
    document.getElementById("divTablaTotal").appendChild(select);
}


/**
 * Función que se ejecuta cuando se pulsa el botón "Anterior"
 */
function tablePrevVentas(){

    let pagActual= parseInt(sessionStorage.getItem("paginaActualTableVentas"));
    let array= JSON.parse(sessionStorage.getItem("arrayPaginacionVentas"));

    if(pagActual>0){    
        pagActual--;    
        creaTablaVentas(array, pagActual);
        sessionStorage.setItem("paginaActualTableVentas", pagActual);
        
    }
}

/**
 * Función que se ejecuta cuando se pulsa el botón "Siguiente"
 */
function tableNextVentas(){
    
    let pagActual= parseInt(sessionStorage.getItem("paginaActualTableVentas"));
    let array= JSON.parse(sessionStorage.getItem("arrayPaginacionVentas"));

    let fragmentos= parseInt(sessionStorage.getItem("numPaginasTableVentas"));

    if((pagActual+1)<=fragmentos){
        pagActual++;
        creaTablaVentas(array, pagActual);
        sessionStorage.setItem("paginaActualTableVentas", pagActual);
    }
}

/**
 * Función que averigüa cuantas filas debe mostrar
 */
function numFilasVentas(){

    let numFilas= parseInt(document.getElementById("selectNumFilas").selectedOptions[0].value);
    localStorage.setItem("numFilasPag", numFilas);
    let index= parseInt(document.getElementById("selectNumFilas").selectedIndex);
    localStorage.setItem("indexSelectNumPag", index);

    let datos= JSON.parse(sessionStorage.getItem("datosTabla"));

    rellenaTabla(datos);

}

/**
 * Función que convierte la fecha (Date) en formato ES
 * dd/mm/aaaa
 * @param {*} fecha -> Fecha Date
 * @returns -> Fecha String dd/mm/aaaa
 */
function fechaFormatoES(fecha){

    let Y= fecha.split("-")[0];
    let M= fecha.split("-")[1];
    let D= fecha.split("-")[2];

    return D+"/"+M+"/"+Y;
}







/**
 * SE PULSA EL BOTÓN "PLATOS MÁS VENDIDOS"
 */
function platosMasVendidos(){

    let nodos= document.getElementById("divDatosVentas").childNodes;

    while(nodos.length!=0)
        nodos[0].remove();


    fetch("../server/php/administrador/administrador.php", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify("platosMasVendidos")
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){
                    formFiltradoPlatosMasVendidos(data);
                    rellenaTablaPlatosMasVendidos(data);
                })
                .catch(function(er){
                    console.error("Error al recibir los datos de los platos más vendidos: " + er);
                })
        }
    })
    .catch(function(er){
        console.error("Error al solicitar los platos más vendidos: " + er);
    })
}

/**
 * Función que ejecuta el filtro de los platos más vendidos
 * @param {*} data -> Datos procedentes del servidor
 */
function formFiltradoPlatosMasVendidos(data){

    let h2= creaNodo("h2", "Top-Ventas");


    let labelCateg= creaNodo("label", "Categorias: ");
    let selectCateg= creaNodo("select");
        selectCateg.setAttribute("id", "selectCategMasVendidos");
    let opt= creaNodo("option", "Selecciona una categoria");
        opt.setAttribute("value", 0);
        selectCateg.appendChild(opt);
    opt= creaNodo("option", "Sin bebida");
        opt.setAttribute("value", "sin");
        selectCateg.appendChild(opt);
    let arrayCateg=[];
    for(let i=0; i<data.length; i++){

        if(arrayCateg.indexOf(data[i].nombre_categoria)==-1) //no lo encuentra
            arrayCateg[data[i].cod_categoria]= data[i].nombre_categoria;
    }

    for(let i=1; i<arrayCateg.length; i++){
        opt= creaNodo("option", arrayCateg[i]);
            opt.setAttribute("value", i);
        selectCateg.appendChild(opt);
    }
    
    document.getElementById("divDatosVentas").appendChild(h2);
    document.getElementById("divDatosVentas").appendChild(labelCateg);
    document.getElementById("divDatosVentas").appendChild(selectCateg);

    let br= creaNodo("br");
    document.getElementById("divDatosVentas").appendChild(br);

    let boton= creaNodo("button", "Filtrar");
        boton.setAttribute("id", "bFiltroMasVendidos");
        boton.addEventListener("click", filtroMasVendidos);

    document.getElementById("divDatosVentas").appendChild(boton);
}




/**
 * Función que rellena la tabla con los platos más vendidos
 * @param {*} datos -> Datos procedentes del servidor
 */
function rellenaTablaPlatosMasVendidos(datos){

    let numFilasPagVendidos= parseInt(localStorage.getItem("numFilasPagVendidos"));
    // if(sessionStorage.getItem("datosTablaVendidos") == null)
    sessionStorage.setItem("datosTablaVendidos", JSON.stringify(datos));

    let fragmentos;

    if(isNaN(numFilasPagVendidos)){
        fragmentos= Math.ceil(datos.length/10);
        localStorage.setItem("numFilasPagVendidos", 10);
    }        
    else
        fragmentos= Math.ceil(datos.length/numFilasPagVendidos);
    
    fragmentos--;

    sessionStorage.setItem("numPaginasTableMasVendidos", fragmentos);
    sessionStorage.setItem("paginaActualTableMasVendidos", 0);

    let newArray;
    if(isNaN(numFilasPagVendidos))
        newArray= divideArrayEnArrays(datos, 10);
    else
        newArray= divideArrayEnArrays(datos, numFilasPagVendidos);
    
    sessionStorage.setItem("arrayPaginacionMasVendidos", JSON.stringify(newArray));

    creaTablaMasVendidos(newArray, 0);    
}

/**
 * Función que crea la cabecera (th) de la tabla de los platos más vendidos
 */
function creaCabeceraTablaMasVendidos(){


    let divTablaMasVendidos= creaNodo("div");
    divTablaMasVendidos.setAttribute("id", "divTablaMasVendidos");

    let table= creaNodo("table");
        table.setAttribute("id", "tableMasVendidos");

    let thead= creaNodo("thead");

    let tr= creaNodo("tr");
        let th1= creaNodo("th", "Categoria");
        let th2= creaNodo("th", "Comida");
        let th3= creaNodo("th", "Vendidos");
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);

    thead.appendChild(tr)

    table.appendChild(thead);

    let tbody= creaNodo("tbody");
        tbody.setAttribute("id", "tbodyMasVendidos");

    table.appendChild(tbody);

    divTablaMasVendidos.appendChild(table);

    document.getElementById("divDatosVentas").appendChild(divTablaMasVendidos);


}



/**
 * Función que crea la tabla de los más vendidos
 * @param {*} newArray -> Array de arrays con los platos más vendidos
 * @param {*} indice -> Índice de ese array
 */
function creaTablaMasVendidos(newArray, indice){

    let divTablaMas= document.getElementById("divTablaMasVendidos");

    if(divTablaMas!=null)
        divTablaMas.remove();
    
    creaCabeceraTablaMasVendidos();

    let table= document.getElementById("tableMasVendidos");
    let tbody= document.getElementById("tbodyMasVendidos");

    for(let i=0; i<newArray[indice].length; i++){
        let tr= creaNodo("tr");
        let td1= creaNodo("td", newArray[indice][i].nombre_categoria);
        let td2= creaNodo("td", newArray[indice][i].nombre_comida);
        let td3= creaNodo("td", newArray[indice][i].vendidos);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        tbody.appendChild(tr);
    }

    let filas= document.getElementById("tbodyMasVendidos").getElementsByTagName("tr").length;

    let numFilasTabla= parseInt(localStorage.getItem("numFilasPagVendidos"));

    if(filas!=numFilasTabla){

        for(let i=0; i<numFilasTabla-filas; i++){
            let tr= creaNodo("tr");
            let td1= creaNodo("td", "123");
            td1.style.visibility="hidden";
            let td2= creaNodo("td", "Mesa 123");
            td2.style.visibility="hidden";
            let td3= creaNodo("td", "123");
            td3.style.visibility="hidden";

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);

            tr.style.visibility="hidden";

            tbody.appendChild(tr);

        }
    }

    document.getElementById("divTablaMasVendidos").appendChild(table);

    let bPrev= creaNodo("button", "<");
        bPrev.setAttribute("class", "bPaginacion");
    document.getElementById("divTablaMasVendidos").appendChild(bPrev);

    let pagTotales= parseInt(sessionStorage.getItem("numPaginasTableMasVendidos"));
    pagTotales++;
    let label= creaNodo("label", " Página " + (indice+1) + " de " + pagTotales + "");
        label.setAttribute("id", "labelPagMasVendidos");

    document.getElementById("divTablaMasVendidos").appendChild(label);

    let bNext= creaNodo("button", ">");
        bNext.setAttribute("class", "bPaginacion");
    document.getElementById("divTablaMasVendidos").appendChild(bNext);

    bPrev.addEventListener("click", tablePrevMasVendidos);
    bNext.addEventListener("click", tableNextMasVendidos);


    let select= creaNodo("select");
        select.setAttribute("id", "selectNumFilas");
        select.addEventListener("change", numFilasMasVendidos);


    let num=10;
    for(let i=0; i<4; i++){
        let opt= creaNodo("option", num);
            opt.setAttribute("value", num);
        let index= parseInt(localStorage.getItem("indexSelectNumPag"));

        if(index==i)
            opt.setAttribute("selected", true);

        num= num+5;
        select.appendChild(opt);
    }
    let labelSelect= creaNodo("label", "Número de filas por página: ");
    document.getElementById("divTablaMasVendidos").appendChild(labelSelect);
    document.getElementById("divTablaMasVendidos").appendChild(select);
}

/**
 * Función que se ejecuta al pulsar "anterior"
 */
function tablePrevMasVendidos(){

    let pagActual= parseInt(sessionStorage.getItem("paginaActualTableMasVendidos"));
    let array= JSON.parse(sessionStorage.getItem("arrayPaginacionMasVendidos"));

    if(pagActual>0){    
        pagActual--;    
        creaTablaMasVendidos(array, pagActual);
        sessionStorage.setItem("paginaActualTableMasVendidos", pagActual);
        
    }
}

/**
 * Función que se ejecuta al pulsar "siguiente"
 */
function tableNextMasVendidos(){

    let pagActual= parseInt(sessionStorage.getItem("paginaActualTableMasVendidos"));
    let array= JSON.parse(sessionStorage.getItem("arrayPaginacionMasVendidos"));

    let fragmentos= parseInt(sessionStorage.getItem("numPaginasTableMasVendidos"));

    if((pagActual+1)<=fragmentos){
        pagActual++;
        creaTablaMasVendidos(array, pagActual);
        sessionStorage.setItem("paginaActualTableMasVendidos", pagActual);
    }

}

/**
 * Función que averigüa cuantas filas se deben mostrar
 */
function numFilasMasVendidos(){

    let numFilas= parseInt(document.getElementById("selectNumFilas").selectedOptions[0].value);
    localStorage.setItem("numFilasPagVendidos", numFilas);
    let index= parseInt(document.getElementById("selectNumFilas").selectedIndex);
    localStorage.setItem("indexSelectNumPag", index);

    let datos= JSON.parse(sessionStorage.getItem("datosTablaVendidos"));
    rellenaTablaPlatosMasVendidos(datos);
}




/**
 * Función que filtra los platos más vendidos
 */
function filtroMasVendidos(){

    fetch("../server/php/administrador/administrador.php", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify("platosMasVendidos")
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){

                    let datos= data;

                    let newArray=[];
                    let valueSelect= parseInt(document.getElementById("selectCategMasVendidos").selectedOptions[0].value);
                
                    if(valueSelect==0) //NO se ha seleccionado ninguna opción.
                        rellenaTablaPlatosMasVendidos(datos);
                    else if(isNaN(valueSelect)){ //el único "value" que NO es un número es "sin bebidas"
                
                        for(let i=0; i<datos.length; i++){
                            if(datos[i].cod_categoria!=20)
                                newArray.push(datos[i]);
                        }
                        rellenaTablaPlatosMasVendidos(newArray);
                    }
                    else{
                        for(let i=0; i<datos.length; i++){
                            if(datos[i].cod_categoria==valueSelect)
                                newArray.push(datos[i]);
                        }
                    
                        rellenaTablaPlatosMasVendidos(newArray);
                    }
                })
                .catch(function(er){
                    console.error("Error al recibir los datos de los platos más vendidos: " + er);
                })
        }
    })
    .catch(function(er){
        console.error("Error al solicitar los platos más vendidos: " + er);
    })   
    
}





/***************************************
 * CARTA
 ***************************************/

/**
 * Se pulsa la pestaña Carta
 */
function muestraDivCarta(){

    let nodosAcceso1= document.getElementById("divAcceso1").childNodes;
    let nodosAcceso2= document.getElementById("divAcceso2").childNodes;

    while(nodosAcceso1.length!=0)
        nodosAcceso1[0].remove();
    
    while(nodosAcceso2.length!=0)
        nodosAcceso2[0].remove();


    
    let divBotonesVentas= document.getElementById("divBotonesVentas").childNodes;
    let divDatosVentas= document.getElementById("divDatosVentas").childNodes;

    while(divBotonesVentas.length!=0)
        divBotonesVentas[0].remove();

    while(divDatosVentas.length!=0)
        divDatosVentas[0].remove();


    document.getElementById("acceso").style.display="none";
    document.getElementById("ventas").style.display="none";    
    document.getElementById("carta").style.display="initial";


    creaBotonesCarta();
}


/**
 * Función que dibuja en el HTML los botones de la sección CARTA
 */
function creaBotonesCarta(){

    let divBotonesCarta= document.getElementById("divBotonesCarta");

    let nodos= divBotonesCarta.childNodes;

    while(nodos.length!=0)
        nodos[0].remove();


    let boton1= creaNodo("button");
        boton1.setAttribute("id", "bCambiaPrecio");
    let img= creaNodo("img");
        img.setAttribute("src", "../img/administrador/carta/cambiaPrecio.png");
        boton1.appendChild(img);
        boton1.addEventListener("click", cambiaCartaAdmin);
    let boton2= creaNodo("button");
        boton2.setAttribute("id", "bCambiaCarta");
        img= creaNodo("img");
        img.setAttribute("src", "../img/administrador/carta/carta.png");
        boton2.appendChild(img);
        boton2.addEventListener("click", cambiaCartaAdmin);
    let boton3= creaNodo("button");
        boton3.setAttribute("id", "bCambiaStock");
        img= creaNodo("img");
        img.setAttribute("src", "../img/administrador/carta/stock.png");
        boton3.appendChild(img);
        boton3.addEventListener("click", cambiaCartaAdmin);
    
    divBotonesCarta.appendChild(boton1);
    divBotonesCarta.appendChild(boton2);
    divBotonesCarta.appendChild(boton3);
}


/**
 * Función que se ejecuta al pulsar sobre los botones de la sección Carta
 */
function cambiaCartaAdmin(){

    let id= this.id;
    sessionStorage.setItem("bPulsadoCarta", id);

    let nodos= document.getElementById("divDatosCarta").childNodes;

    while(nodos.length!=0)
        nodos[0].remove();

    let div= document.getElementById("divDatosCarta");

    if(id=="bCambiaPrecio"){
        let h2= creaNodo("h2", "Modificar precios");
            div.appendChild(h2);
    }
    else if(id=="bCambiaCarta"){
        let h2= creaNodo("h2", "Modificar carta");
            div.appendChild(h2);
    }
    else if(id=="bCambiaStock"){
        let h2= creaNodo("h2", "Modificar stock");
            div.appendChild(h2);
    }



    fetch("../server/php/administrador/administrador.php",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify("cartaAdmin")
    })
    .then(function(resp){
        if(resp.ok)
            resp.json()
                .then(function(datos){
                    formFiltroCarta(datos);
                    rellenaTablaCarta(datos);
                })
                .catch(function(er){
                    console.error("Error al recibir los datos de las categorias y comidas: " + er);
                })
    })
    .catch(function(er){
        console.error("Error al solicitar los datos de las categorias y comidas: " + er);
    })
}

/**
 * Función que hace el firltrado de la sección Carta
 * @param {*} datos -> Datos procedentes del servidor
 */
function formFiltroCarta(datos){

    let botonPulsado= sessionStorage.getItem("bPulsadoCarta");

    let array=[];

    let label= creaNodo("label", "Categorias: ");
    let select= creaNodo("select");
        select.setAttribute("id", "selectCategCarta");
    let opt= creaNodo("option", "Selecciona una categoria");
        opt.setAttribute("value", 0);
    select.appendChild(opt);

    for(let i=0; i<datos.length; i++)
        if(array.indexOf(datos[i].nombre_categoria)==-1)
            array[datos[i].cod_categoria]= datos[i].nombre_categoria;
    
    for(let i=1; i<array.length; i++){
        opt= creaNodo("option", array[i]);
            opt.setAttribute("value", i);
        select.appendChild(opt);
    }

    let br1= creaNodo("br");
    document.getElementById("divDatosCarta").appendChild(br1);
    document.getElementById("divDatosCarta").appendChild(label);
    document.getElementById("divDatosCarta").appendChild(select);

    let br= creaNodo("br");
    document.getElementById("divDatosCarta").appendChild(br);

    let boton= creaNodo("button", "Filtrar");
        boton.setAttribute("id", "bFiltrarCarta");
        boton.addEventListener("click", filtroCarta);
    
    document.getElementById("divDatosCarta").appendChild(boton);
    
    if(botonPulsado=="bCambiaStock"){
        let botonMenosDe= creaNodo("button", "Menos de 10");
            botonMenosDe.setAttribute("id", "bFiltroMenosDe");
            botonMenosDe.addEventListener("click", menosDe10);
        document.getElementById("divDatosCarta").appendChild(botonMenosDe);
    }
    else if(botonPulsado=="bCambiaCarta"){
        let labelAnadirComida= creaNodo("label", "Añadir categoria/comida");
        let botonAddComida= creaNodo("button");

        let img= creaNodo("img");
            img.setAttribute("src", "../img/administrador/carta/addComida.png");
            botonAddComida.appendChild(img);
            botonAddComida.setAttribute("id", "bAddComida");
            botonAddComida.addEventListener("click", addComida);
        
        document.getElementById("divDatosCarta").appendChild(labelAnadirComida);
        document.getElementById("divDatosCarta").appendChild(botonAddComida);
    }
    else if(botonPulsado=="bCambiaPrecio"){
        let botonIVA= creaNodo("button");
            botonIVA.setAttribute("id", "bCambiaIva");
            botonIVA.addEventListener("click", cambiaIva);
        
        let logoHacienda= creaNodo("img");
            logoHacienda.setAttribute("src", "../img/administrador/carta/logo-Hacienda.png");
            logoHacienda.setAttribute("alt", "logo-Hacienda");
        botonIVA.appendChild(logoHacienda);

        document.getElementById("divDatosCarta").appendChild(botonIVA);
    }
}

/**
 * Función que cambia el porcentaje de iva
 */
function cambiaIva(){

    let div= document.getElementById("divDatosCarta");

    while(div.childNodes.length !=0)
        div.childNodes[0].remove();
    
    let h2= creaNodo("h2", "Modificar porcentaje IVA");
        div.appendChild(h2);

    let br1= creaNodo("br");
    div.appendChild(br1);
    
    let select= creaNodo("select");
        select.setAttribute("id", "selectModIva");
        select.addEventListener("change", formCambiaIva);
    
    let opt= creaNodo("option", "Selecciona una categoria");
        opt.setAttribute("value", 0);
    
    select.appendChild(opt);
    
    let datosCategorias= JSON.parse(sessionStorage.getItem("enlacesMenu"));

    for(let categoria of datosCategorias){

        let nombre_categoria= categoria.nombre;
        let idCategoria= parseInt(categoria.cod_categoria);

        opt= creaNodo("option", nombre_categoria);
            opt.setAttribute("value", idCategoria);

        select.appendChild(opt);
    }

    div.appendChild(select);
}


function formCambiaIva(){

    let cod_categoria= this.value;

    let div= document.getElementById("divDatosCarta");

    while(div.childNodes.length !=3)
        div.childNodes[3].remove();

    if(cod_categoria==0){
        return;
    }
    
    let br1= creaNodo("br");
    div.appendChild(br1);

    let inputNum= creaNodo("input");
        inputNum.setAttribute("type", "number");
        inputNum.setAttribute("id", "modPorcenIva");
        inputNum.setAttribute("placeholder", "Introduce el porcentaje de iva");
    div.appendChild(inputNum);

    let br2= creaNodo("br");
    div.appendChild(br2);

    let btn= creaNodo("button", "Cambiar");
        btn.setAttribute("id", "btnCambiaIva");
        btn.addEventListener("click", cambiaIvaBD);
    div.appendChild(btn);
}



function cambiaIvaBD(){

    let cod_categoria= document.getElementById("selectModIva").value;
    let porcentaje= document.getElementById("modPorcenIva").value;

    let obj= {
                cod_categoria: cod_categoria,
                porcen: porcentaje
    };

    obj= JSON.stringify(obj);

    fetch("../server/php/administrador/administrador.php",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify("modificaIva*"+obj)
    })
    .then(function(resp){
        if(resp.ok)
            resp.json()
                .then(function(data){
                    if(data=="ok"){
                        alert("Porcentaje cambiado correctamente");
                        
                    }
                    else
                        alert("Fallo al cambiar el porcentaje de iva");
                        


                })
                .catch(function(er){
                    console.error("Error al actualizar el porcentaje de IVA: " + er);
                })
    })
    .catch(function(er){
        console.error("Error al enviar los datos del porcentaje de IVA: " + er);
    })




}





/**
 * Función que crea la tabla de la sección Carta
 * @param {*} datos -> Datos procedentes del servidor
 */
function rellenaTablaCarta(datos){

    let numFilasPag= parseInt(localStorage.getItem("numFilasPagCarta"));
    sessionStorage.setItem("datosTablaCarta", JSON.stringify(datos));
    
    let fragmentos;
    if(isNaN(numFilasPag)){ //no es un número
        fragmentos= Math.ceil(datos.length/4); //con esto obtengo cuantas "paginas" habrá (4 registros por página)
        localStorage.setItem("numFilasPagCarta", 4);
    }
    else
        fragmentos= Math.ceil(datos.length/numFilasPag);
    
    fragmentos--; //le resto uno, así luego lo puedo usar como índice

    sessionStorage.setItem("numPaginasTablaCarta", fragmentos);
    sessionStorage.setItem("paginaActualTablaCarta", 0);
    
    let newArray;
    if(isNaN(numFilasPag))
        newArray= divideArrayEnArrays(datos, 4);
    else
        newArray= divideArrayEnArrays(datos, numFilasPag);

    sessionStorage.setItem("arrayPaginacionCarta", JSON.stringify(newArray));

    creaTablaCarta(newArray, 0);
}

/**
 * Función que crea la cabecera (th) de la tabla sección Carta
 * @param {*} id -> Id del botón que se pulsó (Subir/bajar prcios -- Mostrar/ocultar comidas -- Stock)
 */
function creaCabeceraTablaCarta(id){    

    let div= creaNodo("div");
        div.setAttribute("id", "divTablaCarta");
    
    let table= creaNodo("table");
        table.setAttribute("id", "tableCarta");
    
    let thead= creaNodo("thead");

    let tr= creaNodo("tr");
        let th1= creaNodo("th", "Categoria");
        let th2= creaNodo("th", "Comida");
        let th3;
        let th4=null;
        if(id=="bCambiaPrecio"){
            th3= creaNodo("th", "Precio");
            th4= creaNodo("th", "IVA");
        }
        else if(id=="bCambiaCarta"){
            th3= creaNodo("th", "Ofertada");
        }            
        else if(id=="bCambiaStock")
            th3= creaNodo("th", "Stock");
        
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    if(th4!=null)
        tr.appendChild(th4);
   
    thead.appendChild(tr);
    table.appendChild(thead);

    let tbody= creaNodo("tbody");
        tbody.setAttribute("id", "tbodyCarta");
    table.appendChild(tbody);

    div.appendChild(table);

    document.getElementById("divDatosCarta").appendChild(div);
}

/**
 * Función que dibuja la tabla
 * @param {*} newArray -> Array de arrays con los datos a mostrar
 * @param {*} indice -> Índice de ese array
 */
function creaTablaCarta(newArray, indice){

    let idBotonPulsado= sessionStorage.getItem("bPulsadoCarta");
    let div= document.getElementById("divTablaCarta");

    if(div!=null)
        div.remove();

    creaCabeceraTablaCarta(idBotonPulsado);

    let tabla= document.getElementById("tableCarta");

    let tbody= document.getElementById("tbodyCarta");

    for(let i=0; i<newArray[indice].length; i++){
        let tr= creaNodo("tr");
            tr.addEventListener("click", infoProducto);
            tr.setAttribute("filaValida", true);
            tr.setAttribute("id", "fila:"+i);
            let td1= creaNodo("td", newArray[indice][i].nombre_categoria);
                td1.setAttribute("categoria", newArray[indice][i].cod_categoria);
            let td2= creaNodo("td", newArray[indice][i].nombre_comida);
                td2.setAttribute("cod_comida", newArray[indice][i].cod_comida);
            let td3;
            let td4=null;
            if(idBotonPulsado=="bCambiaPrecio"){
                td3= creaNodo("td", newArray[indice][i].precio);
                td4= creaNodo("td", newArray[indice][i].iva);
            }
            else if(idBotonPulsado=="bCambiaCarta"){
                td3= creaNodo("td", newArray[indice][i].habilitado_comida==1?"SÍ":"NO");
            }                
            else if(idBotonPulsado=="bCambiaStock"){
                td3= creaNodo("td", newArray[indice][i].cantidad);

                if(parseInt(newArray[indice][i].cantidad)<10)
                    td3.style.backgroundColor= "rgb(230, 178, 178)";
            }
                

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        if(td4!=null)
            tr.appendChild(td4);
        
        tbody.appendChild(tr);
    }

    let filas= document.getElementById("tbodyCarta").getElementsByTagName("tr").length;

    let numFilas= parseInt(localStorage.getItem("numFilasPagCarta"));

    if(filas!=numFilas){

        let botonPulsado= sessionStorage.getItem("bPulsadoCarta");

        for(let i=0; i<numFilas-filas; i++){
            let tr= creaNodo("tr");
            let td1= creaNodo("td", "123");
            td1.style.visibility="hidden";
            let td2= creaNodo("td", "Mesa 123");
            td2.style.visibility="hidden";
            let td3= creaNodo("td", "123");
            td3.style.visibility="hidden";           

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);

            if(botonPulsado=="bCambiaPrecio"){
                let td4= creaNodo("td", "123");
                td4.style.visibility="hidden";
                tr.appendChild(td4);
            }           

            tr.style.visibility="hidden";

            tbody.appendChild(tr);
        }
    }


    document.getElementById("divTablaCarta").appendChild(tabla);

    let bPrev= creaNodo("button", "<");
        bPrev.setAttribute("class", "bPaginacion");
    document.getElementById("divTablaCarta").appendChild(bPrev);

    let pagTotales= parseInt(sessionStorage.getItem("numPaginasTablaCarta"));
    pagTotales++;
    let label= creaNodo("label", " Página " + (indice+1) + " de " + pagTotales + " ");
        label.setAttribute("id", "labelPagCarta");

    document.getElementById("divTablaCarta").appendChild(label);

    let bNext= creaNodo("button", ">");
        bNext.setAttribute("class", "bPaginacion");
    document.getElementById("divTablaCarta").appendChild(bNext);

    bPrev.addEventListener("click", tablePrevCarta);
    bNext.addEventListener("click", tableNextCarta);


    let select= creaNodo("select");
        select.setAttribute("id", "selectNumFilasCarta");
        select.addEventListener("change", numFilasCarta);
    
    let num=4;
    for(let i=0; i<4; i++){
        let opt= creaNodo("option", num);
            opt.setAttribute("value", num);
        let index= parseInt(localStorage.getItem("indexSelectNumPagCarta"));

        if(index==i)
            opt.setAttribute("selected", true);

        num= num+2;
        select.appendChild(opt);
    }
    let labelSelect= creaNodo("label", "Número de filas por página: ");
    document.getElementById("divTablaCarta").appendChild(labelSelect);
    document.getElementById("divTablaCarta").appendChild(select);


}

/**
 * Función que se ejecuta al pulsar "anterior"
 */
function tablePrevCarta(){

    let divRemove= document.getElementById("divInfoFilaCarta");

    if(divRemove!=null)
        divRemove.remove();

    let pagActual= parseInt(sessionStorage.getItem("paginaActualTablaCarta"));
    let array= JSON.parse(sessionStorage.getItem("arrayPaginacionCarta"));

    if(pagActual>0){
        pagActual--;
        creaTablaCarta(array, pagActual);
        sessionStorage.setItem("paginaActualTablaCarta", pagActual);
    }
}


/**
 * Función que se ejecuta al pulsar "siguiente"
 */
function tableNextCarta(){

    let divRemove= document.getElementById("divInfoFilaCarta");

    if(divRemove!=null)
        divRemove.remove();

    let pagActual= parseInt(sessionStorage.getItem("paginaActualTablaCarta"));
    let array= JSON.parse(sessionStorage.getItem("arrayPaginacionCarta"));

    let fragmentos= parseInt(sessionStorage.getItem("numPaginasTablaCarta"));

    if((pagActual+1)<=fragmentos){
        pagActual++;
        creaTablaCarta(array, pagActual);
        sessionStorage.setItem("paginaActualTablaCarta", pagActual);
    }
}


/**
 * Función que averigüa cuantas filas debe mostrar
 */
function numFilasCarta(){

    let divRemove= document.getElementById("divInfoFilaCarta");

    if(divRemove!=null)
        divRemove.remove();

    let numFilas= parseInt(document.getElementById("selectNumFilasCarta").selectedOptions[0].value);
    localStorage.setItem("numFilasPagCarta", numFilas);
    let index= parseInt(document.getElementById("selectNumFilasCarta").selectedIndex);
    localStorage.setItem("indexSelectNumPagCarta", index);

    let datos= JSON.parse(sessionStorage.getItem("datosTablaCarta"));

    rellenaTablaCarta(datos);

}

/**
 * Función que ejecuta el filtro para la tabla Carta
 */
function filtroCarta(){

    let divRemove= document.getElementById("divInfoFilaCarta");

    if(divRemove!=null)
        divRemove.remove();


    fetch("../server/php/administrador/administrador.php",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify("cartaAdmin")
    })
    .then(function(resp){
        if(resp.ok)
            resp.json()
                .then(function(data){

                    let newArray=[];
                    let valueSelect= parseInt(document.getElementById("selectCategCarta").selectedOptions[0].value);
                
                    if(valueSelect==0){ //se ha seleccionado "Selecciona una opción"
                        rellenaTablaCarta(data);
                    }
                    else{ //se ha seleccionado una categoria
                
                        for(let i=0; i<data.length; i++){
                            if(parseInt(data[i].cod_categoria)==valueSelect)
                                newArray.push(data[i]);
                        }                
                        rellenaTablaCarta(newArray);                
                    }                    
                })
                .catch(function(er){
                    console.error("Error al recibir los datos de las categorias y comidas: " + er);
                })
    })
    .catch(function(er){
        console.error("Error al solicitar los datos de las categorias y comidas: " + er);
    })
}

/**
 * Función que se ejecuta al pulsar el botón Menos de 10
 */
function menosDe10(){

    let div= document.getElementById("divInfoFilaCarta");

    if(div!=null)
        div.remove();

    fetch("../server/php/administrador/administrador.php",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify("menosDe10")
    })
    .then(function(resp){
        if(resp.ok)
            resp.json()
                .then(function(data){
                    // formFiltroCarta(data);
                    rellenaTablaCarta(data);                                      
                })
                .catch(function(er){
                    console.error("Error al recibir los datos de las categorias y comidas: " + er);
                })
    })
    .catch(function(er){
        console.error("Error al solicitar los datos de las categorias y comidas: " + er);
    })
}

/**
 * Función que muestra el formulario para añadir otra comida
 */
function addComida(){

    let div= document.getElementById("divDatosCarta");    

    let nodos= div.childNodes;

    while(nodos.length!=0)
        nodos[0].remove();

    let divAux= creaNodo("div");
        divAux.setAttribute("id", "divAnadirCategoriaComidia");
    
    let divAnadeComida= creaNodo("div");
        divAnadeComida.setAttribute("id", "divAnadeComida");
    
    let divAnadeCategoria= creaNodo("div");
        divAnadeCategoria.setAttribute("id", "divAnadeCategoria");

    let h2= creaNodo("h2", "Añade nueva comida");
        div.appendChild(h2);

    let h2Categ= creaNodo("h2", "Añade nueva categoria");
        div.appendChild(h2Categ);

    let datos= JSON.parse(sessionStorage.getItem("enlacesMenu"));

    let select= creaNodo("select");
        select.addEventListener("change", formAddComida);
        select.setAttribute("id", "selectAddComida");

    let opt1= creaNodo("option", "Selecciona una categoria");
        opt1.setAttribute("value", "0");
        select.appendChild(opt1);
    
    for(let i=0; i<datos.length; i++){
        let opt= creaNodo("option", datos[i].nombre);
            opt.setAttribute("value", datos[i].cod_categoria);
        select.appendChild(opt);
    }

    let iframe= creaNodo("iframe");
        iframe.setAttribute("name", "iframeInvisible");
        iframe.setAttribute("style", "display='none;'");

    let formAnadeCateg= creaNodo("form");
        formAnadeCateg.setAttribute("id", "formAnadeCateg");
        formAnadeCateg.setAttribute("action", "../server/php/administrador/administrador.php");
        formAnadeCateg.setAttribute("method", "POST");
        formAnadeCateg.setAttribute("enctype", "multipart/form-data");
        formAnadeCateg.setAttribute("target", "iframeInvisible");
        formAnadeCateg.addEventListener("submit", formSubmit);

    let inputNombreCateg= creaNodo("input");
        inputNombreCateg.setAttribute("type", "text");
        inputNombreCateg.setAttribute("placeholder", "Nombre de la categoria");
        inputNombreCateg.setAttribute("id", "nombreCategoria");
        inputNombreCateg.setAttribute("name", "nomCategoria");
    
    let br= creaNodo("br");

    let labelFoto= creaNodo("label", "Selecciona una imagen para la categoria: ");

    let inputFotoCateg= creaNodo("input");
        inputFotoCateg.setAttribute("type", "file");
        inputFotoCateg.setAttribute("id", "fotoCategoria");
        inputFotoCateg.setAttribute("name", "fotoCateg");
    
    let br2= creaNodo("br");
    
    let labelHabilitado= creaNodo("label", "Habilitado: ");

    let br3= creaNodo("br");
    let labelSi= creaNodo("label", "SÍ");
    let inputSI= creaNodo("input");
        inputSI.setAttribute("type", "radio");
        inputSI.setAttribute("name", "habilitado");
        inputSI.setAttribute("id", "habilitadoSI");
        inputSI.setAttribute("value", "1");
        inputSI.setAttribute("checked", true);

    let labelNo= creaNodo("label", "NO");
    let inputNO= creaNodo("input");
        inputNO.setAttribute("type", "radio");
        inputNO.setAttribute("name", "habilitado");
        inputNO.setAttribute("id", "habilitadoNO");
        inputNO.setAttribute("value", "0");

    let br4= creaNodo("br");

    let labelesBebida= creaNodo("label", "Es bebida: ");

    let br5= creaNodo("br");
    let labelSiB= creaNodo("label", "SÍ");
    let inputSIB= creaNodo("input");
        inputSIB.setAttribute("type", "radio");
        inputSIB.setAttribute("name", "bebida");
        inputSIB.setAttribute("id", "esBebidaSI");
        inputSIB.setAttribute("value", "1");
        inputSIB.setAttribute("checked", true);

    let labelNoB= creaNodo("label", "NO");
    let inputNOB= creaNodo("input");
        inputNOB.setAttribute("type", "radio");
        inputNOB.setAttribute("name", "bebida");
        inputNOB.setAttribute("id", "esBebidaNO");
        inputNOB.setAttribute("value", "0");

    let br6= creaNodo("br");

   
    let inputSubmit= creaNodo("input");
        inputSubmit.setAttribute("type", "submit");
        inputSubmit.setAttribute("value", "Crear categoria");
        inputSubmit.setAttribute("name", "creaCategoria");
    
    let inputhidden= creaNodo("input");
        inputhidden.setAttribute("type", "hidden");
        inputhidden.setAttribute("name", "creaCategoria");
        inputhidden.setAttribute("value", "OK");

    formAnadeCateg.appendChild(inputNombreCateg);
    formAnadeCateg.appendChild(br);
    formAnadeCateg.appendChild(labelFoto);
    formAnadeCateg.appendChild(br2);
    formAnadeCateg.appendChild(inputFotoCateg);
    formAnadeCateg.appendChild(br3);
    formAnadeCateg.appendChild(labelHabilitado);
    formAnadeCateg.appendChild(labelSi);
    formAnadeCateg.appendChild(inputSI);
    formAnadeCateg.appendChild(labelNo);
    formAnadeCateg.appendChild(inputNO);
    formAnadeCateg.appendChild(br4);
    formAnadeCateg.appendChild(labelesBebida);
    formAnadeCateg.appendChild(labelSiB);
    formAnadeCateg.appendChild(inputSIB);
    formAnadeCateg.appendChild(labelNoB);
    formAnadeCateg.appendChild(inputNOB);
    formAnadeCateg.appendChild(br6);

    formAnadeCateg.appendChild(inputhidden);

    formAnadeCateg.appendChild(inputSubmit);

    divAnadeCategoria.appendChild(formAnadeCateg);

    divAux.appendChild(divAnadeComida);
    divAux.appendChild(divAnadeCategoria);
    divAnadeComida.appendChild(select);  
    div.appendChild(divAux);  
}

/**
 * Función que dibuja el formulario o muestra error en función 
 * si se puede o no añadir otra comida de la categoría seleccionada
 * @param {*} data -> Datos procedentes del servidor
 * @param {*} codCateg -> Código de la categoria seleccionada
 */
function formAddComida(){

    let divAnadeComida= document.getElementById("divAnadeComida");

    while(divAnadeComida.childNodes.length!=1){
        divAnadeComida.childNodes[1].remove();
    }

    if(this.selectedIndex==0)
        return;
   
    let br1= creaNodo("br");
    let br12= creaNodo("br");

    let inuputComida= creaNodo("input");
        inuputComida.setAttribute("type", "text");
        inuputComida.setAttribute("id", "inputNomComida");
        inuputComida.setAttribute("placeholder", "Nombre de la comida");
    
    let pDescrip= creaNodo("p", "Ingredientes: ");

    let textArea= creaNodo("textArea");
        textArea.setAttribute("cols", 50);
        textArea.setAttribute("rows", 5);
        textArea.setAttribute("id", "textAreaIngredientes");

    let pCantidad= creaNodo("p", "Cantidad: ");    
    let cantidad= creaNodo("input");
        cantidad.setAttribute("type", "number");
        cantidad.setAttribute("step", 1);
        cantidad.setAttribute("id", "inputCantComida");
    
    let pPrecio= creaNodo("p", "Precio: "); 
    let precio= creaNodo("input");
        precio.setAttribute("type", "number");
        precio.setAttribute("step", 0.1);
        precio.setAttribute("id", "inputPrecioComida");
    
    let br4= creaNodo("br");

    // let labelesBebida= creaNodo("label", "Es bebida: ");

    // let br5= creaNodo("br");
    // let labelSiB= creaNodo("label", "SÍ");
    // let inputSIB= creaNodo("input");
    //     inputSIB.setAttribute("type", "radio");
    //     inputSIB.setAttribute("name", "bebida");
    //     inputSIB.setAttribute("id", "esBebidaSI");
    //     inputSIB.setAttribute("value", "1");

    // let labelNoB= creaNodo("label", "NO");
    // let inputNOB= creaNodo("input");
    //     inputNOB.setAttribute("type", "radio");
    //     inputNOB.setAttribute("name", "bebida");
    //     inputNOB.setAttribute("id", "esBebidaNO");
    //     inputNOB.setAttribute("value", "0");
    
    let pHabilitado= creaNodo("p", "Habilitado:");
    let labelSI= creaNodo("label", "SÍ");
    let radioSi= creaNodo("input");
        radioSi.setAttribute("type", "radio");
        radioSi.setAttribute("name", "habilitadoComida");
        radioSi.setAttribute("checked", true);
        radioSi.setAttribute("id", "radioAddSi");

    let labelNO= creaNodo("label", "NO");
    let radioNo= creaNodo("input");
        radioNo.setAttribute("type", "radio");
        radioNo.setAttribute("name", "habilitadoComida");
        radioNo.setAttribute("id", "radioAddNo");

    let labelIVA= creaNodo("p", "Introduzca el % de IVA:");
    let inputIVA= creaNodo("input");
        inputIVA.setAttribute("type", "number");
        inputIVA.setAttribute("id", "IVA");
    let brIVA= creaNodo("br");

    let br2= creaNodo("br");
    let add= creaNodo("button", "Añadir");
        add.setAttribute("id", "bAddComida2");
        add.addEventListener("click", addComidaBD);
    
    divAnadeComida.appendChild(br1);
    divAnadeComida.appendChild(br12);
    divAnadeComida.appendChild(inuputComida);
    divAnadeComida.appendChild(pDescrip);
    divAnadeComida.appendChild(textArea);
    divAnadeComida.appendChild(pCantidad);
    divAnadeComida.appendChild(cantidad);
    divAnadeComida.appendChild(pPrecio);
    divAnadeComida.appendChild(precio);
    divAnadeComida.appendChild(br4);
    // divAnadeComida.appendChild(labelesBebida);
    // divAnadeComida.appendChild(br5);
    // divAnadeComida.appendChild(labelSiB);
    // divAnadeComida.appendChild(inputSIB);
    // divAnadeComida.appendChild(labelNoB);
    // divAnadeComida.appendChild(inputNOB);
    divAnadeComida.appendChild(pHabilitado);
    divAnadeComida.appendChild(labelSI);
    divAnadeComida.appendChild(radioSi);
    divAnadeComida.appendChild(labelNO);
    divAnadeComida.appendChild(radioNo);
    divAnadeComida.appendChild(br2);
    divAnadeComida.appendChild(labelIVA);    
    divAnadeComida.appendChild(inputIVA);
    divAnadeComida.appendChild(brIVA);
    divAnadeComida.appendChild(add);


    // div.appendChild(divAnadeComida);

}

/**
 * Función que se ejecuta al pulsar "Añadir" del formulario para añadir otra comida
 * @returns -> No devuelve nada, es solo para que se salga de la función
 */
function addComidaBD(){

    let codCateg= parseInt(document.getElementById("selectAddComida").selectedOptions[0].value);
    let nomComida= document.getElementById("inputNomComida").value;
    let ingredientes= document.getElementById("textAreaIngredientes").value;
    let cantidad= parseInt(document.getElementById("inputCantComida").value);
    let precio= parseFloat(document.getElementById("inputPrecioComida").value);
    precio= parseFloat(precio.toFixed(2));
    let habilitado;
    let iva= parseInt(document.getElementById("IVA").value);
    if(document.getElementById("radioAddSi").checked)
        habilitado=true;
    else
        habilitado=false;

    if(nomComida=="" || isNaN(cantidad) || isNaN(precio) || isNaN(iva)){
        alert("Rellene todos los campos por favor");
        return;
    }

    let obj= {
            "cod_categoria": codCateg,
            "nom_comida": nomComida,
            "ingredientes": ingredientes,
            "cantidad": cantidad,
            "precio": precio,
            "habilitado": habilitado,
            "iva": iva
    };
    obj= JSON.stringify(obj);

    fetch("../server/php/administrador/administrador.php",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify("añadirComida-"+obj)
    })
    .then(function(resp){
        if(resp.ok)
            resp.json()
                .then(function(data){
                    if(data=="ok"){
                        let nodos= document.getElementById("divDatosCarta").childNodes;
                        while(nodos.length!=0)
                            nodos[0].remove();
                        
                        alert("Comida añadida correctamente");
                    }
                    else
                        alert("No se ha podido añadir la comida");
                })
                .catch(function(er){
                    console.error("Error al recibir la confiramción de añadir nueva comida: " + er);
                })
    })
    .catch(function(er){
        console.error("Error al solicitar añadir nueva comida: " + er);
    })
}



/**
 * Función que muestra la información de la línea de la tabla pulsada
 */
function infoProducto(){

    let filaValida= this.attributes[0].value;
    let botonPulsado= sessionStorage.getItem("bPulsadoCarta");
    let idFila= this.id;

    let div= creaNodo("div");
        div.setAttribute("id", "divInfoFilaCarta");   

    let divRemove= document.getElementById("divInfoFilaCarta");

    if(divRemove!=null)
        divRemove.remove();

    document.getElementById("divDatosCarta").appendChild(div);
    

    if(filaValida==="true"){ //se ha pulsado sobre una fila (tr) válida

        switch(botonPulsado){
            case "bCambiaPrecio": formCambiaPrecio(idFila); break;
            case "bCambiaCarta": formCambiaCarta(idFila); break;
            case "bCambiaStock": formCambiaStock(idFila); break;
        }
    }
}

/**
 * Función que muestra un formulario para cambiar el precio
 * @param {*} idFila -> Id de la fila que se pulsó
 */
function formCambiaPrecio(idFila){

    let div= document.getElementById("divInfoFilaCarta");

    let trPulsada= document.getElementById(idFila);

    let td1= trPulsada.childNodes[0].textContent;
    let td2= trPulsada.childNodes[1].textContent;
    let td3= trPulsada.childNodes[2].textContent;
    let td4= trPulsada.childNodes[3].textContent;


    let label1= creaNodo("label", "Categoria: ");
    let input1= creaNodo("input");
        input1.setAttribute("type", "text");
        input1.setAttribute("disabled", true);
        input1.setAttribute("value", td1);
    
    
    let br1= creaNodo("br");

    let label2= creaNodo("label", "Comida: ");
    let input2= creaNodo("input");
        input2.setAttribute("type", "text");
        input2.setAttribute("disabled", true);
        input2.setAttribute("value", td2);

    let br2= creaNodo("br");

    let label3= creaNodo("label", "Precio: ");
    let input3= creaNodo("input");
        input3.setAttribute("type", "number");
        input3.setAttribute("step", 0.1);
        input3.setAttribute("value", td3);

    let br21= creaNodo("br");

    let label4= creaNodo("label", "IVA: ");
    let input4= creaNodo("input");
        input4.setAttribute("type", "number");
        input4.setAttribute("step", 1);
        input4.setAttribute("value", td4);
    

    let br3= creaNodo("br");
    let boton= creaNodo("button", "Modificar");
        boton.addEventListener("click", modificaCarta);
        boton.setAttribute("fila", idFila);


    div.appendChild(label1);
    div.appendChild(input1);
    div.appendChild(br1);
    div.appendChild(label2);
    div.appendChild(input2);
    div.appendChild(br2);
    div.appendChild(label4);
    div.appendChild(input4);
    div.appendChild(br21);
    div.appendChild(label3);
    div.appendChild(input3);
    div.appendChild(br3);
    div.appendChild(boton);
}


/**
 * Función que muestra un formulario para cambiar la carta
 * @param {*} idFila -> Id de la fila que se pulsó
 */
function formCambiaCarta(idFila){

    let datos= JSON.parse(sessionStorage.getItem("datosTablaCarta"));

    let div= document.getElementById("divInfoFilaCarta");

    let trPulsada= document.getElementById(idFila);

    let td1= trPulsada.childNodes[0].textContent;
    let td2= trPulsada.childNodes[1].textContent;
    let td3= trPulsada.childNodes[2].textContent;

    let descripcion="";
    let sw=true;
    let categoriaElegida="";
    for(let i=0; i<datos.length && sw; i++){
        if(td1==datos[i].nombre_categoria && td2==datos[i].nombre_comida){
            descripcion=datos[i].descripcion;
            sw=false;
            categoriaElegida=datos[i].nombre_categoria;
        }
    }

    //Aquí debería poner un select con todas las categorias y que esté marcado la actual

    let label1= creaNodo("label", "Categoria: ");
    
    let selectCateg= creaNodo("select");
        selectCateg.setAttribute("id", "selectModComida");

    let arrayCategorias= JSON.parse(sessionStorage.getItem("enlacesMenu"));

    for(let i=0; i<arrayCategorias.length; i++){
        let opt= creaNodo("option", arrayCategorias[i].nombre);
            opt.value= arrayCategorias[i].cod_categoria;
        if(categoriaElegida == arrayCategorias[i].nombre)
            opt.selected=true;        
        selectCateg.appendChild(opt);
    }

   
    let br1= creaNodo("br");

    let label2= creaNodo("label", "Comida: ");
    let input2= creaNodo("input");
        input2.setAttribute("type", "text");
        input2.setAttribute("value", td2);
        input2.setAttribute("id", "nomModComida");

    let br2= creaNodo("br");

    let label3= creaNodo("label", "Ofertada: ");
    let labelSI= creaNodo("label", "SÍ");
    let input31= creaNodo("input");
        input31.setAttribute("type", "radio");
        input31.setAttribute("name", "ofertada");
        input31.setAttribute("id", "ofertadaSI");

    let labelNO= creaNodo("label", "NO");
    let input32= creaNodo("input");
        input32.setAttribute("type", "radio");
        input32.setAttribute("name", "ofertada");
        input32.setAttribute("id", "ofertadaNO");

    if(td3=="SÍ")
        input31.setAttribute("checked", true);
    else
        input32.setAttribute("checked", true);
    
    let br3= creaNodo("br");

    let lable4= creaNodo("label", "Descripción: ");
    let br4= creaNodo("br");
    let textArea= creaNodo("textarea", descripcion);
        textArea.setAttribute("cols", 50);
        textArea.setAttribute("rows", 5);
        textArea.setAttribute("id", "textAreaModComida")

    let br5= creaNodo("br");

    let boton= creaNodo("button", "Modificar");
        boton.addEventListener("click", modificaCarta);
        boton.setAttribute("fila", idFila);
    
    div.appendChild(label1);
    div.appendChild(selectCateg);
    div.appendChild(br1);
    div.appendChild(label2);
    div.appendChild(input2);
    div.appendChild(br2);
    div.appendChild(label3);
    div.appendChild(labelSI);
    div.appendChild(input31);
    div.appendChild(labelNO);
    div.appendChild(input32);    
    div.appendChild(br3);
    div.appendChild(lable4);
    div.appendChild(br4);
    div.appendChild(textArea);
    div.appendChild(br5);

    div.appendChild(boton);
}

/**
 Función que muestra un formulario para cambiar el stock
 * @param {*} idFila -> Id de la fila que se pulsó
 */
function formCambiaStock(idFila){

    let div= document.getElementById("divInfoFilaCarta");

    let trPulsada= document.getElementById(idFila);

    let td1= trPulsada.childNodes[0].textContent;
    let td2= trPulsada.childNodes[1].textContent;
    let td3= trPulsada.childNodes[2].textContent;


    let label1= creaNodo("label", "Categoria: ");
    let input1= creaNodo("input");
        input1.setAttribute("type", "text");
        input1.setAttribute("disabled", true);
        input1.setAttribute("value", td1);
    
    
    let br1= creaNodo("br");

    let label2= creaNodo("label", "Comida: ");
    let input2= creaNodo("input");
        input2.setAttribute("type", "text");
        input2.setAttribute("disabled", true);
        input2.setAttribute("value", td2);

    let br2= creaNodo("br");

    let label3= creaNodo("label", "Stock: ");
    let input3= creaNodo("input");
        input3.setAttribute("type", "number");
        input3.setAttribute("step", 1);
        input3.setAttribute("value", td3);

    let br3= creaNodo("br");
    let boton= creaNodo("button", "Modificar");
        boton.addEventListener("click", modificaCarta);
        boton.setAttribute("fila", idFila);
    
    div.appendChild(label1);
    div.appendChild(input1);
    div.appendChild(br1);
    div.appendChild(label2);
    div.appendChild(input2);
    div.appendChild(br2);
    div.appendChild(label3);
    div.appendChild(input3);
    div.appendChild(br3);
    div.appendChild(boton);
}


/**
 * Función que distribuje y ejecuta fetch en función de que se va a modificar
 */
function modificaCarta(){

    let idBotonPulsado= sessionStorage.getItem("bPulsadoCarta");
    let idfila= this.attributes[0].value;

    sessionStorage.setItem("filaPulsada", idfila);

    switch(idBotonPulsado){
        case "bCambiaPrecio": fetchPrecio(idfila); break;
        case "bCambiaCarta": fetchCarta(idfila); break;
        case "bCambiaStock": fetchStock(idfila); break;
    }    
}


/**
 * Función que manda al servidor el nuevo precio de la comida seleccionada
 * @param {*} idFila -> Id de la fila pulsada
 */
function fetchPrecio(idFila){

    let cod_comida= parseInt(document.getElementById(idFila).childNodes[1].attributes[0].value);
    let newPrecio= parseFloat(document.querySelector("#divInfoFilaCarta > input:nth-of-type(4)").value);
    let newIVA= parseInt(document.querySelector("#divInfoFilaCarta > input:nth-of-type(3)").value)


    let obj= {
                "cod_comida": cod_comida,
                "newPrecio": newPrecio,
                "newIVA": newIVA
    };

    obj= JSON.stringify(obj);

    fetch("../server/php/administrador/administrador.php", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify("modificaCarta*precio*"+obj)
    })
    .then(function(resp){
        if(resp.ok)
            resp.json()
                .then(function(data){
                    if(data=="ok"){                       
                        BDActualizada();

                        document.getElementById(idFila).style.backgroundColor= "#d7ffb4";

                    }
                    else
                        alert("No se pudo actualizar el precio");

                })
                .catch(function(er){
                    console.error("Error al recibir la confirmación de cambio de precio: " + er);
                })
    })
    .catch(function(er){
        console.error("Error al solicitar cambiar precio: " + er);
    })
}

/**
 * Función que manda al servidor la nueva info de la carta
 * @param {*} idFila -> Id de la fila pulsada
 */
function fetchCarta(idFila){

    //Obtengo los datos necesarios para hacer el update
    let cod_comida= parseInt(document.getElementById(idFila).childNodes[1].attributes[0].value);
    let descripcion= document.getElementById("textAreaModComida").textContent;
    let cod_categoria= parseInt(document.getElementById("selectModComida").value);
    let nomComida= document.getElementById("nomModComida").value;
    let ofertada;
        if(document.getElementById("ofertadaSI").checked)
            ofertada="SÍ";
        else
            ofertada="NO";

    let obj={
                "cod_categoria": cod_categoria,
                "nomComida": nomComida,
                "cod_comida": cod_comida,
                "descripcion": descripcion,
                "ofertada": ofertada
    };

    obj= JSON.stringify(obj);

    fetch("../server/php/administrador/administrador.php", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify("modificaCarta*carta*"+obj)
    })
    .then(function(resp){
        if(resp.ok)
            resp.json()
                .then(function(data){
                    if(data=="ok"){
                        BDActualizada();
                        document.getElementById(idFila).style.backgroundColor= "#d7ffb4";
                    }                        
                    else
                        alert("No se pudo actualizar la carta");
                })
                .catch(function(er){
                    console.error("Error al recibir la confirmación de cambio de precio: " + er);
                })
    })
    .catch(function(er){
        console.error("Error al solicitar cambiar precio: " + er);
    })


}

/**
 * Función que manda al servidor el nuevo stock de la comida seleccionada
 * @param {*} idFila -> Id de la fila pulsada
 */
function fetchStock(idFila){

    let cod_comida= parseInt(document.getElementById(idFila).childNodes[1].attributes[0].value);
    let stock= parseInt(document.querySelector("#divInfoFilaCarta input[type=number]").value);

    let obj= {
                "cod_comida": cod_comida,
                "stock": stock
    };

    obj= JSON.stringify(obj);


    fetch("../server/php/administrador/administrador.php", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify("modificaCarta*stock*"+obj)
    })
    .then(function(resp){
        if(resp.ok)
            resp.json()
                .then(function(data){
                    if(data=="ok"){
                        BDActualizada();
                        document.getElementById(idFila).style.backgroundColor= "#d7ffb4";
                    }
                    else
                        alert("No se pudo actualizar el stock");
                })
                .catch(function(er){
                    console.error("Error al recibir la confirmación de cambio de precio: " + er);
                })
    })
    .catch(function(er){
        console.error("Error al solicitar cambiar precio: " + er);
    })
}


function formSubmit(event) {

    event.preventDefault();
    let url = "../server/php/administrador/administrador.php";

    let datos= new FormData(event.target);

    fetch(url, {
        method:"POST",
        body: datos
    })
    .then(function(resp){
        if(resp.ok)
            resp.json()
                .then(function(data){
                    let alerta="";
                    if(data.categoria!=undefined)
                        alerta+= data.categoria[0] +"\n";
                    
                    if(data.fotoCateg!=undefined)
                        alerta+= data.fotoCateg[0] + "\n";
                                         
                    if(data.existe!=undefined)
                        alerta+= data.existe[0] + "\n";
                    
                    if(data.errorSubida!=undefined)
                        alerta+= data.errorSubida[0] + "\n";
                    
                    if(data.errorTamano!=undefined)
                        alerta+= data.errorTamano[0] + "\n";
                    
                    if(data.errorTipo!=undefined)
                        alerta+= data.errorTipo[0] + "\n";
                    
                    if(alerta!="")
                        alert(alerta);
                    else{
                        alert("Categoria creada correctamente");
                        document.getElementById("nombreCategoria").value="";
                        document.getElementById("fotoCategoria").value="";
                        document.getElementById("habilitadoSI").checked=true;
                        document.getElementById("esBebidaSI").checked=true;

                        actualizaSelectAnadeComida();
                    }                        
                })
                .catch(function(er){
                    console.error(er);
                })
    })
    .catch(function(er){
        console.error("Error al conectar con el servidor para crear la categoria: " + er);
    })

}


function actualizaSelectAnadeComida(){

    let select= document.getElementById("selectAddComida");

    while(select.childNodes.length != 1) //elimino todas menos la "Seleccina una categoria"
        select.childNodes[1].remove();

        fetch("../server/php/administrador/administrador.php",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify("selectAnadeComida")
        })
        .then(function(resp){
            if(resp.ok)
                resp.json()
                    .then(function(datos){
                        for(let dato of datos){
                            let opt= creaNodo("option", dato.nombre_categoria);
                                opt.setAttribute("value", dato.cod_categoria);
                            select.appendChild(opt);
                        }
                        
                    })
                    .catch(function(er){
                        console.error("Error al recibir los datos de las categorias y comidas: " + er);
                    })
        })
        .catch(function(er){
            console.error("Error al solicitar los datos de las categorias y comidas: " + er);
        })
}



function BDActualizada(){

    document.getElementById("divInfoFilaCarta").remove();

    fetch("../server/php/administrador/administrador.php",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify("cartaAdmin")
    })
    .then(function(resp){
        if(resp.ok)
            resp.json()
                .then(function(datos){
                    rellenaTablaCarta(datos);
                })
                .catch(function(er){
                    console.error("Error al recibir los datos de las categorias y comidas: " + er);
                })
    })
    .catch(function(er){
        console.error("Error al solicitar los datos de las categorias y comidas: " + er);
    })
}