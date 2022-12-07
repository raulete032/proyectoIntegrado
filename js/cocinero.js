import {creaNodo} from "./libreria.js";

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
                        document.getElementsByTagName("body")[0].style.display="grid";
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

setInterval(solicitaPlatosEnCola, 1000); //Aquí se rellena el div de la derecha


/**
 * Función que solicita los platos que están "En cola"
 */
function solicitaPlatosEnCola(){

    fetch("../server/php/cocinero/cocinero.php", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify("platosEnCola")
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){
                    if(data.length>0)
                        rellenaPlatosEnCola(data);
                })
                .catch(function(er){
                    console.error("Error al recibir los datos de los platos en cola: " + er);
                })
        }
    })
    .catch(function(er){
        console.error("Error al solicitar los platos en cola: " + er);
    })
}

/**
 * Función que escribe en el HTML los datos de los platos "En cola"
 * @param {*} data -> Datos procedentes del servidor
 */
function rellenaPlatosEnCola(data){

    let divPedidos= document.getElementsByClassName("pedidos")[0]; //obtengo el div que contiene todos los pedidos en cola

    let divsLinea= divPedidos.getElementsByClassName("linea"); //obtengo todos los divs linea

    while(divsLinea.length>0)
        divsLinea[0].remove(); //borro todos los divs

    //En este punto tengo divPedidos vacío

    for(let i=0; i<data.length; i++){

        let divLinea= creaNodo("div");
        divLinea.setAttribute("class", "linea");

            let divMesa= creaNodo("div", data[i].nombre_mesa);
            let divNumPlatos= creaNodo("div", "Número de platos: " + data[i].num_platos);
            let boton= creaNodo("button", "Cocinar");
                boton.setAttribute("id", data[i].cod_total_pedido);
                boton.addEventListener("click", cocinando);
        
        divLinea.appendChild(divMesa);
        divLinea.appendChild(divNumPlatos);
        divLinea.appendChild(boton);

        divPedidos.appendChild(divLinea);
    }
}


/**
 * Función que cambia el estado del pedido "En cola" a "Cocinando".
 * Luego se escribe ese pedido en su sección correspondiente
 */
function cocinando(){

    let cod_total_pedido= this.id; //obtengo el id del boton pulsado (es el cod_total_pedido)
    this.parentNode.remove();
    let divPedidos= document.getElementById("platosEnEspera");
    let lineasLength= divPedidos.getElementsByClassName("lineaCocinando").length;

    fetch("../server/php/cocinero/cocinero.php", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify("cocinando:"+cod_total_pedido+":"+lineasLength)
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){
                    rellenaLineasCocinar(data);
                })
                .catch(function(er){
                    console.error("Error al recibir los datos de las líneas para cocinar: " + er);
                })
        }
    })
    .catch(function(er){
        console.error("Error al solicitar las líneas de pedido para cocinar: " + er);
    })
}



/**
 * Función que escribe los datos del plato que se está "Cocinando"
 * @param {*} data -> Datos procedentes del servidor
 */
function rellenaLineasCocinar(data){    

    let divPlatosEnEspera = document.getElementById("platosEnEspera");

    let divsLineaCocinando= divPlatosEnEspera.getElementsByClassName("lineaCocinando");

    let botonesListos= divPlatosEnEspera.getElementsByClassName("pedidoListo");

    if((botonesListos.length != divsLineaCocinando.length) || data =="NO"){
        alert("No has terminado de cocinar el pedido");
    }
    else{ //son iguales, luego puedo eliminar y añadir los siguientes pedidos
        while(divsLineaCocinando.length>0)
            divsLineaCocinando[0].remove();
    
        for(let i=0; i<data.length; i++){

            let div= creaNodo("div");
                div.setAttribute("class", "lineaCocinando");
            
                let p1= creaNodo("p", (i+1));
                let p2= creaNodo("p", "Pedido nº " + data[i].cod_linea_pedido);
                let p3= creaNodo("p", "Unidades: " + data[i].unidades);
                let boton= creaNodo("button");
                boton.addEventListener("click", cocinar);
                boton.setAttribute("id", data[i].cod_linea_pedido);
                let img= creaNodo("img");
                    img.setAttribute("src", "../img/cocinero/sarten.png");
                    boton.appendChild(img);
                
                div.appendChild(p1);
                div.appendChild(p2);
                div.appendChild(p3);
                div.appendChild(boton);
            
            divPlatosEnEspera.appendChild(div);
        }    
    }    
}

