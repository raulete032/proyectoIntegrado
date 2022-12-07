
import {compruebaCookie, creaCookie, creaNodo, expiraEn} from "./libreria.js";

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

solicitaMesas(); //pido los datos de la mesa y me carga el Select

solicitaBotonesCategorias(); //pido los datos de las categorías

/**
 * Asigno eventos a las pestañas
 */
document.getElementById("tabCarta").addEventListener("click", cambiaPestanya);
document.getElementById("tabPedido").addEventListener("click", cambiaPestanya);


/**
 * Función que se encarga de cambiar las pestañas
 */
function cambiaPestanya(){

    let id= this.id;
    
    if(id=="tabCarta"){ //se ha pulsado Carta, luego oculto los pedidos

        let sw= document.getElementById("cerrarConsulta").style.display; //obtengo el style del botón Cerrar consulta

        if(sw=="initial"){ //Si el botón está "initial", es que se ve y por tanto NO se ha cerrado aún la consulta
            alert("Cierra la consulta");
            return;
        }


        let tabla= document.getElementById("tablaPedido")
        if(tabla.getElementsByTagName("th")[3] != undefined){ //si hay 4 columnas es que se está mostrando la tabla consulta, luego aún no se ha cerrado
            alert("Cierra la consulta");
        }
        else{ //la tabla que había era de Pedido, luego muestro los botones de nuevo
            document.getElementById("listadoPedido").style.display="none";
            document.getElementById("botonesComida").style.display="grid";
            document.getElementsByClassName("tabs")[0].style.background="linear-gradient(to left, #f0ecec 0%, #f0ecec 50%, #c1d7ec 50%, #c1d7ec 100%)";
            document.getElementsByClassName("tabs")[0].style.borderTopLeftRadius = "10px";
            document.getElementsByClassName("tabs")[0].style.borderBottomLeftRadius = "10px";
            document.getElementsByClassName("tabs")[0].style.borderTopRightRadius = "0px";
            document.getElementsByClassName("tabs")[0].style.borderBottomRightRadius = "0px";
            solicitaBotonesCategorias();
        }
    }
    else{ //se ha pulsado Pedido, luego oculto los botones de la carta
        document.getElementById("botonesComida").style.display="none";
        document.getElementById("listadoPedido").style.display="initial";
        document.getElementsByClassName("tabs")[0].style.background="linear-gradient(to right, #f0ecec 0%, #f0ecec 50%, #c1d7ec 50%, #c1d7ec 100%)";
        document.getElementsByClassName("tabs")[0].style.borderTopLeftRadius = "0px";
        document.getElementsByClassName("tabs")[0].style.borderBottomLeftRadius = "0px";
        document.getElementsByClassName("tabs")[0].style.borderTopRightRadius = "10px";
        document.getElementsByClassName("tabs")[0].style.borderBottomRightRadius = "10px";
    }    
}



/**
 * Función que solicita los datos de las mesas
 */
function solicitaMesas(){

    let datos= sessionStorage.getItem("mesas"); //compruebo si los datos los tengo en sessionStorage

    if(datos==null){ //NO están los datos

        fetch("../server/php/camarero/camarero.php", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify("datosMesas")
        })
        .then(function(resp){
            if(resp.ok){
                resp.json()
                    .then(function(data){ //me llegan los datos de las mesas
                        rellenaMesas(data);
                        let datos= JSON.stringify(data);
                        sessionStorage.setItem("mesas", datos);
                    })
                    .catch(function(er){
                        console.error("Error al recibir los datos de las mesas: " + er);
                    })
            }
        })
        .catch(function(er){
            console.error("Error al solicitar los datos de las mesas: " + er);
        })
    }
    else{ //los datos si están en sessionStorage
        let data= JSON.parse(datos);
        rellenaMesas(data);
    }
}

/**
 * Función que rellena el select con los datos que llegan del servidor
 */
function rellenaMesas(data){

    let select= document.getElementById("mesas");
    let firstOpt= creaNodo("option", "Selecciona una mesa");
    select.appendChild(firstOpt);
    for(let i=0; i<data.length; i++){
        let opt= creaNodo("option", data[i].nombre);
        opt.setAttribute("value", data[i].cod_mesa);
        select.appendChild(opt);
    }
}

