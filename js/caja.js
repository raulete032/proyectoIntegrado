
import {creaNodo, creaCookie, expiraEn, compruebaCookie} from "./libreria.js";


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



imprimeMesas(); //Función que muestra el esquema de las mesas
setInterval(imprimeMesas, 3000); //Cada 3 segundos se actualiza el esquema "liberando" u "ocupando" mesas

/**
 * Función que muestra el esquema de las mesas
 */
function imprimeMesas(){

    fetch("../server/php/caja/caja.php",{
        method:"POST",
        headers:{"Content-Type":"application-json"},
        body: JSON.stringify("dibujosMesas")
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){
                    rellenaMesas(data);
                })
                .catch(function(er){
                    console.error("Error al recibir la info de las mesas: " + er);
                })
        }
    })
    .catch(function(er){
        console.error("Error al solicitar info de las mesas: " + er);
    })
}

/**
 * Función que escribe en el HTML el esquema de las mesas
 * @param {*} data -> Datos procedentes del servidor
 */
function rellenaMesas(data){
    let salon= document.getElementById("salon");
    for(let i=0; i<data.length; i++){

        let idImg= (data[i].nombre).toLowerCase(); //paso a minúscula
        idImg= idImg.replace(/ /g,""); //quito los espacios en blanco
        
        let nodoImg= creaNodo("img");
        nodoImg.setAttribute("id", idImg);
        if(data[i].ocupada==1){ //está ocupada
            nodoImg.setAttribute("src", "../img/caja/"+idImg+"ocupada.png");
        }
        else{ //no está ocupada
            nodoImg.setAttribute("src", "../img/caja/"+idImg+"libre.png");
        }

        nodoImg.addEventListener("click", total); 
            
        salon.appendChild(nodoImg);
    }
}


/**
 * Función que se ejecuta al pulsar sobre una mesa.
 * Solicita al servidor los datos de esa mesa.
 */
function total(){ 

    //1º elimino todos los nodos
    let desglose= document.getElementById("desglose");

    let nodosDesglose= desglose.childNodes;

    while(nodosDesglose.length!=0)
        nodosDesglose[0].remove();


    //2º creo el nodo Total
    let mesa= this.id.slice(0, 4);
    let numMesa= this.id.slice(4);
    sessionStorage.setItem("mesaDesglose", numMesa);

    let nomMesa= (mesa + " " + numMesa).toUpperCase();

    let tiquet= creaNodo("button", "Ticket");
        tiquet.setAttribute("id", "imprimeTicket");
        tiquet.addEventListener("click", creaTicket);
        tiquet.setAttribute("type", "button");

    let h1Total= creaNodo("h1", "Total " + nomMesa);

    desglose.appendChild(h1Total);
    desglose.appendChild(tiquet);

    //Ahora debo solicitar TODOS los pedidos de esta mesa

    fetch("../server/php/caja/caja.php",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify("total:"+nomMesa)
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){
                    if(data.length>0)
                        muestraTotal(data);
                })
                .catch(function(er){
                    console.error("Error al recibir los datos del total: " + er);
                })
        }
    })
    .catch(function(er){
        console.error("Error al solicitar info del total: " + er);
    })
}

/**
 * Muestra el desglose del pedido de esa mesa
 * @param {*} data -> Datos procedentes del servidor
 */
