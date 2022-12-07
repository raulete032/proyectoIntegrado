<?php

/**
 * A este archivo me llegarán la petición para iniciar sesión
 */

include_once(dirname(__FILE__) . "../../config/accesoBD.php");
$recibido= file_get_contents('php://input'); //aquí tengo lo que me llega del FETCH

$recibido= json_decode($recibido);

$mysqli= new mysqli(BD_SERVIDOR, BD_USUARIO, BD_PASS, BD_BASE_DATOS);

if(isset($recibido->cargo)){ //me llega nombre

    $mysqli->escape_string($recibido->cargo);
    $mysqli->escape_string($recibido->passw);    

    $sentencia= "SELECT * 
                FROM empleados 
                WHERE nombre='$recibido->cargo' AND password=md5($recibido->passw)";

    $consulta= $mysqli->query($sentencia);

    $mysqli->close();

    $resultado=["correcto"=> "no",
                "empleado"=> ""];

    while($fila = $consulta->fetch_assoc()){ //hay datos, es que se introdujo el empleado y la pass correctas
        $resultado["correcto"]="ok";
    }

    if($resultado["correcto"]=="ok"){
        $empleado= strtolower($recibido->cargo); //paso a minúscula

        if(preg_match("/camarero/", $empleado) || preg_match("/cocinero/", $empleado)){ //si es camarero o cocinero, tengo que quitarle el nº
            $largo= strlen($empleado)-1; //obtengo el length de la palabra
            $empleado= substr($empleado, 0, $largo);
        }        
        $resultado["empleado"]= $empleado;
    }

    echo json_encode($resultado);
    exit;
}





?>