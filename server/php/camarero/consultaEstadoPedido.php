<?php

/**
 * A este archivo me llegarán las peticiones del camarero.html/camarero.js
 */


include_once(dirname(__FILE__) . "../../../config/accesoBD.php");

// session_start();

$recibido= file_get_contents('php://input'); //aquí tengo lo que me llega del FETCH

$recibido= json_decode($recibido);

$mysqli= new mysqli(BD_SERVIDOR, BD_USUARIO, BD_PASS, BD_BASE_DATOS);


if(preg_match("/consultaEstadoPedido/", $recibido)){ //contiene "consultaEstadoPedido"

    $cod_mesa= intval(explode(":", $recibido)[1]);

    $sentencia= "SELECT * 
                    FROM info_pedido 
                    WHERE pagado=false AND cod_mesa=$cod_mesa"; //obtengo la info de la mesa, cuyo pagado==false

    $consulta= $mysqli->query($sentencia);
    $resultado=[];
    $arrayDevuelto=[];
    while($fila= $consulta->fetch_assoc()){
        $resultado["nombre_comida"]= $fila["nombre_comida"];
        $resultado["nombre_categoria"]= $fila["nombre_categoria"];
        $resultado["unidades"]= $fila["unidades"];
        $resultado["estado"]= $fila["estado"];
        $resultado["observaciones"]= $fila["observaciones"];
        $resultado["mesa"]= $fila["cod_mesa"];
        $resultado["cod_comida"] = $fila["cod_comida"];
        $resultado["cod_linea_pedido"] = $fila["cod_linea_pedido"];
        array_push($arrayDevuelto, $resultado);
    }

    echo json_encode($arrayDevuelto);
    $mysqli->close();
    exit;
}




if(preg_match("/anulaPedido/", $recibido)){ //contiene "anulaPedido"

    $cod_linea= intval(explode(":", $recibido)[1]); //me quedo con el cod_linea_pedido que se va a eliminar

    $sentencia= "DELETE FROM lineas_pedido 
                    WHERE cod_linea_pedido = $cod_linea";
    
    $delete= $mysqli->query($sentencia);

    if($delete){
        echo json_encode("Correcto");
        $mysqli->close();
        exit;
    }
    else{
        echo json_encode("Error");
        $mysqli->close();
        exit;
    }
}


if(preg_match("/modificaPedido/", $recibido)){ //contiene "modificaPedido

    $unidades= intval(explode(":", $recibido)[1]);
    $observ= explode(":", $recibido)[2];
    $cod_linea= intval(explode(":", $recibido)[3]);


    /***********************************
     * *********************************
     * ANTES DEBO COMPROBAR QUE QUEDAN SUFICIENTES EXISTENCIAS
     * *********************************
     * *********************************
     ***********************************/

     //1º debo obtener el cod_comida de esa línea
    $sentencia= "SELECT cod_comida
                    FROM lineas_pedido
                    WHERE cod_linea_pedido = $cod_linea";
    
    $consulta= $mysqli->query($sentencia);
    while($fila= $consulta->fetch_assoc())
        $cod_comida= intval($fila["cod_comida"]);

    //2º Ahora debo comprobar cuantas quedan de esa comida

    $sentencia= "SELECT cantidad
                    FROM categorias_comidas
                    WHERE cod_comida=$cod_comida";

    $consulta= $mysqli->query($sentencia);

    while($fila= $consulta->fetch_assoc())
        $cantidad= intval($fila["cantidad"]);

    if(($cantidad - $unidades)<0){
        echo json_encode("Insuficientes:".$cantidad);
        $mysqli->close();
        exit;
    }

    $sentencia= "UPDATE lineas_pedido
                SET unidades= $unidades,
                observaciones='$observ'
                WHERE cod_linea_pedido=$cod_linea";

    $actualiza= $mysqli->query($sentencia);

    if($actualiza){
        echo json_encode("Correcto");
        $mysqli->close();
        exit;
    }
    else{
        echo json_encode("Error al actualizar");
        $mysqli->close();
        exit;
    }
}


if(preg_match("/pedidosListos/", $recibido)){

    $sentencia= "SELECT count(*) as total
                    FROM info_pedido
                    WHERE estado='Listo'";
    
    $consulta= $mysqli->query($sentencia);
    $resultado=0;
    while($fila = $consulta->fetch_assoc())
        $resultado= $fila["total"];


    echo json_encode($resultado);
    $mysqli->close();
    exit;
}


?>