/**
 * Función que se ejecuta al pulsar el botón de la sartén
 */
function cocinar(){
    //Si llega aquí es que se pulsó un botón con sartén

    let divPlatosEnEspera= document.getElementById("platosEnEspera");

    for(let i=1; i<divPlatosEnEspera.childNodes.length; i++){
        divPlatosEnEspera.childNodes[i].style.backgroundColor="transparent"
    }

    let linea_pedido= this.id; //obtengo el id del botón puslado (sartén). Es el cod_linea_pedido
    this.style.backgroundColor="greenyellow";

    let boton= document.getElementById(linea_pedido);

    let divsLineaCocinando= boton.parentNode;
    divsLineaCocinando.style.backgroundColor="rgb(181, 245, 224)";


    fetch("../server/php/cocinero/cocinero.php", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify("cocinar:"+this.id)
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){
                    rellenaPlatoACocinar(data);
                })
                .catch(function(er){
                    console.error("Error al recibir los datos del plato a cocinar: " + er);
                })
        }
    })
    .catch(function(er){
        console.error("Error al solicitar la info del plato a cocinar: " + er);
    })
}


/**
 * Función que escribe en el HTML el plato que se va a cocinar
 * @param {*} data -> Datos del plato que se va a cocinar
 */
function rellenaPlatoACocinar(data){

    let divPlatoCocinando= document.getElementById("platoCocinando");

    //Ante debo eliminar los nodos que hubiera

    let nodos= divPlatoCocinando.childNodes;
    while(nodos.length!=0)
        nodos[0].remove();

    let p1= creaNodo("p", "Categoria: " + data.categoria);
    let p2= creaNodo("p", "Plato: " + data.plato);
    let p3= creaNodo("p", "Ingredientes: " + data.descripcion);
    let p4= creaNodo("p", "Observaciones: " + data.observaciones);

    let label= creaNodo("label", "Preparando: ");
    let check= creaNodo("input");
        check.setAttribute("type", "checkbox");
        check.setAttribute("checked", true);
        check.addEventListener("change", preparando);
    let boton= creaNodo("button", "Listo!!");
        boton.setAttribute("id", "listo:"+data.cod_linea);
        boton.addEventListener("click", listo);
        boton.style.display="none";
    

    divPlatoCocinando.appendChild(p1);
    divPlatoCocinando.appendChild(p2);
    divPlatoCocinando.appendChild(p3);
    divPlatoCocinando.appendChild(p4);
    divPlatoCocinando.appendChild(label);
    divPlatoCocinando.appendChild(check);
    divPlatoCocinando.appendChild(boton);
}

/**
 * Función que muestra/oculta el botón "Listo!!"
 */
function preparando(){
    
    let check= this.checked;
    let boton= this.nextSibling;
    if(!check){//es falso, luego ya NO se está preparando, puede aparecer el botón Listo!!
        boton= this.nextSibling;
        boton.style.display="initial";
    }
    else{
        boton= this.nextSibling;
        boton.style.display="none";
    }
}

/**
 * Función que cambia el estado de un plato a "Listo"
 */
function listo(){
    
    let id= this.id; //obtengo el id del botón listo (listo:cod_linea)
    let cod_linea= parseInt(id.split(":")[1]);

    fetch("../server/php/cocinero/cocinero.php",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify("listo:"+cod_linea)
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){
                    if(data=="incorrecto")
                        alert("Pedido NO listo");
                    else{
                        let div= document.getElementById("platoCocinando");
                        let nodos= div.childNodes;
                        while(nodos.length!=0)
                            nodos[0].remove();
                    }
                })
                .catch(function(er){
                    console.error("Error al recibir la confirmación cambio 'listo' pedido " + cod_linea + ": " + er);
                })
        }
    })
    .catch(function(er){
        console.error("Error al solicitar cambio 'listo' en pedido " + cod_linea + ":" + er);
    })
    document.getElementById(cod_linea).parentNode.remove(); //elimino la línea
}