/**
 * Función que solicita los botones de las Categorias
 */
function solicitaBotonesCategorias(){

    let datos= sessionStorage.getItem("botonesCategorias"); //compruebo si están en el sessionStorage

    if(datos == null){
        fetch("../server/php/camarero/camarero.php",{
            method:"POST",
            headers:{"Content-Type" : "application/json"},
            body: JSON.stringify("botonesCategorias")
        })
        .then(function(resp){
            if(resp.ok){
                resp.json()
                    .then(function(data){
                        cargaBotonesCategorias(data);
                        let datos= JSON.stringify(data);
                        sessionStorage.setItem("botonesCategorias", datos); //guardo los datos en sessionStorage
                    })
                    .catch(function(er){
                        console.error("Error al recibir los datos de los botones de las categorias: " + er);
                    })
            }
        })
        .catch(function(er){
            console.error("Error al solicitar los datos de los botones de las categorias: " + er);
        })
    }
    else{ //estaban en sessionStorage
        let data= JSON.parse(datos);
        cargaBotonesCategorias(data);
    }    
}



/**
 * Función que carga los botones en el html
 * @param {*} data -> Los datos que llegan de la base de datos
 */
function cargaBotonesCategorias(data){

    let divBotonesComida= document.getElementById("botonesComida"); //obtengo el div donde irá todo

    let botones= divBotonesComida.getElementsByTagName("button");

    if(botones.length!=0){
        while(botones.length!=0) //elimino todos menos el Atrás
            botones[0].remove();
    }   

    let p= creaNodo("p", "Categorias: "); //creo  el nodo del título
    p.setAttribute("id", "titulo");
    divBotonesComida.appendChild(p);

    //Creo los botones
    for(let i=0; i<data.length; i++){
        let boton= creaNodo("button", data[i].nombre_categoria);
        boton.setAttribute("value", data[i].cod_categoria);
        boton.addEventListener("click", solicitaBotonesComida);
        divBotonesComida.appendChild(boton);
    }
    divBotonesComida.scrollTop = 0;
}


/**
 * Función que solicita los botones con los nombres de las comidas
 * en función del botón de la categoría seleccionada
 */
function solicitaBotonesComida(){

    let selectMesas= document.getElementById("mesas").value;

    if(selectMesas=="Selecciona una mesa"){ //no seleccionó mesa
        alert("Selecciona antes una mesa");
    }
    else{
        let cod_categoria= this.value;

        let datos= sessionStorage.getItem("botonesComida:"+cod_categoria); //compruebo si está en sessionStorage

        if(datos==null){
            fetch("../server/php/camarero/camarero.php",{
                method:"POST",
                headers:{"Content-Type" : "application/json"},
                body: JSON.stringify("botonesComida:"+cod_categoria) //mando al servidor el código de la categoria
            })
            .then(function(resp){
                if(resp.ok){
                    resp.json()
                        .then(function(data){ //me llegan los datos del servidor
                            cargaBotonesComida(data, cod_categoria);
                            let datos= JSON.stringify(data);
                            sessionStorage.setItem("botonesComida:"+cod_categoria, datos); //guardo en sessionStorage
                        })
                        .catch(function(er){
                            console.error("Error al recibir los datos de los botones de las categorias: " + er);
                        })
                }
            })
            .catch(function(er){
                console.error("Error al solicitar los datos de los botones de las categorias: " + er);
            })
        }
        else{ //ya estaba en sessionStorage
            let data= JSON.parse(datos);
            cargaBotonesComida(data, cod_categoria);
        }
    }    
}


/**
 * Función que muestra los botones de las comidas.
 * @param data -> Array con las comidas de la categoría pulsada
 * @param cod_categoria -> Código de la categoría pulsada
 */