function muestraTotal(data){

    sessionStorage.setItem("ticket", JSON.stringify(data));
    
    //Le pongo el id (cod_total_pedido) al título para luego poder actualizar la BD
    let titulo= document.getElementById("desglose").getElementsByTagName("h1")[0];
        titulo.setAttribute("id", "cod_total_pedido:"+data[0].cod_total_pedido);


    let h2Bebidas= creaNodo("h2");
        h2Bebidas.setAttribute("id", "bebidasGeneral");
        h2Bebidas.addEventListener("click", marcaDesmarca);
    let checkBebidas= creaNodo("input");
        checkBebidas.setAttribute("type", "checkbox");
        checkBebidas.setAttribute("name", "bebidasGeneral");
        checkBebidas.setAttribute("id", "checkBebidas");
        checkBebidas.setAttribute("checked", true);
        // checkBebidas.addEventListener("click", changemarcaDesmarca);

    h2Bebidas.appendChild(checkBebidas);
    h2Bebidas.innerHTML+="&nbsp;";
    let txtBebidas= document.createTextNode("Bebidas");
    h2Bebidas.appendChild(txtBebidas);
    document.getElementById("desglose").appendChild(h2Bebidas);

    let h2Comida= creaNodo("h2");
        h2Comida.setAttribute("id", "comidasGeneral");
        h2Comida.addEventListener("click", marcaDesmarca);
    let checkComida= creaNodo("input");
        checkComida.setAttribute("type", "checkbox");
        checkComida.setAttribute("name", "comidasGeneral");
        checkComida.setAttribute("id", "checkComidas");
        checkComida.setAttribute("checked", true);
        // checkComida.addEventListener("click", changemarcaDesmarca)


    h2Comida.appendChild(checkComida);
    h2Comida.innerHTML+="&nbsp;";
    let txtcomidas= document.createTextNode("Comidas");
    h2Comida.appendChild(txtcomidas);
    document.getElementById("desglose").appendChild(h2Comida);


    //1º Las bebidas
    for(let i=0; i<data.length; i++){
        let btnQuitar=null;
        if(data[i].esBebida=="1"){ //el cod_categoria==20 son las bebidas
            let div= creaNodo("div");
                div.setAttribute("class", "lineaPedido");
                div.addEventListener("click", marcaDesmarca);
                let p1= creaNodo("p");
                    let check= creaNodo("input");
                        check.setAttribute("type", "checkbox");
                        check.setAttribute("checked", true);
                        check.setAttribute("precio", data[i].precio_comida);
                        check.setAttribute("name", "bebidas");
                        // check.addEventListener("click", changemarcaDesmarca);
                    p1.appendChild(check);
                    p1.innerHTML+="&nbsp;";
                    btnQuitar= creaNodo("button");
                    let imgX= creaNodo("img");
                        imgX.setAttribute("src", "../img/caja/quitar.png");
                    btnQuitar.appendChild(imgX);
                    btnQuitar.setAttribute("data-cod_linea_pedido", data[i].cod_linea_pedido);
                    btnQuitar.setAttribute("data-unidades", data[i].unidades);
                    btnQuitar.setAttribute("class", "quitar");
                    btnQuitar.addEventListener("click", quitarLineaPedido);
                    let txt= document.createTextNode(data[i].nombre_categoria + ": " + data[i].nombre_comida);
                    p1.appendChild(txt);
                    p1.appendChild(btnQuitar);
                let p2= creaNodo("p", data[i].precio_comida);
                div.appendChild(p1);
                div.appendChild(p2);

            document.getElementById("desglose").insertBefore(div, h2Comida);
            let unidades= parseInt(data[i].unidades);

            for(let j=1; j<unidades; j++){ //muestro tantas líneas como unidades haya
                let div= creaNodo("div");
                    div.setAttribute("class", "lineaPedido");
                    div.addEventListener("click", marcaDesmarca);
                let p1= creaNodo("p");
                    let check= creaNodo("input");
                        check.setAttribute("type", "checkbox");
                        check.setAttribute("checked", true);
                        check.setAttribute("precio", data[i].precio_comida);
                        check.setAttribute("name", "bebidas");
                        // check.addEventListener("click", changemarcaDesmarca);
                    p1.appendChild(check);
                    p1.innerHTML+="&nbsp;";
                    btnQuitar= creaNodo("button");
                    let imgX= creaNodo("img");
                        imgX.setAttribute("src", "../img/caja/quitar.png");
                    btnQuitar.appendChild(imgX);
                    btnQuitar.setAttribute("data-cod_linea_pedido", data[i].cod_linea_pedido);
                    btnQuitar.setAttribute("data-unidades", data[i].unidades);
                    btnQuitar.setAttribute("class", "quitar");
                    btnQuitar.addEventListener("click", quitarLineaPedido);
                    let txt= document.createTextNode(data[i].nombre_categoria + ": " + data[i].nombre_comida);
                    p1.appendChild(txt);
                    p1.appendChild(btnQuitar);
                let p2= creaNodo("p", data[i].precio_comida);
                div.appendChild(p1);
                div.appendChild(p2);
                document.getElementById("desglose").insertBefore(div, h2Comida);
            }
        } //end if bebidas

        else{ //NO es una bebida
        //2º La comida

        let div= creaNodo("div");
            div.setAttribute("class", "lineaPedido");
            div.addEventListener("click", marcaDesmarca);
        let p1= creaNodo("p");
            let check= creaNodo("input");
                check.setAttribute("type", "checkbox");
                check.setAttribute("checked", true);
                check.setAttribute("precio", data[i].precio_comida);
                check.setAttribute("name", "comidas");
                // check.addEventListener("click", changemarcaDesmarca);
            p1.appendChild(check);
            p1.innerHTML+="&nbsp;";
            btnQuitar= creaNodo("button");
            let imgX= creaNodo("img");
                imgX.setAttribute("src", "../img/caja/quitar.png");
                btnQuitar.appendChild(imgX);
            btnQuitar.setAttribute("data-cod_linea_pedido", data[i].cod_linea_pedido);
            btnQuitar.setAttribute("data-unidades", data[i].unidades);
            btnQuitar.setAttribute("class", "quitar");
            btnQuitar.addEventListener("click", quitarLineaPedido);
            let txt= document.createTextNode(data[i].nombre_categoria + ": " + data[i].nombre_comida);
            p1.appendChild(txt);
            p1.appendChild(btnQuitar);
        let p2= creaNodo("p", data[i].precio_comida);
        div.appendChild(p1);
        div.appendChild(p2);

        document.getElementById("desglose").appendChild(div);
        let unidades= parseInt(data[i].unidades);

        for(let j=1; j<unidades; j++){ //muestro tantas líneas como unidades haya
            let div= creaNodo("div");
                div.setAttribute("class", "lineaPedido");
            div.addEventListener("click", marcaDesmarca);
            let p1= creaNodo("p");
                let check= creaNodo("input");
                    check.setAttribute("type", "checkbox");
                    check.setAttribute("checked", true);
                    check.setAttribute("precio", data[i].precio_comida);
                    check.setAttribute("name", "comidas");
                    // check.addEventListener("click", changemarcaDesmarca);
                p1.appendChild(check);
                p1.innerHTML+="&nbsp;";
                btnQuitar= creaNodo("button");
                let imgX= creaNodo("img");
                    imgX.setAttribute("src", "../img/caja/quitar.png");
                btnQuitar.appendChild(imgX);
                btnQuitar.setAttribute("data-cod_linea_pedido", data[i].cod_linea_pedido);
                btnQuitar.setAttribute("data-unidades", data[i].unidades);
                btnQuitar.setAttribute("class", "quitar");
                btnQuitar.addEventListener("click", quitarLineaPedido);
                let txt= document.createTextNode(data[i].nombre_categoria + ": " + data[i].nombre_comida);
                p1.appendChild(txt);
                p1.appendChild(btnQuitar);
            let p2= creaNodo("p", data[i].precio_comida);
            div.appendChild(p1);
            div.appendChild(p2);
            document.getElementById("desglose").appendChild(div);
        }
        }
    }

    let hr1= creaNodo("hr");
    document.getElementById("desglose").appendChild(hr1);

    let divTotal= creaNodo("div");
        let pTotal= creaNodo("p", "TOTAL: ");
        let total= calculaTotal();
        let pImporte= creaNodo("p", total.toFixed(2));
        pImporte.setAttribute("id", "importePagar");
        divTotal.appendChild(pTotal);
        divTotal.appendChild(pImporte);
    document.getElementById("desglose").appendChild(divTotal);

    let divEntrega= creaNodo("div");
        let pEntrega= creaNodo("p", "ENTREGA: ");
        let pCifraEntrega= creaNodo("p");
        pCifraEntrega.setAttribute("id", "cifraEntrega");
    divEntrega.appendChild(pEntrega);
    divEntrega.appendChild(pCifraEntrega);
    document.getElementById("desglose").appendChild(divEntrega);
    

    let divTeclado= creaTeclado();
    
    document.getElementById("desglose").appendChild(divTeclado);

    let lengthBebidas= document.getElementsByName("bebidas").length;
    let lengthComidas= document.getElementsByName("comidas").length;
    
    if(lengthBebidas==0)
        document.getElementById("bebidasGeneral").remove();
    
    if(lengthComidas==0)
        document.getElementById("comidasGeneral").remove();

} //end MuestraTotal


