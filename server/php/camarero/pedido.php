<?php

/**
 * A este archivo me llegarán las peticiones del camarero.html/camarero.js
 */

include_once(dirname(__FILE__) . "../../../config/accesoBD.php");

// session_start();

$recibido= file_get_contents('php://input'); //aquí tengo lo que me llega del FETCH

$recibido= json_decode($recibido);

$mysqli= new mysqli(BD_SERVIDOR, BD_USUARIO, BD_PASS, BD_BASE_DATOS);

$mesa= $recibido[0][0]->mesa; //la mesa es igual en todos



//Debo comprobar si la mesa está ocupada o no.
//Si estaba libre, es el primer pedido, si está ocupada, está pidiendo algo más después de su primer pedido

$sentencia= "SELECT ocupada 
                FROM mesas 
                WHERE cod_mesa=$mesa";

$consulta= $mysqli->query($sentencia);
$ocupada;
while($fila= $consulta->fetch_assoc()){
    $ocupada= $fila["ocupada"];
}

if($ocupada=="1"){//está ocupada, luego está pidiendo algo más después de haber pedido algo

    //Debo buscar el cod_total_pedido para esa mesa
    $sentencia= "SELECT cod_total_pedido 
                    FROM total_pedido 
                    WHERE cod_mesa=$mesa AND pagado=false";

    $consulta= $mysqli->query($sentencia);
    $cod_total_pedido;
    while($fila = $consulta->fetch_assoc()){
        $cod_total_pedido= intval($fila["cod_total_pedido"]);
    }

    foreach($recibido[0] as $lineaPedido){

        $cod_comida= $lineaPedido->plato;
        $cantidad= $lineaPedido->cant;

        $sentencia= "SELECT nombre_comida, nombre_categoria, cantidad, precio 
                        FROM categorias_comidas 
                        WHERE cod_comida=$cod_comida";

        $consulta= $mysqli->query($sentencia);

        while($fila = $consulta->fetch_assoc()){  //esto SOLO me devuelve una fila
            $cantidadDB= intval($fila["cantidad"]);
            $nombre_comida= $fila["nombre_comida"];
            $nombre_categoria= $fila["nombre_categoria"];
            $precio= $fila["precio"];
        }

        $resultado=[];
        if(($cantidadDB - $cantidad) < 0){
            $comprueba[]= ["categoria"=>$nombre_categoria,
                        "comida"=> $nombre_comida,
                        "quedan" => $cantidadDB,
                        "correcto" => false
                        ];
            $resultado[]= $comprueba;
        }
    }

    if(count($resultado)>0){    
        echo json_encode($comprueba); //mando esto de vuelta al JS    
        $mysqli->close();
        exit;
    }

    //En este punto sé que quedan de TODOS los productos que se pidió, luego ya puedo hacer las inserciones

    //Inserto en lineas_pedido
    //2º Ahora ya puedo insertar en lineas_total_pedido con el cod_total_pedido insertado anteriormente
    $sw=true;
    foreach($recibido[0] as $lineaPedido){ //vuelvo a recorrer los datos que me llegan del JS y hago la inserción

        $sentencia= "SELECT esBebida, iva_repercutido
                            FROM categorias_comidas
                            WHERE cod_comida=$lineaPedido->plato";
        
        $consulta= $mysqli->query($sentencia);
        $esBebida="";
        while($fila= $consulta->fetch_assoc()){
            $esBebida=$fila["esBebida"];
            $iva= $fila["iva_repercutido"];
        }

        if($esBebida=="1") //Las bebidas pasan a estar Listas directamente, pues NO pasan por cocina
            $sentencia= "INSERT INTO `lineas_pedido`(`cod_total_pedido`, `cod_mesa`, `cod_comida`, `unidades`, `precio`, `observaciones`, `estado`, `iva`) 
                VALUES ($cod_total_pedido,$mesa,$lineaPedido->plato,$lineaPedido->cant,$lineaPedido->precio,'$lineaPedido->observ','Listo', $iva*$lineaPedido->cant)";
        else
            $sentencia= "INSERT INTO `lineas_pedido`(`cod_total_pedido`, `cod_mesa`, `cod_comida`, `unidades`, `precio`, `observaciones`, `estado`, `iva`) 
                        VALUES ($cod_total_pedido,$mesa,$lineaPedido->plato,$lineaPedido->cant,$lineaPedido->precio,'$lineaPedido->observ','En cola', $iva*$lineaPedido->cant)";
        
        $insercion= $mysqli->query($sentencia);
        if(!$insercion)
            $sw=false;
    }

    if(!$sw){ //alguna linea_total pedido no se insertó
        echo json_encode("Fallo");
        $mysqli->close();
        exit;
    }
    else{
        echo json_encode("Correcto");
        $mysqli->close();
        exit;
    }
}
else{ //está libre, luego es el primer pedido

    //Ahora hago update de mesas y pongo a true ocupada
    $sentencia= "UPDATE mesas 
                    SET ocupada=true 
                    WHERE cod_mesa=$mesa";

    $mysqli->query($sentencia); //Actualizo mesas y ocupada pasa a true


    //Antes de insertar, debo volver a comprobar que quedan suficientes de ese producto

    $comprueba=[];

    foreach($recibido[0] as $lineaPedido){ //recorro cada línea de pedido

        $cod_comida= $lineaPedido->plato;
        $cantidad= $lineaPedido->cant;

        $sentencia= "SELECT nombre_comida, nombre_categoria, cantidad, precio 
                        FROM categorias_comidas 
                        WHERE cod_comida=$cod_comida";

        $consulta= $mysqli->query($sentencia);

        while($fila = $consulta->fetch_assoc()){  //esto SOLO me devuelve una fila
            $cantidadDB= intval($fila["cantidad"]);
            $nombre_comida= $fila["nombre_comida"];
            $nombre_categoria= $fila["nombre_categoria"];
            $precio= $fila["precio"];
        }

        $resultado=[];
        if(($cantidadDB - $cantidad) < 0){
            $comprueba[]= ["categoria"=>$nombre_categoria,
                        "comida"=> $nombre_comida,
                        "quedan" => $cantidadDB,
                        "correcto" => false
                        ];
            $resultado[]= $comprueba;
        }
        
    }

    if(count($resultado)>0){    
        echo json_encode($comprueba); //mando esto de vuelta al JS    
        $mysqli->close();
        exit;
    }

    //En este punto sé que quedan de TODOS los productos que se pidió, luego ya puedo hacer las inserciones

    // 1º debo insertar en total_pedido y quedarme con el cod_total pedido generado

    $sentencia = "INSERT INTO `total_pedido`(`cod_mesa`, `fecha_hora_pagado`, `importe`, `pagado`, `fecha_inicio_pedido`, `total_iva`) 
                    VALUES ($mesa,NULL,0,false, CURRENT_TIMESTAMP, 0)";

    $insercion= $mysqli->query($sentencia);

    $sw=true;
    if($insercion){ //se ha insertado bien en total_pedido

        $sentencia= "SELECT max(cod_total_pedido) as cod_total_pedido 
                        FROM total_pedido 
                        WHERE cod_mesa=$mesa"; //me quedo con el último cod_total_pedido de esta mesa

        $consulta= $mysqli->query($sentencia);

        while($fila = $consulta->fetch_assoc()){
            $cod_total_pedido = intval($fila["cod_total_pedido"]);
        }

    //2º Ahora ya puedo insertar en lineas_total_pedido con el cod_total_pedido insertado anteriormente

        foreach($recibido[0] as $lineaPedido){ //vuelvo a recorrer los datos que me llegan del JS y hago la inserción

            $sentencia= "SELECT esBebida, iva_repercutido
                            FROM categorias_comidas
                            WHERE cod_comida=$lineaPedido->plato";
        
            $consulta= $mysqli->query($sentencia);
            $esBebida="";
            $iva=0;
            while($fila= $consulta->fetch_assoc()){
                $esBebida=$fila["esBebida"];
                floatval($iva= $fila["iva_repercutido"]);
            }

            if($esBebida=="1") //Las bebidas pasan a estar Listas directamente, pues NO pasan por cocina
                $sentencia= "INSERT INTO `lineas_pedido`(`cod_total_pedido`, `cod_mesa`, `cod_comida`, `unidades`, `precio`, `observaciones`, `estado`, `iva`)
                    VALUES ($cod_total_pedido,$mesa,$lineaPedido->plato,$lineaPedido->cant,$lineaPedido->precio,'$lineaPedido->observ','Listo', $iva*$lineaPedido->cant)";
            else
                $sentencia= "INSERT INTO `lineas_pedido`(`cod_total_pedido`, `cod_mesa`, `cod_comida`, `unidades`, `precio`, `observaciones`, `estado`, `iva`)
                            VALUES ($cod_total_pedido,$mesa,$lineaPedido->plato,$lineaPedido->cant,$lineaPedido->precio,'$lineaPedido->observ','En cola', $iva*$lineaPedido->cant)";

            $insercion= $mysqli->query($sentencia);
            if(!$insercion)
                $sw=false;            
        }
        
        
    }
    else{ //No se ha insertado en total_pedido
        echo json_encode("Fallo al insertar en total_pedido");
        $mysqli->close();
        exit;
    }

    if(!$sw){ //alguna linea_total pedido no se insertó
        echo json_encode("Fallo");
        $mysqli->close();
        exit;
    }
    else{
        echo json_encode("Correcto");
        $mysqli->close();
        exit;
    }


}











?>