function cargaBotonesComida(data, cod_categoria){

    let divBotonesComida= document.getElementById("botonesComida"); //div contenedor de los botones

    document.getElementById("titulo").remove(); //elimino el título (texto que pone "Categorias: ")
    
    let categorias= JSON.parse(sessionStorage.getItem("botonesCategorias")); //obtengo las categorías de sessionStorage (sé que están, ya que antes de llegar aquí las he guardado)

    let nombre_categoria="";
    for(let i=0; i<categorias.length; i++){ //recorro las categorías solo para obtener su nombre
        if(categorias[i].cod_categoria==cod_categoria)
            nombre_categoria=categorias[i].nombre_categoria;
    }

    let p= creaNodo("p", nombre_categoria + ": "); //creo el nodo del título con el nombre de la categoría
    p.setAttribute("id", "titulo");
    divBotonesComida.appendChild(p);

    let botones= divBotonesComida.getElementsByTagName("button"); //obtengo todos los botones

    while(botones.length!=0){ //elimino todos los botones que había
        botones[0].remove();
    }    

    for(let i=0; i<data.length; i++){ //recorro las comidas de la categoría seleccionada
        let boton= creaNodo("button", data[i].nombre_comida);
        boton.setAttribute("value", data[i].cod_comida);
        boton.addEventListener("click", anyadeComida); //a cada botón de comida le asigno ese evento, que la añadirá al listado
        divBotonesComida.appendChild(boton);
    }
    divBotonesComida.scrollTop = 0; //el scroll al principio
}


/**
 * Función que pide los datos de la comida pulsada
 */
 function anyadeComida(){

    let cod_comida= this.value; //obtengo el código de la comida que desencadenó el evento

    fetch("../server/php/camarero/camarero.php",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify("comidaPedida:"+cod_comida) //mando al servidor el codigo de la comida pulsada
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){
                    anyadeAPedido(data);
                    /** Estoy recibiendo
                     * cod_comida, nombre_comida, cantidad, precio, nombre_categoria
                     */
                })
                .catch(function(er){
                    console.error("Error al recibir los datos de la comid pedida: " + er);
                })
        }
    })
    .catch(function(er){
        console.error("Error al solicitar los datos de la comida pedida: " + er);
    })
}


/**
 * Esta función irá creando las filas de la tabla del pedido
 */
function anyadeAPedido(data){    
    
    let totales= data.cantidad;//obtengo cuantos quedan
    totales--;
    let cookieComida= compruebaCookie("comida-"+data.cod_comida); //compruebo si esa comida está en cookies

    let expira= expiraEn(0, 5, 0); //expira a los 5 minutos

    if(cookieComida=="no encontrada"){ //esa cookie aún no se ha creado
        creaCookie("comida-"+data.cod_comida, totales, expira);
    }
    else{ //ya existía
        totales= compruebaCookie("comida-"+data.cod_comida);
        totales--;
        creaCookie("comida-"+data.cod_comida, totales, expira); //reemplazo las que quedaban con la nueva cantidad
    }

    let nodoP= document.getElementById("unidades:"+data.cod_comida); //intento obtener la "<p>" de lasa unidades de esa comida

    if(nodoP==null){ //NO existe aún esa comida, luego añado la fila <tr>

        if(totales < 0){ //compruebo si se puede restar 
            alert("No quedan suficientes " + data.nombre_comida);
        }
        else{ //se crea la <tr> con los datos pertinentes
            let tabla = document.getElementById("tablaPedido");
            let tr= creaNodo("tr");
            tr.setAttribute("class", "lineaPedido")
    
            let td1= creaNodo("td");
                let b1= creaNodo("b", "Categoria: ");
                let nomCategoria = creaNodo("p", data.nombre_categoria);
                nomCategoria.setAttribute("class", "categoriaPedido");
                let b2= creaNodo("b", "Plato: ");
                let nomComida= creaNodo("p", data.nombre_comida);
                nomComida.setAttribute("class", "nombreComida");
                nomComida.setAttribute("value", data.cod_comida);
            td1.appendChild(b1);
            td1.appendChild(nomCategoria);
            td1.appendChild(b2);
            td1.appendChild(nomComida);
    
            let td2= creaNodo("td");
                let botonMas= creaNodo("button", "+");
                botonMas.setAttribute("class", "bUnidades");
                botonMas.setAttribute("id", "mas:"+data.cod_comida);
                botonMas.addEventListener("click", incrementaUnidades); //añado este evento
                let pUnidades= creaNodo("p", "1");
                pUnidades.setAttribute("id", "unidades:"+data.cod_comida);
                let pPrecio= creaNodo("p", data.precio);
                pPrecio.setAttribute("style", "display:none;");
                let botonMenos= creaNodo("button", "-");
                botonMenos.setAttribute("class", "bUnidades");
                botonMenos.setAttribute("id", "menos:"+data.cod_comida);
                botonMenos.addEventListener("click", incrementaUnidades);
            td2.appendChild(botonMas);
            td2.appendChild(pUnidades);
            td2.appendChild(pPrecio);
            td2.appendChild(botonMenos);
    
            let td3= creaNodo("td");
                let textArea= creaNodo("textarea");
                textArea.setAttribute("id", "observaciones:"+data.cod_comida);
            td3.appendChild(textArea);
    
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
    
            tabla.tBodies[0].appendChild(tr);
        }
    }
    else{ //ya existe esa <tr>, luego la modifico

        if(totales < 0){ //compruebo si se puede restar 
            alert("No quedan suficientes " + data.nombre_comida);
        }
        else{
            let unidades= nodoP.textContent;
            unidades= parseInt(unidades)+1;
            nodoP.textContent= unidades;
        }
    }
} //end anyadeAPedido


