
import {creaNodo} from "./libreria.js";



rellenaMenuNav(); //esta función solicita todas las categorias de la BBDD o del sessionStorage


rellenaCartaMain(); //esta función rellena TODA la carta


function rellenaMenuNav(){

    let datos= sessionStorage.getItem("enlacesMenu"); //lo recupero (si es que está)

    if(datos == null){ //NO estaba en el sessionStorage
        fetch("./server/php/index.php",{
            method:"POST",
            headers:{"Content-Type" : "application/json"},
            body:JSON.stringify("enlacesMenu")
        })
        .then(function(resp){            
            if(resp.ok){
                resp.json()
                    .then(function(data){                        
                        escribeMenuNav(data); //en esta función se crearán y añadirán los nodos del nav
                        escribeMenuMobil(data);
                        let datos= JSON.stringify(data); 
                        sessionStorage.setItem("enlacesMenu", datos); //lo guardo en sessionStorage para que sea más rápida la próxima vez que cargue
                    })
                    .catch(function(er){
                        console.log("Error al recibir los datos del Nav: " + er);
                    });
            }
        })
        .catch(function(er){
            console.log("Error al soliciatar los datos del Nav: " + er);
        });    
        
    }
    else{ //sí estaba en el sessionStorage
        let data= JSON.parse(datos);
        escribeMenuNav(data); //se lo paso a la función para que lo añada al html
        escribeMenuMobil(data);
    }    
}




/**
 * Función que crea los nodos para el menú Nav
 * 
 * @param {*} data Son los datos que llegan de la base de datos 
 */
function escribeMenuNav(data){
    let padre= document.getElementById("menuNav");
    for(let i=0; i<data.length; i++){
        let nodoA= creaNodo("a", data[i].nombre);
        nodoA.setAttribute("href", "#")
        nodoA.setAttribute("id", "enlace"+data[i].cod_categoria);
        nodoA.addEventListener("click", recogePassword); //le asigno un evento onclick a cada enlace del Nav
        padre.appendChild(nodoA);
    }    
}


/**
 * Función que crea los nodos para el menú del móvil
 * @param {*} data 
 */
function escribeMenuMobil(data){

    let padre= document.getElementById("myLinks");

    for(let i=0; i<data.length; i++){
        let nodoA= creaNodo("a", data[i].nombre);
        nodoA.setAttribute("href", "#");
        nodoA.setAttribute("id", "enlace"+data[i].cod_categoria);
        nodoA.addEventListener("click", recogePassword);
        padre.appendChild(nodoA);
    }
}



/**
 * Función que irá recogiendo los id's de los enlaces, los guardará en
 * sessionStorage hasta que se pulse el logo. La unión de los id's correctos
 * será la clave para acceder a la aplicación 
 */
function recogePassword(){

    let cod=this.id;
    let acceder= sessionStorage.getItem("acceder");

    if(acceder==null){ //es la primera vez que se pulsa
        sessionStorage.setItem("acceder", cod);
    }
    else{ //no es null, luego ya había algo en sessionStorage
        acceder+=cod; //le concateno
        sessionStorage.setItem("acceder", acceder);
    }    
}

document.getElementById("logo").addEventListener("click", acceder);
document.getElementById("logo2").addEventListener("click", acceder);

/**
 * Cuando se pulse el logo, enviará lo que haya en sessionStorage al archivo
 * index.php. Si la clave es la correcta devolverá "ok", en caso contrario
 * devolverá "no"
 */
function acceder(){

    let pass= sessionStorage.getItem("acceder"); //obtengo toda la cadena
    pass="comprueba:"+pass;
    fetch("./server/php/index.php",{
        method:"POST",
        headers:{"Content-Type" : "application/json"},
        body:JSON.stringify(pass)
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){
                    sessionStorage.removeItem("acceder"); //elimino el sessionStorage, así se "reinician" las pulsaciones
                    if(data.resultado=="ok"){ //la clave era corrrecta.
                        sessionStorage.setItem("inicio", data.clave); //guardo la clave generada en el servidor                        
                        window.location.href= "./html/inicio.html"; //redirijo al inicio.html
                    }                        
                })
                .catch(function(er){
                    console.log("Error en la respuesta a la solicitud de la comprobación de la combinación: " + er);
                });
        }
    })
    .catch(function(er){
        console.log("Error al solicitar la comprobación de la combinación: " + er);
    });
}


document.getElementById("menuMobil").onclick = function(){
    var x = document.getElementById("myLinks");
          if (x.style.display === "block") {
            x.style.display = "none";
          } 
          else {
            x.style.display = "block";
          }
}


/**
 * Función que solicita los datos para rellenar la carta del restaurante
 */
function rellenaCartaMain(){

    let datos= sessionStorage.getItem("cartaMenu"); //lo recupero (si es que está)

    if(datos == null){ //NO estaba en el sessionStorage
        fetch("./server/php/index.php",{
            method:"POST",
            headers:{"Content-Type" : "application/json"},
            body: JSON.stringify("cartaMenu")
        })
        .then(function(respuesta){
            if(respuesta.ok){
                respuesta.json() 
                    .then(function(data){                        
                        escribeMain(data);
                        let datos= JSON.stringify(data);
                        sessionStorage.setItem("cartaMenu", datos);
                    })
                    .catch(function(er){
                        console.error("Error al recibir los datos de la carta: " + er);
                    })
            }        
        })
        .catch(function(er){
            console.error("Error al solicitar los datos para la carta: " + er);
        })
    }
    else{
        let data= JSON.parse(datos);
        escribeMain(data);
    }    
}


