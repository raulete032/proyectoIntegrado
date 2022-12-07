<?php

/**
 * A este archivo me llegarán las peticiones del camarero.html/administrador.js
 */

include_once(dirname(__FILE__) . "../../../config/accesoBD.php");

// session_start();

$recibido= file_get_contents('php://input'); //aquí tengo lo que me llega del FETCH

$recibido= json_decode($recibido);

$mysqli= new mysqli(BD_SERVIDOR, BD_USUARIO, BD_PASS, BD_BASE_DATOS);


const TAMANIO_MAX= 100000000; //10 mb
const TIPO_ARCHIVO= "image/png"; //debe ser un .png

if(preg_match("/passAcceso/", $recibido)){ //aquí se mandan al JS los enlaces para rellenar el select multiple

    $sentencia= "SELECT nombre 
                    FROM categorias
                    ORDER BY cod_categoria ASC";

    $consulta= $mysqli->query($sentencia);

    $datos=[];

    while($fila= $consulta->fetch_assoc())
        $datos[]= $fila["nombre"];

    echo json_encode($datos);
    $mysqli->close();
    exit;
}



if(preg_match("/cambioClave/", $recibido)){ //aquí entra si se quiere cambiar la clave (enlaces) para acceder a la app

    $clave= explode(":", $recibido)[1];

    $sentencia= "UPDATE acceso
                    SET password = md5('$clave')";
    
    $actualiza= $mysqli->query($sentencia);

    if($actualiza){
        echo json_encode("ok");
    }
    else
        echo json_encode("no");
    
    $mysqli->close();
    exit;
}


if(preg_match("/datosPersonal/", $recibido)){ //aquí entra si se están solicitando las imagenes de los roles

    $sentencia= "SELECT imagen
                    FROM roles";
    
    $consulta= $mysqli->query($sentencia);

    $datos=[];

    while($fila= $consulta->fetch_assoc())
        $datos[]= $fila["imagen"];

    echo json_encode($datos);
    $mysqli->close();
    exit;
}



if(preg_match("/solicitaPersonal/", $recibido)){ //aquí entra si se están solicitando los datos del personal

    $sentencia= "SELECT cod_usuario, nombre, cod_role
                    FROM empleados";
    
    $consulta= $mysqli->query($sentencia);

    $datos=[1=>[],
            2=>[],
            3=>[],
            4=>[]];

    $usuario=["cod_usuario"=>"",
              "nombre"=>""];
    while($fila = $consulta->fetch_assoc()){

        $index= $fila["cod_role"];
        $usuario["cod_usuario"]= $fila["cod_usuario"];
        $usuario["nombre"]= $fila["nombre"];

        $datos[$index][]= $usuario;
        
    }


    echo json_encode($datos);
    $mysqli->close();
    exit;
}


if(preg_match("/cambiaPassPersonal/", $recibido)){ //aquí entra si se quiere cambiar la pass de un personal determinado

    $pass= explode(":", $recibido)[1];
    $usuario= intval(explode(":", $recibido)[2]);
    

    $sentencia= "UPDATE empleados
                    SET password= md5('$pass')
                    WHERE cod_usuario= $usuario";
    
    $actualiza= $mysqli->query($sentencia);

    if($actualiza)
        echo json_encode("ok");
    else
        echo json_encode("no");
    
    $mysqli->close();
    exit;
}



if(preg_match("/fechas/", $recibido)){ //aquí entra para mostrar los pedidos en un determinado periodo
    
    $obj= json_decode(explode("*", $recibido)[1]);
    $fechaIni= $obj->fechaInicio;
    $fechaFin= $obj->fechaFin;

    $sentencia= "SELECT round(sum(importe),2) as total,
                        round(sum(total_iva),2) as total_iva
                    FROM total_pedido
                    WHERE cast(fecha_hora_pagado as date) BETWEEN cast('$fechaIni' as date) AND cast('$fechaFin' as date)";
    
    $consulta= $mysqli->query($sentencia);
    $datosIngreso=[];
    while($fila= $consulta->fetch_assoc()){
        $datosIngreso["ingresosBrutos"]= floatval($fila["total"]);
        $datosIngreso["ivaRepercutido"]= floatval($fila["total_iva"]);
        $datosIngreso["ingresosNetos"]= floatval($datosIngreso["ingresosBrutos"]-$datosIngreso["ivaRepercutido"]);
    }

    $sentencia= "SELECT cod_total_pedido
                    FROM total_pedido
                    WHERE cast(fecha_hora_pagado as date) BETWEEN cast('$fechaIni' as date) AND cast('$fechaFin' as date)";
    
    $consulta= $mysqli->query($sentencia);

    $cod_total_pedido=[];
    while($fila= $consulta->fetch_assoc())
        $cod_total_pedido[]= $fila["cod_total_pedido"];


    $resultado=[1=>$datosIngreso,
                2=>$cod_total_pedido];

    echo json_encode($resultado);
    $mysqli->close();
    exit;
}