//Cuando se pulse a Confirmar recojo todos los datos de las filas que hay en la tabla
document.getElementById("confirmar").onclick= function(){

    let lineasPedido= document.getElementsByClassName("lineaPedido"); //aquí tengo todas las <tr> donde están los pedidos
    
    let mesa= parseInt(document.getElementById("mesas").value); //obtengo la mesa que se ha seleccionado

    let arrayObj = new Array();
    for(let i=0; i<lineasPedido.length; i++){ //recorro todas las <tr>
        

        let tr= lineasPedido[i]; //obtengo la <tr>
        let celdas= tr.childNodes; //obtengo TODAS las <td> de esa <tr>

        let celda1= celdas[0]; //obtengo la <td> donde está el código de la comida
        let comida= parseInt(celda1.childNodes[3].attributes[1].value);

        let celda2= celdas[1];
        let cantidad= parseInt(celda2.childNodes[1].childNodes[0].textContent);
        let precio = parseFloat(celda2.childNodes[2].textContent);

        let celda3= celdas[2];
        let observaciones= celda3.childNodes[0].value;

        var obj={   plato: comida, //cod_comida
                    cant: cantidad, //unidades que se piden
                    observ: observaciones, //observaciones
                    mesa: mesa, //cod_mesa
                    precio: precio //precio/unidad
                };
        
        arrayObj.push(obj);
        let expira= expiraEn(0, 0, 1);
        creaCookie("comida-"+comida, "elimina", expira); //al segundo de darle a confirmar, se eliminará la cookie
    }

    let datos=[];


    datos.push(arrayObj);

    enviaPedidoAlServidor(datos); 
}


/**
 * Función que envía los datos de la tabla Pedidos al servidor para intentar insertar 
 * en la base de datos
 * @param {*} datos 
 */
function enviaPedidoAlServidor(datos){

    if(datos[0].length==0)
        alert("No se ha añadido nada al pedido");
    else{
        fetch("../server/php/camarero/pedido.php", {
            method:"POST",
            headers:{"Content-Type" : "application/json"},
            body: JSON.stringify(datos)
        })
        .then(function(resp){
            if(resp.ok){
                resp.json()
                    .then(function(data){
                        if(typeof(data)!="string"){ //Si NO llega un string
                            let cad="No quedan suficientes: \n";
                            for(let i=0; i<data.length; i++){
                                cad+=data[i].categoria + " de " + data[i].comida + ". Quedan: " + data[i].quedan + "\n";
                            }
                            alert(cad);
                        }    
                        if(data=="Correcto"){ //era String
                            reiniciaTablaPedido();
                        }
                    })
                    .catch(function(er){
                        console.error("Error al recibir los datos del pedido del servidor: " + er);
                    })
            }
        })
        .catch(function(er){
            console.error("Error al enviar los datos del pedido al servidor: " + er);
        });

    }
    
}


/**
 * Función que elimina todas las filas del pedido y devuelve a la pestaña
 * Carta mostrando los botones de las Categorias
 */
