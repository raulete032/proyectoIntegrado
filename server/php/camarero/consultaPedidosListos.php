<?php


/**
 * A este archivo me llegarán las peticiones del camareroListos.html/camareroListos.js
 */


include_once(dirname(__FILE__) . "../../../config/accesoBD.php");

// session_start();

$recibido= file_get_contents('php://input'); //aquí tengo lo que me llega del FETCH

$recibido= json_decode($recibido);

$mysqli= new mysqli(BD_SERVIDOR, BD_USUARIO, BD_PASS, BD_BASE_DATOS);


if(preg_match("/comidasListas/", $recibido)){ //aquí entra para devolver las comidas que ya están listas

    $sentencia= "SELECT cod_mesa, nombre_mesa, cod_comida, nombre_comida, nombre_categoria, unidades, cod_linea_pedido
                    FROM info_pedido 
                    WHERE estado ='Listo' AND nombre_categoria <> 'Bebidas'
                    ORDER BY cod_linea_pedido";
    
    $consulta= $mysqli->query($sentencia);

    $arrayDatos=[   "cod_mesa"=>"",
                    "nombre_mesa"=>"",
                    "cod_comida"=>"",
                    "nombre_comida"=>"",
                    "nombre_categoria"=>"",
                    "unidades"=>"",
                    "cod_linea_pedido"=>""
                ];

    $resultado=[];
    while($fila= $consulta->fetch_assoc()){
        $arrayDatos["cod_mesa"]= $fila["cod_mesa"];
        $arrayDatos["nombre_mesa"]= $fila["nombre_mesa"];
        $arrayDatos["cod_comida"]= $fila["cod_comida"];
        $arrayDatos["nombre_comida"]= $fila["nombre_comida"];
        $arrayDatos["nombre_categoria"]= $fila["nombre_categoria"];
        $arrayDatos["unidades"]= $fila["unidades"];
        $arrayDatos["cod_linea_pedido"]= $fila["cod_linea_pedido"];
        
        $resultado[]= $arrayDatos;
    }


    echo json_encode($resultado);
    $mysqli->close();
    exit;
}


if(preg_match("/countComidasBebidas/", $recibido)){ //aquí entra para saber cuantas comidas/bebidas listas hay

    $sentencia= "SELECT count(*) as comidas
                    FROM info_pedido
                    WHERE estado='Listo' AND nombre_categoria<>'Bebidas'";
    
    $consulta= $mysqli->query($sentencia);

    $resultado=["comidas"=>"",
                "bebidas"=>""
                ];

    while($fila= $consulta->fetch_assoc())
                $resultado["comidas"]= $fila["comidas"];

    
    $sentencia= "SELECT count(*) as bebidas
                    FROM info_pedido
                    WHERE estado='Listo' AND nombre_categoria='Bebidas'";

    $consulta= $mysqli->query($sentencia);

    while($fila= $consulta->fetch_assoc())
                $resultado["bebidas"]= $fila["bebidas"];
    
    echo json_encode($resultado);
    $mysqli->close();
    exit;
}



if(preg_match("/bebidasListas/", $recibido)){ //aquí entra para devolver las bebidas listas

    $sentencia= "SELECT cod_mesa, nombre_mesa, cod_comida, nombre_comida, nombre_categoria, unidades, cod_linea_pedido
                    FROM info_pedido 
                    WHERE estado ='Listo' AND nombre_categoria = 'Bebidas'
                    ORDER BY cod_linea_pedido";
    
    $consulta= $mysqli->query($sentencia);

    $arrayDatos=[   "cod_mesa"=>"",
                    "nombre_mesa"=>"",
                    "cod_comida"=>"",
                    "nombre_comida"=>"",
                    "nombre_categoria"=>"",
                    "unidades"=>"",
                    "cod_linea_pedido"=>""
                ];

    $resultado=[];
    while($fila= $consulta->fetch_assoc()){
        $arrayDatos["cod_mesa"]= $fila["cod_mesa"];
        $arrayDatos["nombre_mesa"]= $fila["nombre_mesa"];
        $arrayDatos["cod_comida"]= $fila["cod_comida"];
        $arrayDatos["nombre_comida"]= $fila["nombre_comida"];
        $arrayDatos["nombre_categoria"]= $fila["nombre_categoria"];
        $arrayDatos["unidades"]= $fila["unidades"];
        $arrayDatos["cod_linea_pedido"]= $fila["cod_linea_pedido"];
        
        $resultado[]= $arrayDatos;
    }


    echo json_encode($resultado);
    $mysqli->close();
    exit;
}


if(preg_match("/pedidoServido/", $recibido)){ //aquí entra para actualizar la BD y poner en "Servido" una linea de pedido
    
    $cod_linea_pedido= intval(explode(":", $recibido)[1]);
    
    $sentencia= "UPDATE lineas_pedido
                    SET estado='Servido'
                    WHERE cod_linea_pedido=$cod_linea_pedido";

    $actualiza= $mysqli->query($sentencia);

    if($actualiza){
        $correcto=true;
        echo json_encode($correcto);
        $mysqli->close();
        exit;
    }
    else{
        $correcto=false;
        echo json_encode($correcto);
        $mysqli->close();
        exit;
    }

}



?>