if(preg_match("/datosPedidos/", $recibido)){ //aquí entra si se quiere mostrar los datos de un determinada comida/bebida

    $codStr= explode(":", $recibido)[1];

    $arrayCod= explode(",", $codStr);

    $datos=["cod_total_pedido"=>"",
            "mesa"=>"",
            "fecha"=>"",
            "importe"=>""];
    $resultado=[];
    foreach($arrayCod as $cod){
        $sentencia= "SELECT *
                FROM ventas
                WHERE cod_total_pedido= $cod";

        $consulta= $mysqli->query($sentencia);

        while($fila = $consulta->fetch_assoc()){
            $datos["cod_total_pedido"]= $fila["cod_total_pedido"];
            $datos["mesa"]= $fila["mesa"];
            $datos["fecha"]= $fila["fecha"];
            $datos["importe"]= $fila["importe"];
            $datos["total_iva"]= $fila["total_iva"];
            $resultado[]= $datos;
        }
    }
    
    echo json_encode($resultado);
    $mysqli->close();
    exit;
}


if(preg_match("/platosMasVendidos/", $recibido)){ //aquí entra para mostrar las comidas/bebidas más vendidas

    $sentencia= "SELECT *
                    FROM top_ventas";
    
    $consulta= $mysqli->query($sentencia);

    $datos=["cod_categoria"=>"",
            "nombre_categoria"=>"",
            "cod_comida"=>"",
            "nombre_comida"=>"",
            "vendidos"=>""];
    
    $resultado=[];

    while($fila= $consulta->fetch_assoc()){
        $datos["cod_categoria"]= $fila["cod_categoria"];
        $datos["nombre_categoria"]= $fila["nombre_categoria"];
        $datos["cod_comida"]= $fila["cod_comida"];
        $datos["nombre_comida"]= $fila["nombre_comida"];
        $datos["vendidos"]= $fila["vendidos"];

        $resultado[]= $datos;
    }

    echo json_encode($resultado);
    $mysqli->close();
    exit;
}


if(preg_match("/cartaAdmin/", $recibido)){ //aquí entra para mostrar TODAS las comidas/bebidas

    $sentencia= "SELECT *
                    FROM categorias_comidas";
    
    $consulta= $mysqli->query($sentencia);

    $datos=["cod_comida"=>"",
            "nombre_comida"=>"",
            "descripcion"=>"",
            "cantidad"=>"",
            "precio"=>"",
            "habilitado_comida"=>"",
            "cod_categoria"=>"",
            "nombre_categoria"=>"",
            "foto"=>"",
            "habilitado_categoria"=>"",
            "iva"=>""
    ];
    $resultado=[];

    while($fila= $consulta->fetch_assoc()){
        $datos["cod_comida"]= $fila["cod_comida"];
        $datos["nombre_comida"]= $fila["nombre_comida"];
        $datos["descripcion"]= $fila["descripcion"];
        $datos["cantidad"]= $fila["cantidad"];
        $datos["precio"]= $fila["precio"];
        $datos["habilitado_comida"]= $fila["habilitado_comida"];
        $datos["cod_categoria"]= $fila["cod_categoria"];
        $datos["nombre_categoria"]= $fila["nombre_categoria"];
        $datos["foto"]= $fila["foto"];
        $datos["habilitado_categoria"]= $fila["habilitado_categoria"];
        $datos["iva"]= $fila["iva"];

        $resultado[]= $datos;
    }
    $mysqli->close();
    echo json_encode($resultado);    
    exit;
}