/**
 * Función que quita una linea del pedido
 */
function quitarLineaPedido(){

    let sw= confirm("Estás seguro que quiere eliminar esta línea?");
    if(sw){
        let btn= this;
        let cod_linea_pedido = parseInt(this.attributes[0].value);
        let unidades = parseInt(this.attributes[1].value);
        let obj = {
            cod_linea_pedido: cod_linea_pedido,
            unidades: unidades
        };

        obj= JSON.stringify(obj);

        fetch("../server/php/caja/caja.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify("quitarLinea*" + obj)
        })
            .then(function(resp) {
                if(resp.ok)
                    resp.json()
                        .then(function(data){
                            if(data=="ok"){
                                if(unidades>1){
                                    reasingaUnidades(btn);
                                }
                                cambiaImporteTotal();
                                btn.parentNode.parentNode.remove();
                                creaCookie("importeTotal", document.getElementById("importePagar").textContent, expiraEn(0, 10, 0));
                                compruebaLineasPedido();
                            }
                        })
                        .catch(function(er){
                            console.error("Error al recibir la confirmación: " + er);
                        })
            })
            .catch(function (er) {
                console.error("Error al enviar los datos para eliminar la línea: " + er);
            })      
    }//end if confirm
}



function cambiaImporteTotal(){

    let nomMesa= sessionStorage.getItem("mesaDesglose");
    nomMesa= "Mesa " + nomMesa;

    fetch("../server/php/caja/caja.php",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify("total:"+nomMesa)
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){
                    if(data.length>0)
                        sessionStorage.setItem("ticket", JSON.stringify(data));
                })
                .catch(function(er){
                    console.error("Error al recibir los datos del total: " + er);
                })
        }
    })
    .catch(function(er){
        console.error("Error al solicitar info del total: " + er);
    })

}


