<?php


/**
 * A este archivo me llegarán las peticiones del camarero.html/camarero.js
 */


include_once(dirname(__FILE__) . "../../../config/accesoBD.php");

session_start();

$recibido= file_get_contents('php://input'); //aquí tengo lo que me llega del FETCH

$recibido= json_decode($recibido);

$mysqli= new mysqli(BD_SERVIDOR, BD_USUARIO, BD_PASS, BD_BASE_DATOS);


if($recibido=="datosMesas"){ //aquí entra para devolver los datos de las mesas

    $sentencia= "SELECT * 
                    FROM mesas";

    $consulta = $mysqli->query($sentencia);

    $arrayDatos= [  "cod_mesa"=>"",
                    "nombre"=>"",
                    "asientos"=>"",
                    "ocupada"=>""
                ];

    $arrayResultado=[];

    while($fila = $consulta->fetch_assoc()){
        $arrayDatos["cod_mesa"]= $fila["cod_mesa"];
        $arrayDatos["nombre"]=$fila["nombre"];
        $arrayDatos["asientos"]=$fila["asientos"];
        $arrayDatos["ocupada"]=$fila["ocupada"];

        $arrayResultado[]= $arrayDatos;
    }

    echo json_encode($arrayResultado);

    $mysqli->close();
    exit;
}


if($recibido == "botonesCategorias"){ //solicita info para crear los botones de las categorias

    $sentencia= "SELECT distinct nombre_categoria, cod_categoria 
                    FROM botones_categorias_comidas
                    WHERE habilitado_categorias=true";

    $consulta = $mysqli->query($sentencia);

    $arrayDatos =[ "cod_categoria"=>"",
                    "nombre_categoria"=>""
                ];

    $arrayResultado=[];

    while($fila = $consulta->fetch_assoc()){

        $arrayDatos["cod_categoria"]= $fila["cod_categoria"];
        $arrayDatos["nombre_categoria"]= $fila["nombre_categoria"];
        $arrayResultado[]= $arrayDatos;
    }

    echo json_encode($arrayResultado);
    $mysqli->close();
    exit;
}

if(preg_match("/botonesComida/", $recibido)){ //solicita info para los botones de las comidas

    $cod_catetoria= intval(explode(":", $recibido)[1]);

    $sentencia= "SELECT nombre_comida, cod_comida 
                    FROM botones_categorias_comidas 
                    WHERE cod_categoria=$cod_catetoria AND habilitado_comidas=true";

    $consulta= $mysqli->query($sentencia);

    $arrayDatos=[   "cod_comida"=>"",
                    "nombre_comida"=>""
                ];
    
    $arrayResultado=[];

    while($fila= $consulta->fetch_assoc()){
        $arrayDatos["cod_comida"]= $fila["cod_comida"];
        $arrayDatos["nombre_comida"]= $fila["nombre_comida"];

        $arrayResultado[]=$arrayDatos;
    }

    echo json_encode($arrayResultado);
    $mysqli->close();
    exit;
}


if(preg_match("/comidaPedida/", $recibido)){ //solicita info de la comida pedida

    $cod_comida= explode(":", $recibido)[1];

    $sentencia= "SELECT cod_comida, nombre_comida, cantidad, precio, nombre_categoria 
                    FROM categorias_comidas 
                    WHERE cod_comida=$cod_comida";

    $consulta= $mysqli->query($sentencia);

    $arrayDatos=["cod_comida"=>"",
                 "nombre_comida"=>"",
                 "cantidad"=>"",
                 "precio"=>"",
                 "nombre_categoria"=>""
                ];


    while($fila = $consulta->fetch_assoc()){
        $arrayDatos["cod_comida"]= $fila["cod_comida"];
        $arrayDatos["nombre_comida"]= $fila["nombre_comida"];
        $arrayDatos["cantidad"]= $fila["cantidad"];
        $arrayDatos["precio"]= $fila["precio"];
        $arrayDatos["nombre_categoria"]= $fila["nombre_categoria"];
    }

    echo json_encode($arrayDatos);
    $mysqli->close();
    exit;
}

?>