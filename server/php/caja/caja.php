<?php

/**
 * A este archivo me llegarán las peticiones del camarero.html/caja.js
 */


include_once(dirname(__FILE__) . "../../../config/accesoBD.php");

// session_start();

$recibido= file_get_contents('php://input'); //aquí tengo lo que me llega del FETCH

$recibido= json_decode($recibido);

$mysqli= new mysqli(BD_SERVIDOR, BD_USUARIO, BD_PASS, BD_BASE_DATOS);


if(preg_match("/dibujosMesas/", $recibido)){ //aquí entra si se quiere saber si una mesa está ocupada o libre

    $sentencia= "SELECT nombre, ocupada 
                    FROM mesas";
    
    $consulta= $mysqli->query($sentencia);
    $datos=["nombre"=>"",
            "ocupada"=>""];
    
    $resultado=[];
    while($fila = $consulta->fetch_assoc()){
        $datos["nombre"]= $fila["nombre"];
        $datos["ocupada"]= $fila["ocupada"];
        $resultado[]= $datos;
    }

    echo json_encode($resultado);
    $mysqli->close();
    exit;   
}


if(preg_match("/total/", $recibido)){ //aquí entra si se quiere saber el total de una mesa determinada

    $nomMesa= explode(":", $recibido)[1]; //aquí tengo el nombre de la mesa EN MAYÚSCULAS y con el espacio en blanco

    $numMesa= explode(" ", $nomMesa)[1]; //aquí tengo el número de la mesa

    $nomMesa= "Mesa " . $numMesa; //aquí tengo Mesa xx



    $sentencia= "SELECT * 
                    FROM total
                    WHERE nombre_mesa= '$nomMesa' AND pagado=false";
    
    $consulta= $mysqli->query($sentencia);

    $datos=["cod_total_pedido"=>"",
            "cod_linea_pedido"=>"",
            "nombre_mesa"=>"",
            "unidades"=>"",
            "importe"=>"",
            "cod_comida"=>"",
            "nombre_comida"=>"",
            "precio_comida"=>"",
            "cod_categoria"=>"",
            "nombre_categoria"=>"",
            "esBebida"=>"",
            "porcentajeIVA"=>"",
            "ivaRepercutido"=>""];
    
    $resultado=[];
    while($fila = $consulta->fetch_assoc()){
        $datos["cod_total_pedido"]= $fila["cod_total_pedido"];
        $datos["cod_linea_pedido"]= $fila["cod_linea_pedido"];
        $datos["nombre_mesa"]= $fila["nombre_mesa"];
        $datos["unidades"]= $fila["unidades"];
        $datos["importe"]= $fila["importe"];
        $datos["cod_comida"]= $fila["cod_comida"];
        $datos["nombre_comida"]= $fila["nombre_comida"];
        $datos["precio_comida"]= $fila["precio_comida"];
        $datos["cod_categoria"]= $fila["cod_categoria"];
        $datos["nombre_categoria"]= $fila["nombre_categoria"];
        $datos["esBebida"]= $fila["esBebida"];
        $datos["porcentajeIVA"]= $fila["porcentajeIVA"];
        $datos["ivaRepercutido"]= $fila["ivaRepercutido"];

        $resultado[]= $datos;
    }

    echo json_encode($resultado);
    $mysqli->close();
    exit;
}




if(preg_match("/pagado/", $recibido)){//aquí para actualizar la BD reflejando que una mesa ha pagado

    $cod_total_pedido= explode(":", $recibido)[1]; //obtengo el nombre de la mesa

    $sentencia= "UPDATE total_pedido
                    SET fecha_hora_pagado= current_timestamp,
                        pagado=true
                    WHERE cod_total_pedido = $cod_total_pedido";

    $actualiza= $mysqli->query($sentencia); //actualizo la tabla total_pedido

    if($actualiza){ //se actualizó bien

        $sentencia= "SELECT cod_mesa
                        FROM total_pedido
                        WHERE cod_total_pedido=$cod_total_pedido";
        
        $consulta= $mysqli->query($sentencia);
        
        while($fila= $consulta->fetch_assoc())
            $mesa= intval($fila["cod_mesa"]);
        
        $sentencia= "UPDATE mesas
                            SET ocupada=false
                            WHERE cod_mesa=$mesa";
        
        $actualiza= $mysqli->query($sentencia);

        if($actualiza)
            echo json_encode("ok");
        else
            echo json_encode("no");
    }    
    else
        echo json_encode("no");

    $mysqli->close();
    exit;
}


if(preg_match("/quitarLinea/", $recibido)){

    $obj= json_decode(explode("*", $recibido)[1]);

    $cod_linea_pedido= $obj->cod_linea_pedido;
    $unidades= $obj->unidades;

    if($unidades==1){ //solo queda una unidad, luego debo eliminar esa línea

        $sentencia= "DELETE FROM lineas_pedido
                        WHERE cod_linea_pedido = " . $cod_linea_pedido;


    }
    else{ //hay más de una unidad, luego resto -1 unidad
        $sentencia= "UPDATE lineas_pedido
                        SET unidades = unidades-1
                        WHERE cod_linea_pedido= " . $cod_linea_pedido;

    }

    $actualiza= $mysqli->query($sentencia);

    if($actualiza)
        echo json_encode("ok");
    else
        echo json_encode("no");

    $mysqli->close();

    exit;
}



if(preg_match("/liberaMesa/", $recibido)){

    $numMesa= intval(explode("*", $recibido)[1]);

    $sentencia= "UPDATE mesas
                    SET ocupada=0
                    WHERE cod_mesa= " . $numMesa;
    
    $actualiza= $mysqli->query($sentencia);

    if($actualiza)
        echo json_encode("ok");
    else
        echo json_encode("no");

    $mysqli->close();
    exit;
}


?>