function reiniciaTablaPedido(){

    let arrayCookies= document.cookie.split(";");

    for(let i=0; i<arrayCookies.length; i++){

        let nom= arrayCookies[i].split("=")[0].substring(0, 7);
        nom= nom.trim();

        if(nom=="comida" || nom=="comida-"){
            nom= arrayCookies[i].split("=")[0];
            let expira= expiraEn(0, 0, 1);
            creaCookie(nom, "eliminada", expira);
        }
    }

    let padre= document.getElementById("tablaPedido");

    let tr= padre.getElementsByTagName("tr"); //obtengo todas las <tr>

    while(tr.length!=1){
        tr[1].remove();
    }

    //Muestro la pestaña de los botones de las comidas
    document.getElementById("listadoPedido").style.display="none";
    document.getElementById("botonesComida").style.display="grid";
    document.getElementsByClassName("tabs")[0].style.background="linear-gradient(to left, #f0ecec 0%, #f0ecec 50%, #c1d7ec 50%, #c1d7ec 100%)";
    document.getElementsByClassName("tabs")[0].style.borderTopLeftRadius = "10px";
    document.getElementsByClassName("tabs")[0].style.borderBottomLeftRadius = "10px";
    document.getElementsByClassName("tabs")[0].style.borderTopRightRadius = "0px";
    document.getElementsByClassName("tabs")[0].style.borderBottomRightRadius = "0px";
    solicitaBotonesCategorias();
    document.getElementById("cerrarConsulta").style.display="none";
    document.getElementById("confirmar").style.display="initial";

    //Si se ha salido de la Consulta del pedido, debo habilitar otra vez el botón Confirmar
    let confirmar= document.getElementById("confirmar");
    confirmar.disabled=false;

    if(this==undefined) //Será undefined cuando se haya puslado Confirmar. Interesa que el select se vaya a la primera opción
            document.getElementById("mesas").selectedIndex=0;       
    else{
        if(this.id =="cerrarConsulta"){ //se pulsó cerrarConsulta, luego tengo que ocultar dicho botón y mostrar el Confirmar
            document.getElementById("cerrarConsulta").style.display="none";
            document.getElementById("confirmar").style.display="initial";
            let thExtra= document.getElementById("tablaPedido").getElementsByTagName("th")[3]; //elimino la cabecera de Estado/Oper
            if(thExtra!=null)
                thExtra.remove();
        }
    }
    
}

/**
 * Función que incrementa/decrementa las unidades en la tabla
 * del Pedido. Se comprobará si quedan suficientes de esa comida
 */
function incrementaUnidades(){

    let id= this.id; //obtengo el id del botón que se pulsó

    let cod_comida= id.split(":")[1];

    let cookie= "comida-"+cod_comida;

    let cookieComida= parseInt(compruebaCookie(cookie)); //obtengo cuantas quedan de esa comida (se guardó al pulsar sobre el botón de la comida), expira en 30 segundos

    let incre= id.split(":")[0]; //puede ser "mas" o "menos"
    
    if(incre=="mas"){ //se ha pulsado el +
        let unidadesNodo= document.getElementById("unidades:"+cod_comida);
        let unidades= parseInt(unidadesNodo.textContent); //obtengo el nº que muestra las unidades que se van a pedir
        unidades++; //a ese nº le sumo +1
        cookieComida--; //a las comidas que quedan le resto -1
        if(cookieComida>=0){
            let expira= expiraEn(0, 5, 0);
            creaCookie(cookie, cookieComida, expira);
        }
        
        if(cookieComida >= 0)
            unidadesNodo.textContent= unidades;
        else
            alert("No quedan suficientes");
    }
    else{ //se ha pulsado el -
        let unidadesNodo= document.getElementById("unidades:"+cod_comida);
        let unidades= parseInt(unidadesNodo.textContent);
        unidades--;
        cookieComida++;
        let expira= expiraEn(0, 5, 0);
        creaCookie(cookie, cookieComida, expira);
        if(unidades==0)
            this.parentNode.parentNode.remove();
        else
            unidadesNodo.textContent= unidades;
    }
}


/**
 * Función que mostrará el estado del pedido de la mesa seleccionada
 */