/**
 * Función que reasigna las unidades que quedan en la cuenta
 * @param {*} btn 
 */
function reasingaUnidades(btn){

    let cod_linea_pedido= btn.attributes[0].value;
    let unidades= btn.attributes[1].value;
    unidades--;

    let arrayBtn= document.getElementsByTagName("button");

    for(let i=0;i<arrayBtn.length;i++){
        if(cod_linea_pedido == arrayBtn[i].attributes[0].value)
            arrayBtn[i].setAttribute("data-unidades", unidades);
    }
}





/**
 * Función que comprueba si quedan nodos dentro del desglose
 */
function compruebaLineasPedido(){

    let lineasPedido= document.getElementsByClassName("lineaPedido");

    let numMesa = parseInt(sessionStorage.getItem("mesaDesglose"));

    if(lineasPedido.length==0){
        fetch("../server/php/caja/caja.php",{
            method:"POST",
            headers:{"Content-Type":"appliation-json"},
            body: JSON.stringify("liberaMesa*"+numMesa)
        })
        .then(function(resp){
            if(resp.ok)
                resp.json()
                    .then(function(data){
                        if(data=="ok")
                            location.reload();
                    })
                    .catch(function(er){
                        console.error("Error al recibir la confirmación de la liberación de la mesa: " + er);
                    })
        })
        .catch(function(er){
            console.error("Error al solicitar liberar mesa: " + er);
        })
    }



}




/**
 * Función que en función de las comidas/bebidas que se vayan a pagar,
 * muestra un total u otro
 * @returns -> El valor del total
 */