/**
 * Función que escribe en en HTML la carta del restaurante
 * @param {*} data -> Los datos procedentes del servidor
 */
function escribeMain(data){

    let main = document.getElementsByTagName("main")[0]; //obtengo referencia al main

    var categorias=[];

    for(let i=0; i<data.length; i++){ //recorro para obtener el nombre de las Categorias

        if(!categorias.includes(data[i].nombre_categoria)) //NO esta esa categoria
            categorias.push(data[i].nombre_categoria);
    }

    //Ahora tengo en el array "categorias" TODAS las categorias

    for(let i=0; i<categorias.length; i++){ //creo todos los divs de categorias
        var nomCategoria= categorias[i];
        let divCategoria= creaNodo("div");
        switch(categorias[i]){
            case "Patatas asadas": divCategoria.setAttribute("class", "menuCarta patatasAsadas"); break;
            case "Bocadillos": divCategoria.setAttribute("class", "menuCarta bocadillos"); break;
            case "Roscas": divCategoria.setAttribute("class", "menuCarta roscas"); break;
            case "Hamburguesas de cerdo": divCategoria.setAttribute("class", "menuCarta hCerdo") ;break;
            case "Hamburguesas de ternera": divCategoria.setAttribute("class", "menuCarta hTernera") ;break;
            case "Hamburguesas de pollo crujiente": divCategoria.setAttribute("class", "menuCarta hPollo") ;break;
            case "Hamburguesas de buey": divCategoria.setAttribute("class", "menuCarta hBuey") ;break;
            case "Hamburguesas angus": divCategoria.setAttribute("class", "menuCarta hAngus") ;break;
            case "Ensaladas": divCategoria.setAttribute("class", "menuCarta ensaladas") ;break;
            case "Para picar": divCategoria.setAttribute("class", "menuCarta paraPicar") ;break;
            case "Patatas cheddar": divCategoria.setAttribute("class", "menuCarta patatasCheddar") ;break;
            case "Sandwich": divCategoria.setAttribute("class", "menuCarta sandwich") ;break;
            case "Super dog": divCategoria.setAttribute("class", "menuCarta superDog") ;break;
            case "Kebab": divCategoria.setAttribute("class", "menuCarta kebab") ;break;
            case "Tacos": divCategoria.setAttribute("class", "menuCarta tacos") ;break;
            case "Pizzas": divCategoria.setAttribute("class", "menuCarta pizzas") ;break;
            case "Bocadillos pizza": divCategoria.setAttribute("class", "menuCarta bocadilloPizza") ;break;
            case "Flautas": divCategoria.setAttribute("class", "menuCarta flautas") ;break;
            case "Camperos": divCategoria.setAttribute("class", "menuCarta camperos") ;break;
            case "Bebidas": divCategoria.setAttribute("class", "menuCarta bebidas") ;break;
            default : divCategoria.setAttribute("class", "menuCarta");break;
        }

        var divMenuCategorias= creaNodo("div"); //primer div dentro del divCategorias
        divMenuCategorias.setAttribute("class", "menuCategorias");
        

        var divPlatos= creaNodo("div"); //segundo div dentro del divCategorias
        
        //los añado a su divCategoria
        divCategoria.appendChild(divMenuCategorias); 
        divCategoria.appendChild(divPlatos);
        var sw=true;
        for(let i=0; i<data.length; i++){ //recorro ahora para obtener los datos de las comidas
            
            if(data[i].nombre_categoria == nomCategoria){
                let imagen=i;
                let div= creaNodo("div");

                let divExt= creaNodo("div", (data[i].nombre_comida).toUpperCase());
                divExt.setAttribute("class", "divPlato");
                let span= creaNodo("span", data[i].precio+" €");
                span.setAttribute("style", "float:right");
                divExt.appendChild(span);

                // let p1= creaNodo("p", (data[i].nombre_comida).toUpperCase());
                // let p2= creaNodo("p", data[i].precio + "€");
                let p3= creaNodo("p");
                p3.setAttribute("class", "descripcion");
                let cursiva= creaNodo("i", data[i].descripcion);
                p3.appendChild(cursiva);
                if(sw){
                    var h3= creaNodo("h3", nomCategoria.toUpperCase());
                    h3.setAttribute("class", "tituloCategoria");
                    h3.setAttribute("id", "enlace"+data[i].cod_categoria);
                    h3.addEventListener("click", recogePassword);
                    var img= creaNodo("img");
                    img.setAttribute("src", "./img/index/categorias/"+data[imagen].foto);
                    divMenuCategorias.appendChild(h3);
                    divMenuCategorias.appendChild(img);
                    sw= false;
                } 
                // div.appendChild(p1);
                // div.appendChild(p2);
                div.appendChild(divExt);
                div.appendChild(p3);

                divPlatos.appendChild(div);
            }           
        }
        sw=true;

        main.appendChild(divCategoria); //los voy añadiendo al main

    } //end for genera divCategorias

}