document.getElementById("consultaPedido").onclick= function(){

    let selectMesas= document.getElementById("mesas").value;

    if(selectMesas=="Selecciona una mesa"){ //no seleccionó mesa
        alert("Selecciona antes una mesa");
    }
    else{
        document.getElementById("confirmar").style.display="none";
        document.getElementById("cerrarConsulta").style.display="initial";
        fetch("../server/php/camarero/consultaEstadoPedido.php", {
            method:"POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify("consultaEstadoPedido:"+selectMesas)
        })
        .then(function(resp){
            if(resp.ok){
                resp.json()
                    .then(function(data){
                        muestraInfoEstadoPedido(data);
                    })
                    .catch(function(er){
                        console.error("Error al recibir los datos del servidor solicitando info del estado del pedido: " + er);
                    })
            }
        })
        .catch(function(er){
            console.error("Error al solicitar info del estado del pedido: " + er);
        })
    }    
}


/**
 * Función que muestra la info que llega del servidor
 * @param {*} data 
 */
function muestraInfoEstadoPedido(data){

    if(data.length==0){ //no llegan datos, luego esa mesa no ha pedido nada
        let mesa= document.getElementById("mesas").selectedOptions[0].textContent; //obtengo la mesa que hay en el select    
        alert("No hay pedido para la " + mesa);
        let confirmar= document.getElementById("confirmar");
        confirmar.disabled=false;
    }
    else{
        //1º Debo añadir la columna "operaciones", donde se podrá anular o cambiar la observación

        let tabla= document.getElementById("tablaPedido");

        let sw= document.getElementById("colExtra");

        if(sw===null){
            let th= creaNodo("th", "Estado/Oper.");
            th.setAttribute("id", "colExtra");
            let tr1= tabla.getElementsByTagName("tr")[0]; //me quedo con la primera <tr>
            tr1.appendChild(th); //añado el nodo <th>
        }

        //Antes de nada elimino todas las filas que hubiera

        let filas= tabla.getElementsByTagName("tr");
        while(filas.length>1){
            filas[1].remove();
        }

        

        for(let i=0; i<data.length; i++){

            let tr= creaNodo("tr"); 
            tr.setAttribute("class", "lineaPedido");
        
            let td1= creaNodo("td");
                let b1= creaNodo("b", "Categoria: ");
                let nomCategoria = creaNodo("p", data[i].nombre_categoria);
                nomCategoria.setAttribute("class", "categoriaPedido");
                let b2= creaNodo("b", "Plato: ");
                let nomComida= creaNodo("p", data[i].nombre_comida);
                nomComida.setAttribute("class", "nombreComida");
                nomComida.setAttribute("value", data[i].cod_comida);
            td1.appendChild(b1);
            td1.appendChild(nomCategoria);
            td1.appendChild(b2);
            td1.appendChild(nomComida);

            let td2= creaNodo("td");            
                let pUnidades= creaNodo("input");
                    pUnidades.setAttribute("type", "text");
                    pUnidades.value=data[i].unidades;
                    pUnidades.setAttribute("id", "unidades:"+data[i].cod_comida);            
            td2.appendChild(pUnidades);

            let td3= creaNodo("td");
                let textArea= creaNodo("textarea", data[i].observaciones);
                textArea.setAttribute("id", "observaciones:"+data[i].cod_comida);
            td3.appendChild(textArea);

            let td4= creaNodo("td");
                let pEstado= creaNodo("p", data[i].estado);
                pEstado.setAttribute("class", "pEstado");
                td4.appendChild(pEstado);

                if(data[i].estado=="En cola"){ //solo se puede anular o modificar si está en cola
                    let bAnular= creaNodo("button", "Anular");
                        bAnular.setAttribute("id", "bAnular");
                        bAnular.setAttribute("codigo", data[i].cod_linea_pedido);
                        bAnular.addEventListener("click", anulaComida);
                    let bModif= creaNodo("button", "Modificar");
                        bModif.setAttribute("id", "bModificar");
                        bModif.addEventListener("click", modificaComida);
                        bModif.setAttribute("codigo", data[i].cod_linea_pedido);

                    td4.appendChild(bAnular);
                    td4.appendChild(bModif);

                }

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);

            tabla.tBodies[0].appendChild(tr);

        }
    }    
}

/**
 * Función que anula un pedido En cola
 */