function calculaTotal(){

    let todasBebidas= document.getElementsByName("bebidas"); //obtengo todos los inputs de las bebidas
    let todasComidas= document.getElementsByName("comidas") //obtengo todos los inputs de las comidas

    let total=0.0;
    let importeTotal=0.0;

    for(let i=0; i<todasBebidas.length; i++){
        importeTotal+= parseFloat(todasBebidas[i].attributes.precio.value);
        if(todasBebidas[i].checked)
            total+= parseFloat(todasBebidas[i].attributes.precio.value);
    }
        
    
    for(let j=0; j<todasComidas.length; j++){
        importeTotal+= parseFloat(todasComidas[j].attributes.precio.value);
        if(todasComidas[j].checked)
            total+= parseFloat(todasComidas[j].attributes.precio.value);
    }   
    

    // if(compruebaCookie("importeTotal")=="no encontrada") //solo se crea la primera vez
    creaCookie("importeTotal", importeTotal.toFixed(2), expiraEn(0, 10, 0));


    return total;
}

/**
 * Función que crea el teclado numérico
 * @returns -> Div que contiene el teclado
 */
function creaTeclado(){

    let div= creaNodo("div");
        div.setAttribute("id", "teclado");
    let num= [7,8,9,4,5,6,1,2,3,0,".","<<", "COBRAR"];

    for(let i=0; i<num.length; i++){

        let boton= creaNodo("button", num[i]);
            boton.setAttribute("value", num[i]);
            boton.addEventListener("click", tecladoValor);
        div.appendChild(boton);
    }

    return div;    
}

/**
 * Función que en función del botón que se pulse del teclado, hará una cosa u otra
 * . -> Ejecuta la función escribePunto()
 * << -> Ejecuta la función borraCifra()
 * COBRAR -> Ejecuta la función cobrar()
 * 
 * Cualquier nº -> Escribirá dicho número en el HTML
 */
function tecladoValor(){

    let value= parseInt(this.value); //paso a int

    if(isNaN(value)){ //es ., << o COBRAR

        let tecla= this.value;

        switch(tecla){
            case ".": escribePunto(); break;;
            case "<<": borraCifra(); break;
            case "COBRAR": cobrar(); break;
        }
    }
    else{ //es un número

        let cifra= document.getElementById("cifraEntrega").textContent;

        if(cifra==""){ //es el primer número
            document.getElementById("cifraEntrega").innerHTML+=value;
        }
        else{ //ya hay algo escrito

            let punto= cifra.indexOf(".");

            if(punto!=-1){//ya hay un punto
                let decimales= cifra.split(".")[1];
                if(decimales.length<2)
                    document.getElementById("cifraEntrega").innerHTML+=value;
            }
            else //NO hay punto, luego sigue introduciendo números
                document.getElementById("cifraEntrega").innerHTML+=value;
        }
    }
}

/**
 * Función que añade la coma.
 */
function escribePunto(){

    let cifra= document.getElementById("cifraEntrega").textContent;

    let punto= cifra.indexOf(".");

    if(punto==-1){ //NO existe aún el punto

        if(cifra!="") //NO es el primer botón que se pulsa
            document.getElementById("cifraEntrega").innerHTML+=".";
    }
    //si ya existe, NO hace nada
}

/**
 * Función que borra la cifra anterior
 */
function borraCifra(){

    let cifra= document.getElementById("cifraEntrega").textContent;

    let newCifra= cifra.substring(0, cifra.length-1);

    document.getElementById("cifraEntrega").innerHTML= newCifra;
}


/**
 * Función que se ejecuta al pulsar COBRAR
 * @returns -> No devuelve nada, el return es solo para salirse de la función
 */
function cobrar(){

    let entrega= parseFloat(document.getElementById("cifraEntrega").textContent);
    if(isNaN(entrega)){ //no entrega nada
        alert("Introduce la cifra entregada por el cliente");
        return;
    }
    let importePagar= parseFloat(document.getElementById("importePagar").textContent);

    let cambio= entrega-importePagar;

    if(cambio<0){ //si es negativo, no entregó suficiente
        alert("Importe insuficiente");
        return;
    }

    let importeCookie= parseFloat(compruebaCookie("importeTotal")); //obtengo el valor de la cookie con el TOTAL
    
    if((importeCookie-importePagar)==0){ //se paga el total
        pagado(); //modifico la tabla, pongo pagado y libero la mesa
        let expira= expiraEn(0, 0, 1);
        creaCookie("importeTotal", 0, expira); //elimino esa cookie
        alert("Cambio: " + cambio.toFixed(2)); //muestro el cambio que debe dar
    }
    else{ //pagó parte
        let resto= importeCookie - importePagar; //calculo el resto que queda por pagar
        let expira= expiraEn(0, 10, 0);      
        creaCookie("importeTotal", resto, expira); //actualizo cookie con el resto que queda por pagar
        alert("Cambio: " + cambio.toFixed(2)); //muestro el cambio que debe dar
        deshabilitaPagados();
    }

    document.getElementById("cifraEntrega").innerHTML="";
    document.getElementById("importePagar").innerHTML="0.00";
}


