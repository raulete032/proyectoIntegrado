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




solicitaComidasListas();
solicitaBebidasListas();


/**
 * Función que solicita las comidas que están listas para servir
 */
function solicitaComidasListas(){

    fetch("../server/php/camarero/consultaPedidosListos.php", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify("comidasListas")
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){
                    cargaComidasListas(data);
                })
                .catch(function(er){
                    console.error("Error al recibir los datos de las comidas listas: " + er);
                })
        }
    })
    .catch(function(er){
        console.error("Error al solicitar comidas listas: " + er);
    })
}


/**
 * Función que carga en el HTML las comidas listas por servir
 * @param {*} data -> Los datos de las comidas listas
 */
function cargaComidasListas(data){

    let table= document.getElementById("tableComidas");

    let tr= table.getElementsByTagName("tr");

    if(tr.length >= 2)
        while(tr.length > 1){
            tr[1].remove();
        }

    for(let i=0; i<data.length; i++){

        let tr= creaNodo("tr"); //creo la fila
            
            let td1= creaNodo("td", data[i].nombre_mesa); //creo la celda

            let td2= creaNodo("td");
                let b1= creaNodo("b", "Categoria: ");
                let pCategoria= creaNodo("p", data[i].nombre_categoria);
                pCategoria.setAttribute("class", "categoriaPedido");
                let b2= creaNodo("b", "Plato: ");
                let pComida= creaNodo("p", data[i].nombre_comida);
            td2.appendChild(b1);
            td2.appendChild(pCategoria);
            td2.appendChild(b2);
            td2.appendChild(pComida);

            let td3= creaNodo("td", data[i].unidades);

            let td4= creaNodo("td");
                let botonServido= creaNodo("button", "Servido");
                botonServido.setAttribute("id", data[i].cod_linea_pedido); //creo ese id para luego poder referirme a esa fila y a la linea del pedido
                botonServido.addEventListener("click", servido);
                td4.appendChild(botonServido);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        table.tBodies[0].appendChild(tr);
    }
}


/**
 * Función que solicita las bebidas que están listas para servir
 */
function solicitaBebidasListas(){

    fetch("../server/php/camarero/consultaPedidosListos.php", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify("bebidasListas")
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){
                    cargaBebidasListas(data);
                })
                .catch(function(er){
                    console.error("Error al recibir los datos de las comidas listas: " + er);
                })
        }
    })
    .catch(function(er){
        console.error("Error al solicitar comidas listas: " + er);
    })
}


/**
 * Función que carga en el HTML las bebidas listas por servir
 * @param {*} data -> Los datos de las bebidas listas
 */
function cargaBebidasListas(data){

    let table= document.getElementById("tableBebidas");

    let tr= table.getElementsByTagName("tr");

    if(tr.length >= 2)
        while(tr.length > 1){
            tr[1].remove();
        }



    for(let i=0; i<data.length; i++){

        let tr= creaNodo("tr"); //creo la fila
            
            let td1= creaNodo("td", data[i].nombre_mesa); //creo la celda

            let td2= creaNodo("td");
                let b1= creaNodo("b", "Categoria: ");
                let pCategoria= creaNodo("p", data[i].nombre_categoria);
                pCategoria.setAttribute("class", "categoriaPedido");
                let b2= creaNodo("b", "Plato: ");
                let pComida= creaNodo("p", data[i].nombre_comida);
            td2.appendChild(b1);
            td2.appendChild(pCategoria);
            td2.appendChild(b2);
            td2.appendChild(pComida);

            let td3= creaNodo("td", data[i].unidades);

            let td4= creaNodo("td");
                let botonServido= creaNodo("button", "Servido");
                botonServido.setAttribute("id", data[i].cod_linea_pedido); //creo ese id para luego poder referirme a esa fila y a la linea del pedido
                botonServido.addEventListener("click", servido);
                td4.appendChild(botonServido);


        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        table.tBodies[0].appendChild(tr);
    }
}


/**
 * Se pulsa Pedidos
 */
document.getElementById("volver").onclick = () => {
    window.open("./camarero.html", "_self");
}

countTabs();
setInterval(countTabs, 5000);
setInterval(solicitaComidasListas, 5000);

/**
 * Función que irá cambiando el nº que aparece en el círculo rojo
 */
function countTabs(){

    fetch("../server/php/camarero/consultaPedidosListos.php", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify("countComidasBebidas")
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){
                    rellenaSpanTabs(data);
                })
                .catch(function(er){
                    console.error("Error al recibir el número de comidas y bebidas listas: " + er);
                })
        }
    })
    .catch(function(er){
        console.error("Error al solicitar el número de comidas y bebidas listas: " + er);
    })
}

/**
 * Aquí se rellena el círculo rojo
 * @param {*} data -> Número procedente del servidor
 */
function rellenaSpanTabs(data){
    let comidas= data.comidas;
    let bebidas= data.bebidas;

    document.getElementsByClassName("spanComidas")[0].textContent= comidas;
    document.getElementsByClassName("spanBebidas")[0].textContent= bebidas;
}



document.getElementById("tabComidas").addEventListener("click", cambiaPestaña);
document.getElementById("tabBebidas").addEventListener("click", cambiaPestaña);


/**
 * Función que intercambia las pestañas
 */
function cambiaPestaña(){

    let id= this.id;

    if(id=="tabComidas"){//se ha pulsado Comidas
        document.getElementById("divTableBebidas").style.display="none";
        document.getElementById("divTableComidas").style.display="initial";
        document.getElementsByClassName("tabs")[0].style.background="linear-gradient(to left, #f0ecec 0%, #f0ecec 50%, #c1d7ec 50%, #c1d7ec 100%)";
        document.getElementsByClassName("tabs")[0].style.borderTopLeftRadius = "10px";
        document.getElementsByClassName("tabs")[0].style.borderBottomLeftRadius = "10px";
        document.getElementsByClassName("tabs")[0].style.borderTopRightRadius = "0px";
        document.getElementsByClassName("tabs")[0].style.borderBottomRightRadius = "0px";

    }
    else{ //se ha pulsado Bebidas
        document.getElementById("divTableComidas").style.display="none";
        document.getElementById("divTableBebidas").style.display="initial";
        document.getElementsByClassName("tabs")[0].style.background="linear-gradient(to right, #f0ecec 0%, #f0ecec 50%, #c1d7ec 50%, #c1d7ec 100%)";
        document.getElementsByClassName("tabs")[0].style.borderTopLeftRadius = "0px";
        document.getElementsByClassName("tabs")[0].style.borderBottomLeftRadius = "0px";
        document.getElementsByClassName("tabs")[0].style.borderTopRightRadius = "10px";
        document.getElementsByClassName("tabs")[0].style.borderBottomRightRadius = "10px";
    }
}

/**
 * Función que cambia el estado del pedido a Servido
 */
function servido(){

    let id= this.id; //obtengo el id del botón que se pulsó

    fetch("../server/php/camarero/consultaPedidosListos.php", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify("pedidoServido:"+id)
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){
                    if(data)
                        document.getElementById(id).parentNode.parentNode.remove(); //Elimino la fila de la tabla
                    else
                        alert("No se pudo servir el pedido");
                })
                .catch(function(er){
                    console.error("Error al recibir los datos del pedido servido: " + er);
                })
        }
    })
    .catch(function(er){
        console.error("Error al solicitar que se sirva el pedido: " + er);
    })
}
