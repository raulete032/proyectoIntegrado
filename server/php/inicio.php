<?php

/**
 * A este archivo me llegarán las peticiones del inicio.html/inicio.js
 */

include_once(dirname(__FILE__) . "../../config/accesoBD.php");

session_start();


$recibido= file_get_contents('php://input'); //aquí tengo lo que me llega del FETCH

$recibido= json_decode($recibido, true);


if(preg_match("/clave/", $recibido)){//lo que llegó fue la comprobación de la clave
    
    $recibido= explode(":", $recibido)[1];

    if(!isset($_SESSION["inicio"])){
        echo json_encode("no");        
    }
    else{ //si está definida
        $clave= $_SESSION["inicio"];
        if($recibido==$clave)
            echo json_encode("ok");
        else
            echo json_encode("no");
    }
    
    exit;
}


if($recibido=="cargaEmpleados"){ //llegó la solicitud para cargar el Select de los empleados

    $mysqli= new mysqli(BD_SERVIDOR, BD_USUARIO, BD_PASS, BD_BASE_DATOS); //abro conexión a la base de datos

    // $sentencia= "SELECT nombre FROM empleados WHERE logeado=false";
    $sentencia= "SELECT nombre 
                    FROM empleados";
                    
    $consulta= $mysqli->query($sentencia); 

    $mysqli->close();

    $arrayResultado=[];
    while($fila = $consulta->fetch_assoc()){
        $arrayResultado[]= $fila["nombre"];
    }

    echo json_encode($arrayResultado);
    exit;
}



?>