/**
 * Función que crea el ticket de compra
 */
var ventana=null;
function creaTicket(){

    ventana= window.open("./ticket.html");

    ventana.addEventListener("load", envia);
}

/**
 * Función que envía los datos del pedido a la ventana del ticket
 */
function envia(){

    if(ventana){
        let tbody= ventana.document.getElementById("tbody");
        let fechaHora= ventana.document.getElementById("fechaHora");

        let date= new Date();

        let dia= date.getDate()<=9?"0"+date.getDate():date.getDate();
        let mes= date.getMonth()+1;
        mes= mes<=9?"0"+mes:mes;
        let anio= date.getFullYear();

        let fecha= dia+"/"+mes+"/"+anio;
        let hora= date.getHours()<=9?"0"+date.getHours():date.getHours();
        let minu= date.getMinutes()<=9?"0"+date.getMinutes():date.getMinutes();

        let time= hora+":"+minu;

        fechaHora.innerHTML= fecha + " --- " + time;


        let datos = JSON.parse(sessionStorage.getItem("ticket")); //obtengo los datos de esa Mesa

        for(let linea of datos){

            let tr= creaNodo("tr");

            let td1= creaNodo("td", linea.unidades);
            let td2= creaNodo("td", linea.nombre_categoria + " -- " + linea.nombre_comida);
            let td3= creaNodo("td", (linea.precio_comida * linea.unidades));

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tbody.appendChild(tr);
        }

        let trf= creaNodo("tr");
        let tdf1= creaNodo("td", "---")
            tdf1.style.visibility="hidden";
        let tdf2= creaNodo("td", "TOTAL");
        let tdf3= creaNodo("td", datos[0].importe);

        trf.appendChild(tdf1);
        trf.appendChild(tdf2);
        trf.appendChild(tdf3);

        tbody.appendChild(trf);
    }
}



/**
 * Función que manda al servidor los datos del pedido que se acaba de cobrar
 */
function pagado(){    

    let cod_total_pedido= parseInt(document.getElementById("desglose").getElementsByTagName("h1")[0].id.split(":")[1]); 

    fetch("../server/php/caja/caja.php", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify("pagado:"+cod_total_pedido)
    })
    .then(function(resp){
        if(resp.ok){
            resp.json()
                .then(function(data){
                    if(data=="ok")
                        borraDesglose();
                })
                .catch(function(er){
                    console.error("Error al recibir la confirmación pagado: " + er);
                })
        }
    })
    .catch(function(er){
        console.error("Error al solicitar pagado: " + er);
    })
}

/**
 * Función que borra el desglose de la mesa seleccionada
 */
function borraDesglose(){

    let nodos= document.getElementById("desglose").childNodes;

    while(nodos.length!=0)
        nodos[0].remove();
}




/**
 * Función que deshabilita las comidas/bebidas que ya se han pagado
 */