function anulaComida(){
    
    let sw= window.confirm("Se va a eliminar el pedido. ¿Estás seguro?");

    if(sw){
        let bAnular= this; //obtengo el botón que se pulsó
        let cod_linea= bAnular.attributes[1].value; //en el botón está el cod_linea_pedido

        fetch("../server/php/camarero/consultaEstadoPedido.php", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify("anulaPedido:"+cod_linea)
        })
        .then(function(resp){
            if(resp.ok){
                resp.json()
                    .then(function(data){
                        if(data=="Correcto"){
                            window.alert("Se ha eliminado correctamente");
                            bAnular.parentNode.parentNode.remove(); //elimino esa fila
                        }
                        else if(data=="Error")
                            alert("No se ha podido eliminar");
                    })
                    .catch(function(er){
                        console.error("Error al recibir la confirmación de la anulación: " + er);
                    })
            }
        })
        .catch(function(er){
            console.error("Error al solicitar anular el pedido: " + er);
        })
    }    
}

/**
 * Función que modifica un pedido En cola
 */
function modificaComida(){

    let sw= window.confirm("Se va a modificar el pedido. ¿Estás seguro?");

    if(sw){
        let bModificar= this; //obtengo el botón que se pulsó
        let unidades= bModificar.parentNode.previousSibling.previousSibling.childNodes[0].value;
        let observ= bModificar.parentNode.previousSibling.childNodes[0].value; //accedo al textarea desde el botón
        let cod_linea= this.attributes[1].value;
    

        fetch("../server/php/camarero/consultaEstadoPedido.php", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify("modificaPedido:"+unidades+":"+observ+":"+cod_linea)
        })
        .then(function(resp){
            if(resp.ok){
                resp.json()
                    .then(function(data){

                        if(data=="Correcto"){
                            alert("Pedido modificado correctamente");
                            bModificar.parentNode.parentNode.style.backgroundColor="#C5F596"; //cambio a verde esa fila

                            setTimeout(function(){ //a los 3 segundos vuelve a su estado
                            bModificar.parentNode.parentNode.style.backgroundColor="#c1d7ec";
                            }, 3000);
                        }

                        else if(data=="Error al actualizar")
                            alert("No se ha podido modificar el pedido");
                        
                        else if(data.match("Insuficientes")){
                            let unidades= data.split(":")[1];
                            alert("No quedan suficientes unidades. Quedan: " + unidades);
                        }
                            
                    })
                    .catch(function(er){
                        console.error("Error al recibir los datos de modificar pedido: " + er);
                    })
            }
        })
        .catch(function(er){
            console.error("Error al solicitar modificar pedido: " + er);
        })
    }
}


/**
 * Cuando el usuario cambie de mesa, se debe "reiniciar" todo
 */
document.getElementById("mesas").onchange = reiniciaTablaPedido;
document.getElementById("cerrarConsulta").onclick= reiniciaTablaPedido;


//Cada 10 segundos se comprueba si hay platos listos para entregar
setInterval(function(){

    fetch("../server/php/camarero/consultaEstadoPedido.php", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify("pedidosListos")
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){
                    document.getElementById("platosListos").textContent=data;
                    cambiaIdBotonListos();
                })
                .catch(function(er){
                    console.error("Error al recibir los datos de pedidosListos: " + er);
                })
        }
    })
    .catch(function(er){
        console.error("Error al solicitar los pedidos listos: " + er);
    })

}, 10000);



function cambiaIdBotonListos(){

    let numPlatosListos= parseInt(document.getElementById("platosListos").textContent);

    let boton0= document.getElementById("bListos0");
    let boton1= document.getElementById("bListos1");

    if(boton0!=null){ //El botón está con el id platosListos
        if(numPlatosListos>0){ //hay platos por servir
            boton0.setAttribute("id", "bListos1");
        }
        if(numPlatosListos==0){
            boton0.setAttribute("id", "bListos0");
        }
    }
    else if(boton1!=null){ //el botón está con el id bListos
        if(numPlatosListos>0){ //hay platos por servir
            boton1.setAttribute("id", "bListos1");
        }
        if(numPlatosListos==0){
            boton1.setAttribute("id", "bListos0");
        }
    }
}


document.getElementsByClassName("ventanaPedidosListos")[0].onclick=  function (){
    window.open("./camareroListos.html", "_self");
}