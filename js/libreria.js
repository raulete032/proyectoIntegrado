
/**
 * LIBRERÍA DE FUNCIONES
 */


/**
 * Función que crea un nodo y lo devuelve
 * @param {String} tipo -> El tipo de nodo a crear
 * @param {String} txt -> Texto que llevará, en su caso, el nodo
 * @returns -> El nodo creado
 */
 export function creaNodo(tipo, txt) {

    if (txt == undefined)
        return document.createElement(tipo);
    else {
        let nodo = document.createElement(tipo);
        let texto = document.createTextNode(txt);

        nodo.appendChild(texto);
        return nodo;
    }
}

/**
 * Función que inserta un nodo después de otro
 * @param {*} nodo -> El nodo a insertar
 * @param {*} nodoRef -> El nodo referencia
 */
export function insertAfter(nodo, nodoRef){

    if(nodoRef.nextSibling)
        nodoRef.parentNode.insertBefore(nodo, nodoRef.nextSibling);
    else
        nodoRef.parentNode.appendChild(nodo);

}



/**
 * Función que crea una cookie
 * @param {*} strg -> Nombre de la cookie
 * @param {*} value -> Valor de la cookie
 * @param {*} expira -> Momento en el que expira la cookie
 */
export function creaCookie(strg, value, expira){
   
    if(expira==undefined)
        document.cookie= strg+ "=" + value;
    else
        document.cookie= strg+ "=" + value + ";expires="+expira;
}


/**
 * Función que añade horas, minutos y segundos a la hora actual y devuelve
 * dicha hora en formato para utilizarlo para crear una cookie
 * @param {*} h -> Horas
 * @param {*} m -> Minutos
 * @param {*} s -> Segundos
 * @returns -> La nueva hora
 */
export function expiraEn(h, m, s){

    let ahora= new Date();

    ahora.setHours(ahora.getHours()+h);
    ahora.setMinutes(ahora.getMinutes()+m);
    ahora.setSeconds(ahora.getSeconds()+s);
    return ahora.toUTCString();
}


/**
 * Función que comprueba si una cookie existe.
 * En caso de que exista, devuelve su valor, en caso contrario
 * devuelve "no encontrada";
 * @param {*} strg -> Nombre de la cookie
 * @returns -> Valor de la cookie o "no encontrada"
 */
export function compruebaCookie(strg){

    if(document.cookie!=""){ //Compruebo si hay cookies

        let arrayCookies= document.cookie.split(";"); //cada cookie en un "hueco" del array

        for(let i in arrayCookies){

            if(arrayCookies[i].match(strg)){ //si ese hueco tiene la palabra que llega como parámetro entra
                
                let encontrada= arrayCookies[i].split("="); //separo la cookie por el = (tengo el nombre de la cookie y "valor")
                let value= encontrada[1].trim(); //me quedo con el valor (le quito los espacios en blanco);
                return value; //lo siento Rosi :( también me duele a mi ese return
            }
        }
        return "no encontrada";
    }
    return "no encontrada";
}


export function divideArrayEnArrays(array, valoresXfragmento){

    let newArray=[];
    let miniArray=[];
    let cont=0;
    for(let i=0; i<array.length; i++){
        
        cont++;
        miniArray.push(array[i]);

        if(cont%valoresXfragmento==0){
            newArray.push(miniArray);
            miniArray=[];
        }
    }

    if(miniArray.length>0) //si quedó algo antes de que volviera a ser multiplo de 4
        newArray.push(miniArray);


    return newArray;
}