if(preg_match("/modificaCarta/", $recibido)){ //aquí entra si se quiere modificar el precio, la carta o el stock

    $sw= explode("*", $recibido)[1];
    $obj= json_decode(explode("*", $recibido)[2]); 

    $sentencia="";
    //En función de que fetch se haya hecho entrará a una sentencia SQL u otra
    switch($sw){
        case "precio":  
                        $precio= $obj->newPrecio;
                        $cod_comida= $obj->cod_comida;
                        $iva= $obj->newIVA;

                        $sentencia= "UPDATE comidas
                                        SET precio= $precio,
                                            IVA= $iva
                                        WHERE cod_comida=$cod_comida";                        
                        break;

        case "carta":   
                        $cod_categoria= $obj->cod_categoria;
                        $nomComida= $obj->nomComida;
                        $cod_comida= $obj->cod_comida;
                        $descripcion= $obj->descripcion;
                        $ofertada= $obj->ofertada;
                        
                        if($ofertada=="SÍ")
                            $ofertada=1;
                        else 
                            $ofertada=0;
                        
                        $sentencia= "UPDATE comidas
                                        SET cod_categoria= $cod_categoria,
                                            nombre= '$nomComida',
                                            descripcion= '$descripcion',
                                            habilitado=$ofertada
                                        WHERE cod_comida=$cod_comida";
                        break;
        case "stock":   $cod_comida= $obj->cod_comida;
                        $stock= $obj->stock;
                        
                        $sentencia= "UPDATE comidas
                                        SET cantidad= $stock
                                        WHERE cod_comida=$cod_comida";
                        break;
    }

    $actualiza= $mysqli->query($sentencia);
    if($actualiza)
        echo json_encode("ok");
    else
        echo json_encode("no");

    $mysqli->close();
    exit;
}



if(preg_match("/menosDe10/", $recibido)){ //aquí entra para mostrar las comidas/bebidas con menos de 10 en stock

    $sentencia= "SELECT *
                    FROM categorias_comidas
                    WHERE cantidad<10";
    
    $consulta= $mysqli->query($sentencia);

    $datos=["cod_comida"=>"",
            "nombre_comida"=>"",
            "descripcion"=>"",
            "cantidad"=>"",
            "precio"=>"",
            "habilitado_comida"=>"",
            "cod_categoria"=>"",
            "nombre_categoria"=>"",
            "foto"=>"",
            "habilitado_categoria"=>"",
    ];
    $resultado=[];

    while($fila= $consulta->fetch_assoc()){
        $datos["cod_comida"]= $fila["cod_comida"];
        $datos["nombre_comida"]= $fila["nombre_comida"];
        $datos["descripcion"]= $fila["descripcion"];
        $datos["cantidad"]= $fila["cantidad"];
        $datos["precio"]= $fila["precio"];
        $datos["habilitado_comida"]= $fila["habilitado_comida"];
        $datos["cod_categoria"]= $fila["cod_categoria"];
        $datos["nombre_categoria"]= $fila["nombre_categoria"];
        $datos["foto"]= $fila["foto"];
        $datos["habilitado_categoria"]= $fila["habilitado_categoria"];

        $resultado[]= $datos;
    }

    echo json_encode($resultado);
    $mysqli->close();
    exit;
}


if(preg_match("/añadirComida/", $recibido)){ //aquí entra si se está añadiendo una comida/bebida

    $obj= json_decode(explode("-", $recibido)[1]);

    $cod_categoria= $obj->cod_categoria;
    $nombreComida= $obj->nom_comida;
    $descripcion= $obj->ingredientes;
    $cantidad= $obj->cantidad;
    $precio= $obj->precio;
    $habili= $obj->habilitado;
    $iva= $obj->iva;

    $sentencia= "INSERT INTO comidas (cod_categoria, nombre, descripcion, cantidad, precio, habilitado, IVA)
                VALUES ($cod_categoria, '$nombreComida', '$descripcion', $cantidad, $precio, $habili,$iva);";

    $inserta= $mysqli->query($sentencia);

    if($inserta)
        echo json_encode("ok");
    else
        echo json_encode("no");
    
    $mysqli->close();
    exit;
}


if(preg_match("/selectAnadeComida/", $recibido)){

    $sentencia= "SELECT cod_categoria, nombre
                    FROM categorias
                    ORDER BY cod_categoria ASC";
    
    $consulta= $mysqli->query($sentencia);

    $resultado=[];

    while($fila= $consulta->fetch_assoc()){
        $datos["cod_categoria"]= $fila["cod_categoria"];
        $datos["nombre_categoria"]= $fila["nombre"];
        $resultado[]=$datos;
    }

    echo json_encode($resultado);
    $mysqli->close();
    exit;
}


if(preg_match("/modificaIva/", $recibido)){

    $sw= explode("*", $recibido)[1];
    $obj= json_decode($sw); 

    $cod_categoria= intval($obj->cod_categoria);
    $porcentaje= intval($obj->porcen);
    

    $sentencia= "UPDATE comidas 
                    SET IVA= " . $porcentaje .
                    " WHERE cod_categoria= " . $cod_categoria;
    
    $query= $mysqli->query($sentencia);

    if($query)
        echo json_encode("ok");
    else
        echo json_encode("no");
    
    $mysqli->close();
    exit;
}