function deshabilitaPagados(){

    //1º Recorro los inputs que esten con check == true
    let todasBebidas= document.getElementsByName("bebidas"); //obtengo todos los inputs de las bebidas
    let todasComidas= document.getElementsByName("comidas") //obtengo todos los inputs de las comidas

    //Obtengo los h2
    let bebidasGeneral= document.getElementById("bebidasGeneral");
    let comidasGeneral= document.getElementById("comidasGeneral");


    if(bebidasGeneral!=null){
        bebidasGeneral.style.opacity="40%";
        document.getElementsByName("bebidasGeneral")[0].checked=false;
        document.getElementsByName("bebidasGeneral")[0].disabled=true;

        for(let i=0; i<todasBebidas.length; i++){
            if(todasBebidas[i].checked){
                todasBebidas[i].checked=false;
                todasBebidas[i].disabled=true;
                todasBebidas[i].parentNode.parentNode.style.opacity="40%";
            }
        }
    }
        
    
    if(comidasGeneral!=null){
        comidasGeneral.style.opacity="40%";
        document.getElementsByName("comidasGeneral")[0].checked=false;
        document.getElementsByName("comidasGeneral")[0].disabled=true;
        for(let j=0; j<todasComidas.length; j++){
            if(todasComidas[j].checked){
                todasComidas[j].checked=false;
                todasComidas[j].disabled=true;
                todasComidas[j].parentNode.parentNode.style.opacity="40%";
            }
        }
    }    
}

/**
 * Función que marca/desmarca las comidas/bebidas que se van a pagar
 */
function marcaDesmarca(){

    let id= this.id; //el id del DIV
    

    let todasBebidas= document.getElementsByName("bebidas"); //obtengo todos los inputs de las bebidas
    let todasComidas= document.getElementsByName("comidas") //obtengo todos los inputs de las comidas
    
    if(id!=""){ //se ha pulsado sobre Bebidas o Comidas GENERAL

        let checkGeneral= this.childNodes[0]; //obtento el checkGeneral que se pulsó
        let chkG= checkGeneral.checked;
        checkGeneral.checked= !chkG;

        if(id=="bebidasGeneral"){ //se ha pulsado sobre Bebidas, luego tengo que marcar/desmarcar todas las bebidas

            let cheked= checkGeneral.checked; //será true o false

            for(let i=0; i<todasBebidas.length; i++){
                todasBebidas[i].checked= cheked;
            }
        }
        else if("comidasGeneral"){

            let cheked= checkGeneral.checked; //será true o false

            for(let i=0; i<todasComidas.length; i++){
                todasComidas[i].checked= cheked;
            }
        }
    }
    else{ //se ha pulsado sobre una de las líneas

        let checkLinea= this.childNodes[0].childNodes[0]; //check de la lina que se pulsó
        let chk= checkLinea.checked;
        checkLinea.checked= !chk;

        if(!checkLinea.checked){ //si la línea está a false, el check general también lo debe estar
            if(checkLinea.name=="bebidas")
                document.getElementById("checkBebidas").checked= false;
            if(checkLinea.name=="comidas")  
            document.getElementById("checkComidas").checked= false;
        }
        else{ //si la línea está a true, tengo que comprobar que todas estén a true para que el check general también se ponga
            
            if(todasBebidas.length!=0){
                let sw1=true;
                for(let i=0; i<todasBebidas.length; i++){
                    if(!todasBebidas[i].checked) //si alguna está a false entrará
                        sw1=false;
                }

                if(sw1)
                    document.getElementById("checkBebidas").checked= true;
                else
                    document.getElementById("checkBebidas").checked= false;
            }
            
            
            if(todasComidas.length!=0){
                let sw2=true;
                for(let i=0; i<todasComidas.length; i++){
                    if(!todasComidas[i].checked) //si alguna está a false entrará
                        sw2=false;
                }

                if(sw2)
                    document.getElementById("checkComidas").checked= true;
                else
                    document.getElementById("checkComidas").checked= false;
            }
        }
    }
    
    let total=0.0;    
    let importeTotal=0.0;

    for(let i=0; i<todasBebidas.length; i++){
        importeTotal+= parseFloat(todasBebidas[i].attributes.precio.value);
        if(todasBebidas[i].checked)
            total+= parseFloat(todasBebidas[i].attributes.precio.value);
    }
        
    
    for(let j=0; j<todasComidas.length; j++){
        importeTotal+= parseFloat(todasComidas[j].attributes.precio.value);
        if(todasComidas[j].checked)
            total+= parseFloat(todasComidas[j].attributes.precio.value);
    }
    
    document.getElementById("importePagar").innerHTML= total.toFixed(2);
}


