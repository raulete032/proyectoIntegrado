<?php

/**
 * A este archivo me llegarán las peticiones del cocinero.html/cocinero.js
 */


include_once(dirname(__FILE__) . "../../../config/accesoBD.php");

// session_start();

$recibido= file_get_contents('php://input'); //aquí tengo lo que me llega del FETCH

$recibido= json_decode($recibido);

$mysqli= new mysqli(BD_SERVIDOR, BD_USUARIO, BD_PASS, BD_BASE_DATOS);

if(preg_match("/platosEnCola/", $recibido)){ //aquí entra para devolver los platos "En cola"

    $sentencia= "SELECT nombre_mesa, sum(unidades) AS num_platos, cod_total_pedido
                    FROM info_pedido
                    WHERE estado ='En cola'
                    GROUP BY cod_total_pedido";
    
    $consulta= $mysqli->query($sentencia);
    
    $resultado=[];

    $datos=["nombre_mesa"=>"",
            "num_platos"=>"",
            "cod_total_pedido"=>""];

    while($fila= $consulta->fetch_assoc()){
        $datos["nombre_mesa"]= $fila["nombre_mesa"];
        $datos["num_platos"]= $fila["num_platos"];
        $datos["cod_total_pedido"]= $fila["cod_total_pedido"];

        $resultado[]= $datos;
    }

    echo json_encode($resultado);
    $mysqli->close();
    exit;
}


if(preg_match("/cocinando/", $recibido)){ //aquí entra si se quiera actualizar la BD y poner en "Cocinando" una línea de pedido

    $cod_total_pedido= explode(":", $recibido)[1];
    $sw= intval(explode(":", $recibido)[2]);

    if($sw>0){ //evito que se modifique la tabla si aún hay pedidos cocinando
        echo json_encode("NO");
        exit;
    }

    $sentencia= "SELECT cod_linea_pedido, unidades
                    FROM info_pedido
                    WHERE cod_total_pedido = $cod_total_pedido AND estado='En cola'";

    $consulta= $mysqli->query($sentencia);

    $resultado=[];

    $datos=["cod_linea_pedido"=>"",
            "unidades"=>""];

    while($fila = $consulta->fetch_assoc()){
        $datos["cod_linea_pedido"]= $fila["cod_linea_pedido"];
        $datos["unidades"]= $fila["unidades"];

        $resultado[]= $datos;
    }

    //En este punto ya tengo los datos que quería, luego ya puedo hacer el update

    $sentencia= "UPDATE lineas_pedido
                        SET estado='Cocinando'
                        WHERE cod_total_pedido=$cod_total_pedido AND estado='En cola'";

    $update= $mysqli->query($sentencia);

    if(!$update){ //NO se ha actualizado
        echo json_encode("Error");
        $mysqli->close();
        exit;
    }
    else{ //se ha actualizado bien
        echo json_encode($resultado);
        $mysqli->close();
        exit;
    }
}



if(preg_match("/cocinar/", $recibido)){ //Aquí entra para mostrar los datos de la línea de pedido que se va a cocinar

    $cod_linea_pedido= explode(":", $recibido)[1];

    $sentencia= "SELECT *
                    FROM cocinar
                    WHERE cod_linea_pedido= $cod_linea_pedido";
    

    $consulta= $mysqli->query($sentencia);

    $datos=["categoria"=>"",
            "plato"=>"",
            "descripcion"=>"",
            "observaciones"=>"",
            "cod_linea"=>$cod_linea_pedido];

    while($fila= $consulta->fetch_assoc()){
        $datos["categoria"]=$fila["nombre_categoria"];
        $datos["plato"]=$fila["nombre_comida"];
        $datos["descripcion"]=$fila["descripcion"];
        $datos["observaciones"]=$fila["observaciones"];
    }

    echo json_encode($datos);
    $mysqli->close();
    exit;
}



if(preg_match("/listo/", $recibido)){ //aquí entra para actualizar la BD y poner en "Listo" una linea de pedido

    $cod_linea_pedido= explode(":", $recibido)[1];

    $sentencia= "UPDATE lineas_pedido
                    SET estado='Listo'
                    WHERE cod_linea_pedido=$cod_linea_pedido";
    
    $update= $mysqli->query($sentencia);

    if($update!=false)
        echo json_encode("correcto");
    else
        echo json_encode("incorrecto");
    
    $mysqli->close();
    exit;
}



?>