if(isset($_POST["creaCategoria"])){ //se ha pulsado Crear categoria
    
    $errores= [];    
    
    if($_POST["nomCategoria"]!="" && $_FILES["fotoCateg"]["name"]!="" && isset($_POST["habilitado"]) && isset($_POST["bebida"])){ //están todos los datos
        
        //Obtengo el nombre de la categoria
        $nomCategoria= $_POST["nomCategoria"];

        //Obtengo el nombre de la foto
        $nomFoto= $_FILES["fotoCateg"]["name"]; //nombre del archivo

        //Obtengo si estará o no habilitado
        $habilitado= $_POST["habilitado"];

        //Obtengo si es una bebida o no
        $esBebida= $_POST["bebida"];       

        //Primero debo comprobar si existe ya esa categoria (no puede haber dos categorias que se llamen igual)

        $sentencia= "SELECT nombre
                    FROM categorias
                    WHERE nombre= '$nomCategoria'";

        $consulta= $mysqli->query($sentencia);

        if($consulta->num_rows==0){ //no existe, luego la puedo insertar
            //obtengo el último id para añadirselo al nombre de la foto y evitar que haya dos imagenes con el mismo nombre
            $sentencia= "SELECT max(cod_categoria) as cod_categoria 
                                FROM categorias";

            $consulta= $mysqli->query($sentencia);
            $indice;

            while($fila= $consulta->fetch_assoc())
                $indice= intval($fila["cod_categoria"]);

            $indice++;
            $nomFotoInsert= str_replace(" ", "", $nomCategoria);

            $nomFotoInsert.=$indice;
            
            $type= $_FILES["fotoCateg"]["type"]; //tipo MIME del archivo
            $tmp_name= $_FILES["fotoCateg"]["tmp_name"]; //ruta temporal, luego con el move_uploaded_file se elige el destino final
            $error= $_FILES["fotoCateg"]["error"]; //si es !=0 es que hubo error
            $size= $_FILES["fotoCateg"]["size"]; //el tamaño

            if($error!=0)
                $errores["errorSubida"][]="Fallo en la subida del archivo";
            if($size>TAMANIO_MAX)
                $errores["errorTamano"][]="El archivo es demasiado pesado";
            if($type != TIPO_ARCHIVO)
                $errores["errorTipo"][]="El archivo debe ser una imagen sin fondo (.png)";

            if(!$errores){ //No hay errores

                $array=explode(".", $nomFoto);
                $extension= end($array);
                $extension= strtolower($extension);
                $nomFotoInsert.= ".".$extension; //así me aseguro que no habrá ningún otro archivo que se llame igual (evito que se sobreescriba)

                $sentencia= "INSERT INTO `categorias`(`nombre`, `foto`, `habilitado`, `esBebida`) 
                                VALUES ('$nomCategoria','$nomFotoInsert',$habilitado,$esBebida)";

                $sentencia= $mysqli->query($sentencia);
                //Una vez insertado, ahora obtengo el cod_categoria generado para combinarlo con el nombre del archivo y no haya
                //posibilidad de que se sobreescriba
                if($sentencia){
                    $RUTA_IMAGENES= $_SERVER["DOCUMENT_ROOT"];
                    $RUTA_IMAGENES.="/img/index/categorias/";   
                    move_uploaded_file($tmp_name, $RUTA_IMAGENES.$nomFotoInsert); //muevo el archivo a su ubicación definitiva
                    echo json_encode("ok");
                    exit;
                }
                else{
                    echo json_encode($errores["errorAlInsertar"][]="Fallo al insertar");
                    exit;
                }                        
            }
            else{ //hay algún error
                echo json_encode($errores);
                exit;
            }

        }
        else{//Ya existe esa categoria
            $errores["existe"][]= "Ya existe esa categoria";
            echo json_encode($errores);
            exit;
        }
    }
    else{ //falta algo

        if($_POST["nomCategoria"]==""){
            $errores["categoria"][]= "Debes poner un nombre a la categoria";
        }

        if($_FILES["fotoCateg"]["name"]==""){
            $errores["fotoCateg"][]= "Debes añadir una imagen a la categoria";
        }           
                
        $mysqli->close();
        echo json_encode($errores);
        exit;        
    }

}