<?php

/**
 * A este archivo me llegarán las peticiones del index.html/index.js
 */

include_once(dirname(__FILE__) . "../../config/accesoBD.php");

session_start();

$recibido= file_get_contents('php://input'); //aquí tengo lo que me llega del body del FETCH

$recibido= json_decode($recibido);

$mysqli= new mysqli(BD_SERVIDOR, BD_USUARIO, BD_PASS, BD_BASE_DATOS); //abro conexión a la base de datos


if($recibido=="enlacesMenu"){ //aquí entra si lo que se ha recibido es la petición para obtener los enlaces del NAV

    $sentencia = "SELECT cod_categoria, nombre 
                    FROM categorias
                    ORDER BY cod_categoria ASC";

    $consulta= $mysqli->query($sentencia);

    $arrayDatos=[   "cod_categoria"=>"",
                    "nombre"=>""
                ];

    $arrayResultado=[];

    while($fila = $consulta->fetch_assoc()){
        $arrayDatos["cod_categoria"]=$fila["cod_categoria"];
        $arrayDatos["nombre"]= $fila["nombre"];
        $arrayResultado[]=$arrayDatos;
    }
    
    echo json_encode($arrayResultado);
    $mysqli->close();
    exit;
}


if(preg_match('/^comprueba:/', $recibido)){ //si $recibido tiene "comprueba:" es que se pulsó el logo después de pulsar enlaces. Ahora hay que comprobar si la combinación es correcta

    $pass= explode(":", $recibido)[1]; //me quedo con la segunda parte (que es la clave)

    $sentencia= "SELECT * 
                    FROM acceso 
                    WHERE password=md5('$pass')";

    $consulta= $mysqli->query($sentencia);
    $resultado="no";
    while($fila = $consulta->fetch_assoc()){ //ha devuelto algo la consulta, luego la pass era correcta
        $resultado="ok";
    }  

    $clave= generaClave(); //genero una clave aleatoria

    $array=[];

    $array["resultado"]= $resultado;
    $array["clave"]=$clave;

    $_SESSION["inicio"]=$clave; //guardo la clave aleatoria en $_SESSION

    echo json_encode($array); //envio de vuelta al JavaScript la clave y el "resultado" ("no" u "ok")
    $mysqli->close();
    exit;

}

/**
 * Función que genera una clave aleatoria
 */
function generaClave(){

    $clave="";
    for($i=0; $i<=20;){
        $rand= rand(33, 125); //genero nº aleatorio entre 33 y 125
        if($rand!=58){ //el símbolo : no lo elijo nunca, ya que me sirve para separar cuando envío la clave
            $clave.= chr($rand); //lo paso a caracter
            $i++;
        }            
    }    
    return $clave;
}


if($recibido=="cartaMenu"){ //Entra aquí si se están pidiendo los datos para dibujar la carta completa

    $sentencia= "SELECT * 
                    FROM categorias_comidas
                    WHERE habilitado_comida=true AND habilitado_categoria=true";

    $consulta= $mysqli->query($sentencia);
    
    $arrayDatos=[       "cod_comida"=>"",
                        "nombre_comida"=>"",
                        "precio"=>"",
                        "nombre_categoria"=>"",
                        "descripcion"=>"",
                        "foto"=>"",
                        "cod_categoria"=>""
                ];
    

    $arrayResultado=[];

    while($fila = $consulta->fetch_assoc()){
        $arrayDatos["cod_comida"]=$fila["cod_comida"];
        $arrayDatos["nombre_comida"]=$fila["nombre_comida"];
        $arrayDatos["precio"]=$fila["precio"];
        $arrayDatos["nombre_categoria"]=$fila["nombre_categoria"];
        $arrayDatos["descripcion"]=$fila["descripcion"];
        $arrayDatos["foto"]=$fila["foto"];
        $arrayDatos["cod_categoria"]=$fila["cod_categoria"];
        

        $arrayResultado[]= $arrayDatos;
        
    }
    echo json_encode($arrayResultado); //mando los datos uno a uno
    $mysqli->close();
    exit;

}






?>