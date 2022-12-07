-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 07-12-2022 a las 11:11:51
-- Versión del servidor: 8.0.27
-- Versión de PHP: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pollocompleto2`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `acceso`
--

DROP TABLE IF EXISTS `acceso`;
CREATE TABLE IF NOT EXISTS `acceso` (
  `cod_acceso` smallint NOT NULL AUTO_INCREMENT,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL,
  PRIMARY KEY (`cod_acceso`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `acceso`
--

INSERT INTO `acceso` (`cod_acceso`, `password`) VALUES
(1, 'c6c534844797970af875b5c9fd05fc0f');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `botones_categorias_comidas`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `botones_categorias_comidas`;
CREATE TABLE IF NOT EXISTS `botones_categorias_comidas` (
`cod_categoria` smallint
,`cod_comida` smallint
,`habilitado_categorias` tinyint(1)
,`habilitado_comidas` tinyint(1)
,`nombre_categoria` varchar(40)
,`nombre_comida` varchar(40)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

DROP TABLE IF EXISTS `categorias`;
CREATE TABLE IF NOT EXISTS `categorias` (
  `cod_categoria` smallint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL,
  `foto` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL,
  `habilitado` tinyint(1) NOT NULL DEFAULT '1',
  `esBebida` tinyint(1) NOT NULL,
  PRIMARY KEY (`cod_categoria`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`cod_categoria`, `nombre`, `foto`, `habilitado`, `esBebida`) VALUES
(1, 'Patatas asadas', 'patatasAsadas.png', 1, 0),
(2, 'Bocadillos', 'bocadillos.png', 1, 0),
(3, 'Roscas', 'roscas.png', 1, 0),
(4, 'Hamburguesas de cerdo', 'hCerdo.png', 1, 0),
(5, 'Hamburguesas de ternera', 'hTernera.png', 1, 0),
(6, 'Hamburguesas de pollo crujiente', 'hPollo.png', 1, 0),
(7, 'Hamburguesas de buey', 'hBuey.png', 1, 0),
(8, 'Hamburguesas angus', 'hAngus.png', 1, 0),
(9, 'Ensaladas', 'ensalada.png', 1, 0),
(10, 'Para picar', 'paraPicar.png', 1, 0),
(11, 'Patatas cheddar', 'patatasCheddar.png', 1, 0),
(12, 'Sandwich', 'sandwich.png', 1, 0),
(13, 'Super dog', 'superDog.png', 1, 0),
(14, 'Kebab', 'kebab.png', 1, 0),
(15, 'Tacos', 'tacos.png', 1, 0),
(16, 'Pizzas', 'pizzas.png', 1, 0),
(17, 'Bocadillos pizza', 'bocadillosPizza.png', 1, 0),
(18, 'Flautas', 'flautas.png', 1, 0),
(19, 'Camperos', 'camperos.png', 1, 0),
(20, 'Bebidas', 'bebidas.png', 1, 1);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `categorias_comidas`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `categorias_comidas`;
CREATE TABLE IF NOT EXISTS `categorias_comidas` (
`cantidad` int
,`cod_categoria` smallint
,`cod_comida` smallint
,`descripcion` varchar(300)
,`esBebida` tinyint(1)
,`foto` varchar(200)
,`habilitado_categoria` tinyint(1)
,`habilitado_comida` tinyint(1)
,`iva` int
,`iva_repercutido` double
,`nombre_categoria` varchar(40)
,`nombre_comida` varchar(40)
,`precio` float
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `cocinar`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `cocinar`;
CREATE TABLE IF NOT EXISTS `cocinar` (
`cod_categoria` smallint
,`cod_comida` smallint
,`cod_linea_pedido` smallint
,`descripcion` varchar(300)
,`nombre_categoria` varchar(40)
,`nombre_comida` varchar(40)
,`observaciones` varchar(500)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comidas`
--

DROP TABLE IF EXISTS `comidas`;
CREATE TABLE IF NOT EXISTS `comidas` (
  `cod_comida` smallint NOT NULL AUTO_INCREMENT,
  `cod_categoria` smallint NOT NULL,
  `nombre` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL,
  `descripcion` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL,
  `cantidad` int NOT NULL,
  `precio` float NOT NULL,
  `habilitado` tinyint(1) NOT NULL DEFAULT '1',
  `IVA` int DEFAULT NULL,
  `IVA_repercutido` double GENERATED ALWAYS AS (round((`precio` - (`precio` / ((`IVA` / 100) + 1))),2)) VIRTUAL,
  PRIMARY KEY (`cod_comida`),
  KEY `cod_categoria` (`cod_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=184 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `comidas`
--

INSERT INTO `comidas` (`cod_comida`, `cod_categoria`, `nombre`, `descripcion`, `cantidad`, `precio`, `habilitado`, `IVA`) VALUES
(1, 1, 'Simple', 'Sal, pimienta y ali-oli', 10, 3, 1, 10),
(2, 1, 'Normal', 'Sal, pimienta, mayonesa, tomate, jamón york, aceitunas, maíz y queso', 15, 4, 1, 10),
(3, 1, 'Pollo', 'Sal, pimienta, mayonesa, tomate, pollo y queso', 19, 4.5, 1, 10),
(4, 1, 'Marinera', 'Sal, pimienta, mayonesa, tomate, maíz, zanahoria, atún, remolacha, bocas de mar y aceitunas', 8, 5, 1, 10),
(5, 1, 'Kebab', 'Sal, pimienta, salsa yogurt, carne kebab, maíz, cebolla y queso', 7, 6.5, 1, 10),
(6, 1, 'Albahaca', 'Sal, pimienta, tomate, mayonesa, atún, york, maíz, zanahoria, remolacha, aceitunas, bocas de mar y queso', 10, 6, 1, 10),
(7, 1, 'Super papa', 'Sal, pimienta, tomate, mayonesa, atún york, pollo, maíz, zanahoria, remolacha, bocas de mar, aceitun', 8, 6.5, 1, 10),
(8, 1, 'Picante', 'Mayonesa, salsa magrebí, pollo y queso', 10, 5, 1, 10),
(9, 1, 'Pollo y sal', 'Pollo y sal', 10, 4, 1, 10),
(10, 1, 'Papa suave', 'Sal, pimienta y york', 10, 3.5, 1, 10),
(11, 1, 'Al gusto', '', 10, 7.5, 1, 10),
(12, 2, 'Pollo', 'Pechuga de pollo y queso', 11, 3, 1, 10),
(13, 2, 'Pollo completo', 'Pechuga de pollo, queso, huevo, bacon, lechuga, tomate y ali-oli', 14, 4.5, 1, 10),
(14, 2, 'Pollo y bacon', 'Pechuga de pollo, bacon, y queso', 10, 3.5, 1, 10),
(15, 2, 'Lomo', 'Lomo y queso', 10, 3, 1, 10),
(16, 2, 'Lomo completo', 'Lomo, queso, huevo, lechuga y tomate', 10, 3.5, 1, 10),
(17, 2, 'Lomo a tope', 'Lomo, queso, bacon, jamón york, lechuga, tomate y ali-oli', 12, 3, 1, 10),
(18, 2, 'Albahaca gourmet', 'Tortilla, pimiento, cochinillo, bacon, tomate, lechuga y ali-oli', 11, 4, 1, 10),
(19, 2, 'Bocadillo kebab', 'Carne kebab, queso y salsa yogurt', 12, 4, 1, 10),
(20, 2, 'Bocadillo kebab completo', 'Carne kebab, queso, huevo, salsa yogurt, lechuga, y tomate', 11, 4.5, 1, 10),
(21, 2, 'Atún', 'Atún, pimiento y mayonesa', 13, 3.5, 1, 10),
(22, 2, 'Bacon y queso', 'Bacon y queso', 10, 3, 1, 10),
(23, 2, 'Bacon completo', 'Bacon, queso, lechuga, tomate y ali-oli', 10, 3.5, 1, 10),
(24, 2, 'Serranito', 'Lomo, pimiento, jamón serrano, queso y ali-oli', 10, 4, 1, 10),
(25, 2, 'Francesa', 'Tortilla francesa y ali-oli', 10, 3.5, 1, 10),
(26, 2, 'Francesa completa', 'Tortilla francesa, queso, lechuga, tomate y ali-oli', 10, 4, 1, 10),
(27, 2, 'Catalana', 'Jamón serrano, tomate y aceite', 10, 3.5, 1, 10),
(28, 2, 'Lomo con roquefort', 'Lomo, roquefort y pimiento', 10, 4, 1, 10),
(29, 2, 'York y atún', 'York, atún, queso, lechuga, tomate y ali-oli', 10, 3.5, 1, 10),
(30, 2, 'Serranito pollo', 'Pollo, pimiento, jamón serrano, queso y ali-oli', 10, 4, 1, 10),
(31, 2, 'Salmón y atún', 'Salmón y atún', 10, 4, 1, 10),
(32, 2, 'Salmón y roquefort', 'Salmón y roquefort', 10, 4.5, 1, 10),
(33, 2, 'Ali gourmet', 'Lomo, bacon, queso, roquefort, cebolla caramelizada y tomate', 10, 4.3, 1, 10),
(34, 2, 'Al gusto', '', 10, 5.5, 1, 10),
(35, 3, 'Serrana', 'Jamón serrano, queso y tomate triturado', 11, 6, 1, 10),
(36, 3, 'Bacon', 'Bacon, queso y tomate triturado', 10, 6, 1, 10),
(37, 3, 'Lomo', 'Lomo, queso, tomate triturado y ali-oli', 7, 6, 1, 10),
(38, 3, 'Campera', 'Pollo, queso, bacon, pimiento, tomate triturado y ali-oli', 10, 6.5, 1, 10),
(39, 3, 'Albahaca', 'Atún, pimiento del piquillo y huevo duro', 10, 6, 1, 10),
(40, 3, 'Al gusto', '', 8, 7.5, 1, 10),
(41, 4, 'Normal', 'Hamburguesa, lechuga, tomate y cebolla', 10, 3, 1, 10),
(42, 4, 'Con queso', 'Hamburguesa y queso', 11, 3, 1, 10),
(43, 4, 'Completa', 'Hamburguesa, huevo, queso, cebolla, lechuga, tomate y ali-oli', 10, 3.5, 1, 10),
(44, 4, 'Albaburguer', 'Hamburguesa, queso, huevo, bacon, lechuga, tomate, cebolla y ali-oli', 11, 4, 1, 10),
(45, 5, 'Ternera normal', 'Hamburguesa, lechuga, tomate, cebolla caramelizada y ali-oli', 10, 4, 1, 10),
(46, 5, 'Ternera con queso', 'Hamburguesa, queso, y cebolla caramelizada', 10, 4, 1, 10),
(47, 5, 'Ternera completa', 'Hamburguesa, huevo, queso, cebolla caramelizada, lechuga, tomate y ali-oli', 10, 4.5, 1, 10),
(48, 5, 'Ternera a tope', 'Hamburguesa, queso, huevo, bacon, lechug, tomate, cebolla caramelizada y ali-oli', 10, 5, 1, 10),
(49, 5, 'Ternera XL', 'Hamburguesa, queso, huevo, bacon, pimientos, lechuga, tomate, cebolla caramelizada y ali-oli', 10, 6.5, 1, 10),
(50, 6, 'Normal', 'Pollo crujiente, queso, lechuga, tomate y cebolla', 11, 3.5, 1, 10),
(51, 6, 'Completa', 'Pollo crujiente, queso, huevo, bacon, lechuga, tomate y cebolla', 11, 4.5, 1, 10),
(52, 6, 'Con cebolla caramelizada', 'Pollo crujiente, queso y cebolla caramelizada', 10, 4, 1, 10),
(53, 7, 'Ternera de buey normal', 'Hamburguesa, lechuga, tomate, cebolla caramelizada y ali-oli', 10, 4.5, 1, 10),
(54, 7, 'Ternera de buey con queso', 'Hamburguesa, queso y cebolla caramelizada', 10, 4.5, 1, 10),
(55, 7, 'Ternera de buey a tope', 'Hamburguesa, queos, huevo, bacon, lechuga, tomate, cebolla caramelizada y ali-oli', 10, 6, 1, 10),
(56, 7, 'Ternera de buey super XXL', 'Doble hamburguesa, queso, huevo, bacon, lechuga, tomate, pimiento, cebolla caramelizada y ali-oli', 10, 7.5, 1, 10),
(57, 8, 'Angus normal', 'Hamburguesa, lechuga, tomate, cebolla y mayonesa', 10, 5, 1, 10),
(58, 8, 'Angus queso', 'Hamburguesa, queso y mayonesa', 10, 5.5, 1, 10),
(59, 8, 'Angus completa', 'Hamburguesa, queso, huevo, tomate, lechuga, cebolla y mayonesa', 10, 6, 1, 10),
(60, 8, 'Angus a tope', 'Hamburguesa, queso, huevo, bacon, tomate, lechuga cebolla y mayonesa', 10, 6.5, 1, 10),
(61, 9, 'Ensalada césar', 'Lechuga, pollo plancha, picatostes, queso, aceitunas negras, alcaparras y salsa César', 9, 6.5, 1, 10),
(62, 9, 'Salmón', 'Lechuga, salmón ahumado, atún, maíz, zanahoria, aceitunas verdes y aliño', 10, 6, 1, 10),
(63, 9, 'Neuces', 'Lechuga, queso, maíz, nueces, aceitunas verdes, huevo y aliño', 10, 5.5, 1, 10),
(64, 9, 'Ensalada kebab', 'Lechuga, carne kebab, y salsa yogurt', 10, 6, 1, 10),
(65, 9, 'Ensalada mixta', 'Lechuga, maíz, remolacha, zanahoria, huevo duro, aceitunas, atún, tomate y cebolla', 9, 5.5, 1, 10),
(66, 9, 'Templada', 'Lechuga, pollo, bacon, rulo cabra, tomate y picatostes', 10, 6.5, 1, 10),
(67, 10, 'Patatas fritas', '', 10, 2, 1, 10),
(68, 10, 'Alitas picantonas', '6 unidades', 10, 3, 1, 10),
(69, 10, 'Alitas con patatas', '6 unidades', 10, 5, 1, 10),
(70, 10, 'Nuggets con patatas', '6 unidades', 10, 5.5, 1, 10),
(71, 10, 'Finger con patatas', '8 unidades', 10, 6, 1, 10),
(72, 10, 'Minicroquetas con patatas', '10 unidades', 10, 5, 1, 10),
(73, 10, 'Flamenquín con patatas', '', 10, 3.5, 1, 10),
(74, 10, 'Super flamenquín con patatas', '', 10, 5.5, 1, 10),
(75, 10, 'Filetillos con patatas', 'Lomo o pollo', 10, 7, 1, 10),
(76, 10, 'Patatas gratinadas', 'Patatas y mozzarella', 10, 4.5, 1, 10),
(77, 10, 'Patatas con pollo gratinado', 'Patatas, pollo picado, mozzarella y bacon', 10, 6.5, 1, 10),
(78, 10, 'Patatas crujientes con sazonador', '', 10, 2.5, 1, 10),
(79, 11, 'Patatas con salsa cheddar', '', 10, 4.5, 1, 10),
(80, 11, 'Patatas con bacon y cheddar', '', 10, 5.5, 1, 10),
(81, 11, 'Patatas con pollo bacon y cheddar', '', 10, 6.5, 1, 10),
(82, 11, 'Patatas con pollo, bacon, york y cheddar', '', 10, 7.5, 1, 10),
(83, 12, 'Mixto', 'Jamón york y queso', 11, 2.5, 1, 10),
(84, 12, 'Tortilla', 'Tortilla, jamón york y queso', 11, 3, 1, 10),
(85, 12, 'Pollo', 'Pollo, lechuga, tomate, queso y mayonesa', 10, 3.5, 1, 10),
(86, 12, 'Pollo asado', 'Pollo asado, queso, lechuga, tomate, mayonesa', 10, 4, 1, 10),
(87, 12, 'Sandwich completo', 'Pollo, bacon, queso, roquefort, lechuga, tomate y mayonesa', 10, 3.8, 1, 10),
(88, 12, 'Kebab', 'Carne kebab, salsa yogurt, queso y lechuga', 8, 3.5, 1, 10),
(89, 12, 'Serrano', 'Jamón serrano y queso', 10, 3, 1, 10),
(90, 12, 'Atún', 'Atún, lechuga, tomate y mayonesa', 8, 3, 1, 10),
(91, 13, 'Perrito simple', 'Salchicha, ketchup, mayonesa y queso', 8, 3, 1, 10),
(92, 13, 'Perrito normal', 'Salchicha, ketchup, mayonesa, cebolla y queso', 11, 3.5, 1, 10),
(93, 13, 'Perrito completo', 'Salchicha, ketchup, mayonesa, cebolla, bacon, patatas y queso', 9, 4, 1, 10),
(94, 13, 'Perrito a tope', 'Salchicha, ketchup, mayonesa, cebolla, bacon, tortilla, patatas y queso', 10, 4.5, 1, 10),
(95, 14, 'Normal', 'Carne kebab, lechuga, tomate, cebolla y salsa yogurt', 10, 3.5, 1, 10),
(96, 14, 'Con queso', 'Carne kebab, queso, lechuga, tomate, cebolla y salsa yogurt', 10, 4, 1, 10),
(97, 14, 'Completo', 'Carne kebab, queso, huevo, lechuga, tomate, cebolla, y salsa yogurt', 10, 4.5, 1, 10),
(98, 14, 'Plato kebab', 'Carne kebab, salsa yogurt y patatas', 10, 5.5, 1, 10),
(99, 14, 'Alikebab', 'Carne kebab, huevo, lechuga, tomate, cebolla, salsa yogurt, zanahoria rallada, aceitunas y maíz', 10, 5.5, 1, 10),
(100, 14, 'Plato kebab y patatas gratinadas', 'Carne kebab, salsa yogurt, patatas, queso fundido y bacon', 10, 7.5, 1, 10),
(101, 15, 'Simple', 'Carne de taco y lechuga', 11, 3, 1, 10),
(102, 15, 'Normal', 'Carne de taco, maíz, tomate y lechuga', 10, 3.5, 1, 10),
(103, 16, 'Margarita', 'Tomate, mozzarella y orégano', 10, 6.5, 1, 10),
(104, 16, 'Margarita york', 'Tomate, mozzarella, jamón york y orégano', 15, 8, 1, 10),
(105, 16, 'Bacon', 'Tomate, mozzarella, bacon y orégano', 10, 8, 1, 10),
(106, 16, 'Jamón york y bacon', 'Tomate, mozzarella, jamón york, bacon y orégano', 10, 8.5, 1, 10),
(107, 16, 'Atún', 'Tomate, mozzarella, atún, cebolla y orégano', 10, 8, 1, 10),
(108, 16, '4 estaciones', 'Tomate, mozzarella, jamón york, bacon, atún, champiñones, aceitunas y orégano', 10, 9, 1, 10),
(109, 16, 'Carbonara', 'Nata, mozzarella, bacon, champiñones, pollo y orégano', 10, 8.5, 1, 10),
(110, 16, 'Marinera', 'Tomate, mozzarella, atún, gambas, bocas de mar y orégano', 10, 8.5, 1, 10),
(111, 16, 'Tropical', 'Tomate, mozzarella, jamón york, piña y orégano', 10, 8.5, 1, 10),
(112, 16, '3 quesos', 'Tomate, mozzarella, emental, gouda y orégano', 10, 8.5, 1, 10),
(113, 16, '4 quesos', 'Tomate, mozzarella, emental, roquefort, gouda, parmesano y orégano', 10, 9, 1, 10),
(114, 16, 'Caprichosa', 'Tomate, mozzarella, jamón york, champiñones y orégano', 10, 8.5, 1, 10),
(115, 16, 'Kebab', 'Tomate, mozzarella, carne kebab, cebolla, salsa yougurt y orégano', 10, 9.5, 1, 10),
(116, 16, 'Barbacoa', 'Tomate, mozzarella, jamón serrano, cochinillo, aceitunas, salsa barbacoa y orégano', 10, 9, 1, 10),
(117, 16, 'Vegetariana albahaca', 'Tomate, mozzarella, zanahoria, maíz, aceitunas, cebolla, champiñones, pimiento, albahaca y orégano', 10, 8.5, 1, 10),
(118, 16, 'Troyana', 'Tomate, mozzarella, salmón, roquefort, alcaparras, aceituyas y orégano', 10, 10, 1, 10),
(119, 16, 'Rústica', 'Tomate, mozzarella, pollo, magreta, huevo de codorniz, aceitunas y orégano', 10, 10, 1, 10),
(120, 16, 'Fuente grande', 'Tomate, mozzarella, jamón york, jamón serrano, tres quesos, cebolla y orégano', 10, 10, 1, 10),
(121, 16, 'Fuente chica', 'Tomate, mozzarella, pollo, cebolla, pimiento verde, pimiento morrón y orégano', 10, 9.5, 1, 10),
(122, 16, 'Alpujarreña', 'Tomate, mozzarella, jamón serrano, chorizo, huevo y orégano', 10, 9.5, 1, 10),
(123, 16, 'Montana', 'Tomate, mozzarella, salsa goucha, salchichas, cochinillo, huevo, aceitunas y orégano', 10, 10, 1, 10),
(124, 16, 'Bacon pollo', 'Tomate, mozzarella, bacon, pollo y orégano', 10, 9, 1, 10),
(125, 16, 'York pollo', 'Tomate, mozzarella, jamón york, pollo y orégano', 10, 9, 1, 10),
(126, 16, 'Atún con york y pollo', 'Tomate, mozzarella, atún, jamón york, pollo y orégano', 10, 9, 1, 10),
(127, 16, 'Pollo asado', 'Tomate, mozzarella, pollo asado, cebolla y orégano', 10, 9.5, 1, 10),
(128, 16, 'Pollo asado con salsa goucha', 'Tomate, mozzarella, pollo asado, cebolla, bacon, salsa goucha y orégano', 10, 10, 1, 10),
(129, 16, 'Mexicana', 'Tomate, mozzarella, carne taco, pimiento verde, pimiento rojo, maíz, cebolla, tabasco y orégano', 10, 10, 1, 10),
(130, 16, 'Pizza taco', 'Tomate, mozzarella, carne taco y orégano', 10, 9.5, 1, 10),
(131, 16, 'Serrana', 'Tomate, mozzarella, jamón serrano y orégano', 10, 9, 1, 10),
(132, 16, 'Frankfurt', 'Tomate, mozzarella, salchichas, huevo, bacon, cebolla y orégano', 10, 9, 1, 10),
(133, 16, 'Pizza dulce', 'Nutella y lacasitos', 10, 6.5, 1, 10),
(134, 16, 'Al gusto', '', 10, 11, 1, 10),
(135, 17, 'Chapa pizza', '', 7, 5.5, 1, 10),
(136, 17, 'Gourmet pizza', '', 10, 5, 1, 10),
(137, 17, 'Baguete pizza', '', 10, 4.5, 1, 10),
(138, 18, 'York queso', 'Jamón york y queso', 10, 3.5, 1, 10),
(139, 18, 'Pollo', 'Pollo marinado, 3 quesos y queso gouda', 10, 4, 1, 10),
(140, 18, 'York pollo', 'Jamón york, pollo marinado, 3 quesos y queso gouda', 10, 4.5, 1, 10),
(141, 18, 'Super flauta', 'Jamón york, pollo, maíz, queos, mayonesa, cebolla caramelizada y lechuga', 10, 5, 1, 10),
(142, 19, 'Normal', 'Jamón york, queso, lechuga, tomate y ali-oli', 10, 3, 1, 10),
(143, 19, 'Super', 'Jamón york, pollo, queso, lechuga, tomate y ali-oli', 10, 3.5, 1, 10),
(144, 19, 'Pollo', 'Pollo, huevo, bacon queso, lechuga, tomate y ali-oli', 10, 4, 1, 10),
(145, 19, 'Lomo', 'Lomo, huevo, bacon, queso, lechuga, tomate y ali-oli', 10, 4, 1, 10),
(146, 19, 'Kebab', 'Carne kebab, queso, huevo, lechuga, tomate y salsa yogurt', 10, 4.5, 1, 10),
(147, 19, 'Atún', 'Atún, lechuga, tomate y ali-oli', 10, 3, 1, 10),
(148, 19, 'York y atún', 'Jamón york, atún, queso, lechuga, tomate y ali-oli', 10, 3.3, 1, 10),
(149, 19, 'Vegetal', 'Cebolla, tomate, zanahoria, huevo duro, lechuga y ali-oli', 10, 3, 1, 10),
(150, 19, 'Vegetal de atún', 'Atú, cebolla, tomate, zanahoria, huevo duro, lechuga y ali-oli', 10, 3.4, 1, 10),
(151, 19, 'Pollo asado', 'Pollo asado, queso, lechuga, tomate y ali-oli', 10, 4.3, 1, 10),
(152, 19, 'Pollo asado completo', 'Pollo asado, queso, huevo, lechuga, tomate y ali-oli', 10, 4.8, 1, 10),
(153, 19, 'Pollo asado a tope', 'Pollo asado, queso, huevo, bacon, lechuga, tomate y ali-oli', 10, 5, 1, 10),
(154, 19, 'Pollo con lechuga', 'Pollo, lechuga y ali-oli', 10, 3, 1, 10),
(155, 19, 'Campero XL', 'Pollo o lomo, huevo, bacon, cebolla caramelizada, rulo cabra, jamón york, cochinillo, lechuga, tomat', 10, 5.5, 1, 10),
(156, 20, 'Coca-cola', '', 10, 1.5, 1, 10),
(157, 20, 'Fanta', '', 18, 1.5, 1, 10),
(158, 20, 'Nestea', '', 12, 1.5, 1, 10),
(159, 20, 'Aquarius', '', 14, 1.5, 1, 10),
(160, 20, 'Shandy', '', 11, 1.2, 1, 21),
(161, 20, 'San miguel', '', 11, 1.2, 1, 21),
(162, 20, 'San miguel 0,0', '', 10, 1.2, 1, 10),
(163, 20, 'Alambra reserva', '', 10, 2, 1, 21),
(164, 20, 'Alambra roja', '', 10, 2.5, 1, 21),
(165, 20, 'Zumo mandarina', '', 7, 1.5, 1, 10),
(166, 20, 'Zumo naranja', '', 10, 1.5, 1, 10),
(167, 20, 'Zumo piña', '', 10, 1.5, 1, 10),
(168, 20, 'Zumo melocotón', '', 12, 1.5, 1, 10),
(169, 20, 'Agua', '', 10, 1.5, 1, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

DROP TABLE IF EXISTS `empleados`;
CREATE TABLE IF NOT EXISTS `empleados` (
  `cod_usuario` smallint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL,
  `password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL,
  `cod_role` smallint NOT NULL,
  PRIMARY KEY (`cod_usuario`),
  KEY `cod_role` (`cod_role`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`cod_usuario`, `nombre`, `password`, `cod_role`) VALUES
(1, 'Camarero1', '25d55ad283aa400af464c76d713c07ad', 1),
(2, 'Camarero2', '25d55ad283aa400af464c76d713c07ad', 1),
(3, 'Camarero3', '25d55ad283aa400af464c76d713c07ad', 1),
(4, 'Cocinero1', '25d55ad283aa400af464c76d713c07ad', 2),
(5, 'Cocinero2', '25d55ad283aa400af464c76d713c07ad', 2),
(6, 'Cocinero3', '25d55ad283aa400af464c76d713c07ad', 2),
(7, 'Cocinero4', '25d55ad283aa400af464c76d713c07ad', 2),
(8, 'Caja', '25d55ad283aa400af464c76d713c07ad', 3),
(9, 'Administrador', '25d55ad283aa400af464c76d713c07ad', 4);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `info_pedido`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `info_pedido`;
CREATE TABLE IF NOT EXISTS `info_pedido` (
`cod_categoria` smallint
,`cod_comida` smallint
,`cod_linea_pedido` smallint
,`cod_mesa` smallint
,`cod_total_pedido` smallint
,`estado` varchar(50)
,`nombre_categoria` varchar(40)
,`nombre_comida` varchar(40)
,`nombre_mesa` varchar(50)
,`observaciones` varchar(500)
,`pagado` tinyint(1)
,`unidades` smallint
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lineas_pedido`
--

DROP TABLE IF EXISTS `lineas_pedido`;
CREATE TABLE IF NOT EXISTS `lineas_pedido` (
  `cod_linea_pedido` smallint NOT NULL AUTO_INCREMENT,
  `cod_total_pedido` smallint NOT NULL,
  `cod_mesa` smallint NOT NULL,
  `cod_comida` smallint NOT NULL,
  `unidades` smallint NOT NULL,
  `precio` double NOT NULL,
  `observaciones` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `estado` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL,
  `iva` double NOT NULL,
  PRIMARY KEY (`cod_linea_pedido`),
  KEY `cod_factura` (`cod_total_pedido`),
  KEY `cod_comida` (`cod_comida`),
  KEY `cod_mesa` (`cod_mesa`)
) ENGINE=InnoDB AUTO_INCREMENT=441 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `lineas_pedido`
--

INSERT INTO `lineas_pedido` (`cod_linea_pedido`, `cod_total_pedido`, `cod_mesa`, `cod_comida`, `unidades`, `precio`, `observaciones`, `estado`, `iva`) VALUES
(352, 165, 3, 38, 1, 6.5, '', 'Servido', 0.59),
(353, 165, 3, 40, 1, 7.5, '', 'Servido', 0.68),
(354, 165, 3, 13, 2, 4.5, '', 'Servido', 0.82),
(355, 165, 3, 1, 1, 3, '', 'Servido', 0.27),
(356, 165, 3, 2, 1, 4, '', 'Servido', 0.36),
(357, 165, 3, 4, 1, 5, '', 'Servido', 0.45),
(358, 166, 14, 37, 1, 6, '', 'Servido', 0.55),
(359, 166, 14, 38, 1, 6.5, '', 'Servido', 0.59),
(360, 166, 14, 40, 1, 7.5, '', 'Servido', 0.68),
(361, 167, 1, 3, 1, 4.5, '', 'Servido', 0.41),
(362, 167, 1, 5, 1, 6.5, '', 'Servido', 0.59),
(363, 167, 1, 7, 1, 6.5, '', 'Servido', 0.59),
(364, 168, 1, 1, 2, 3, '', 'Servido', 0.54),
(365, 168, 1, 2, 1, 4, '', 'Servido', 0.36),
(366, 168, 1, 4, 1, 5, '', 'Servido', 0.45),
(367, 168, 1, 157, 2, 1.5, '', 'Servido', 0.28),
(368, 168, 1, 159, 1, 1.5, '', 'Servido', 0.14),
(383, 175, 8, 37, 1, 6, '', 'Servido', 0.55),
(384, 175, 8, 38, 1, 6.5, '', 'Servido', 0.59),
(388, 177, 12, 36, 1, 6, '', 'Servido', 0.55),
(415, 184, 1, 5, 3, 6.5, '', 'Servido', 1.77),
(416, 184, 1, 7, 1, 6.5, '', 'Servido', 0.59),
(417, 185, 2, 65, 1, 5.5, '', 'Servido', 0.5),
(418, 185, 2, 63, 1, 5.5, '', 'Servido', 0.5),
(419, 185, 2, 61, 1, 6.5, '', 'Servido', 1.18),
(420, 185, 2, 62, 1, 6, '', 'Servido', 1.1),
(421, 186, 3, 93, 1, 4, '', 'Servido', 0.36),
(422, 186, 3, 91, 2, 3, '', 'Servido', 0.54),
(424, 187, 4, 156, 1, 1.5, '', 'Servido', 0.28),
(425, 187, 4, 158, 1, 1.5, '', 'Servido', 0.14),
(426, 187, 4, 37, 1, 6, '', 'Servido', 1.1),
(427, 188, 5, 101, 1, 3, '', 'Servido', 0.27),
(428, 188, 5, 102, 1, 3.5, '', 'Servido', 0.32),
(429, 189, 6, 90, 2, 3, '', 'Servido', 0.54),
(430, 189, 6, 88, 2, 3.5, '', 'Servido', 0.64),
(431, 189, 6, 159, 1, 1.5, '', 'Servido', 0.14),
(432, 189, 6, 161, 1, 1.2, '', 'Servido', 0.21),
(433, 189, 6, 163, 1, 2, '', 'Servido', 0.35),
(434, 189, 6, 165, 3, 1.5, '', 'Servido', 0.42),
(436, 190, 7, 166, 1, 1.5, '', 'Servido', 0.14),
(437, 191, 8, 135, 1, 5.5, '', 'Servido', 0.5),
(439, 192, 10, 135, 2, 5.5, '', 'Servido', 1);

--
-- Disparadores `lineas_pedido`
--
DROP TRIGGER IF EXISTS `ad_lineas_pedido`;
DELIMITER $$
CREATE TRIGGER `ad_lineas_pedido` AFTER DELETE ON `lineas_pedido` FOR EACH ROW BEGIN
UPDATE total_pedido 
	SET importe = (SELECT SUM(precio * unidades) 
	FROM lineas_pedido
    WHERE cod_total_pedido = OLD.cod_total_pedido)
WHERE cod_total_pedido= old.cod_total_pedido;

UPDATE comidas 
	SET cantidad = cantidad + old.unidades
    WHERE cod_comida = old.cod_comida;    
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `ai_lineas_pedido`;
DELIMITER $$
CREATE TRIGGER `ai_lineas_pedido` AFTER INSERT ON `lineas_pedido` FOR EACH ROW BEGIN
UPDATE total_pedido 
SET importe = (SELECT SUM(precio * unidades) 
        FROM lineas_pedido 
        WHERE cod_total_pedido = new.cod_total_pedido),
   total_iva= (SELECT sum(iva)
               FROM lineas_pedido
               WHERE cod_total_pedido= new.cod_total_pedido)
WHERE cod_total_pedido= new.cod_total_pedido;
UPDATE comidas 
	SET cantidad = (cantidad - new.unidades)
    WHERE cod_comida = new.cod_comida;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `au_lineas_pedido`;
DELIMITER $$
CREATE TRIGGER `au_lineas_pedido` AFTER UPDATE ON `lineas_pedido` FOR EACH ROW BEGIN
UPDATE total_pedido 
	SET importe = (SELECT SUM(precio * unidades) 
	FROM lineas_pedido
    WHERE cod_total_pedido = OLD.cod_total_pedido)
WHERE cod_total_pedido = old.cod_total_pedido;
   
UPDATE comidas
	SET cantidad = (cantidad - (new.unidades - old.unidades))
    WHERE cod_comida=old.cod_comida;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mesas`
--

DROP TABLE IF EXISTS `mesas`;
CREATE TABLE IF NOT EXISTS `mesas` (
  `cod_mesa` smallint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL,
  `asientos` tinyint NOT NULL,
  `ocupada` tinyint(1) NOT NULL,
  PRIMARY KEY (`cod_mesa`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `mesas`
--

INSERT INTO `mesas` (`cod_mesa`, `nombre`, `asientos`, `ocupada`) VALUES
(1, 'Mesa 1', 4, 0),
(2, 'Mesa 2', 6, 0),
(3, 'Mesa 3', 8, 0),
(4, 'Mesa 4', 2, 0),
(5, 'Mesa 5', 2, 0),
(6, 'Mesa 6', 4, 1),
(7, 'Mesa 7', 4, 1),
(8, 'Mesa 8', 6, 1),
(9, 'Mesa 9', 4, 0),
(10, 'Mesa 10', 4, 0),
(11, 'Mesa 11', 10, 0),
(12, 'Mesa 12', 4, 0),
(13, 'Mesa 13', 4, 0),
(14, 'Mesa 14', 4, 0),
(15, 'Mesa 15', 4, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `cod_role` smallint NOT NULL AUTO_INCREMENT,
  `nombre_role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL,
  `imagen` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL,
  PRIMARY KEY (`cod_role`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`cod_role`, `nombre_role`, `imagen`) VALUES
(1, 'Camarero', 'camarero.png'),
(2, 'Cocinero', 'cocinero.png'),
(3, 'Caja', 'caja.png'),
(4, 'Administrador', 'administrador.png');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `top_ventas`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `top_ventas`;
CREATE TABLE IF NOT EXISTS `top_ventas` (
`cod_categoria` smallint
,`cod_comida` smallint
,`nombre_categoria` varchar(40)
,`nombre_comida` varchar(40)
,`vendidos` decimal(27,0)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `total`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `total`;
CREATE TABLE IF NOT EXISTS `total` (
`cod_categoria` smallint
,`cod_comida` smallint
,`cod_linea_pedido` smallint
,`cod_total_pedido` smallint
,`esBebida` tinyint(1)
,`estado` varchar(50)
,`importe` double
,`ivaRepercutido` double
,`nombre_categoria` varchar(40)
,`nombre_comida` varchar(40)
,`nombre_mesa` varchar(50)
,`pagado` tinyint(1)
,`porcentajeIVA` int
,`precio_comida` float
,`unidades` smallint
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `total_pedido`
--

DROP TABLE IF EXISTS `total_pedido`;
CREATE TABLE IF NOT EXISTS `total_pedido` (
  `cod_total_pedido` smallint NOT NULL AUTO_INCREMENT,
  `cod_mesa` smallint NOT NULL,
  `fecha_hora_pagado` datetime DEFAULT NULL,
  `importe` double NOT NULL,
  `pagado` tinyint(1) NOT NULL,
  `fecha_inicio_pedido` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_iva` decimal(10,2) NOT NULL,
  PRIMARY KEY (`cod_total_pedido`),
  KEY `cod_mesa` (`cod_mesa`)
) ENGINE=InnoDB AUTO_INCREMENT=193 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `total_pedido`
--

INSERT INTO `total_pedido` (`cod_total_pedido`, `cod_mesa`, `fecha_hora_pagado`, `importe`, `pagado`, `fecha_inicio_pedido`, `total_iva`) VALUES
(165, 3, '2022-10-01 15:43:53', 35, 1, '2022-10-01 15:00:51', '3.17'),
(166, 14, '2022-10-01 15:44:00', 20, 1, '2022-10-01 15:41:45', '1.82'),
(167, 1, '2022-10-01 15:43:47', 17.5, 1, '2022-10-01 15:41:51', '1.59'),
(168, 1, '2022-10-02 18:28:36', 19.5, 1, '2022-10-01 17:15:48', '1.77'),
(175, 8, '2022-10-16 13:31:07', 12.5, 1, '2022-10-16 13:29:46', '1.14'),
(176, 1, NULL, 0, 0, '2022-10-19 22:30:56', '1.23'),
(177, 12, '2022-10-28 20:52:09', 6, 1, '2022-10-19 22:46:33', '1.49'),
(178, 2, NULL, 0, 0, '2022-10-28 23:08:07', '2.34'),
(179, 10, NULL, 0, 0, '2022-10-28 23:08:16', '2.14'),
(180, 14, NULL, 0, 0, '2022-10-28 23:08:24', '1.26'),
(181, 15, NULL, 0, 0, '2022-10-28 23:08:35', '3.63'),
(182, 1, NULL, 0, 0, '2022-10-29 00:03:18', '2.16'),
(183, 1, NULL, 0, 0, '2022-10-29 00:18:54', '1.09'),
(184, 1, '2022-10-29 11:45:32', 26, 1, '2022-10-29 11:31:16', '2.36'),
(185, 2, '2022-10-29 11:59:47', 23.5, 1, '2022-10-29 11:31:25', '3.28'),
(186, 3, '2022-10-29 11:49:59', 10, 1, '2022-10-29 11:31:32', '0.90'),
(187, 4, '2022-10-29 15:36:09', 9, 1, '2022-10-29 11:31:44', '1.80'),
(188, 5, '2022-10-29 11:49:05', 6.5, 1, '2022-10-29 11:31:55', '0.59'),
(189, 6, NULL, 22.2, 0, '2022-10-29 11:32:13', '2.30'),
(190, 7, NULL, 1.5, 0, '2022-10-29 11:32:21', '1.43'),
(191, 8, NULL, 5.5, 0, '2022-10-29 11:32:30', '0.95'),
(192, 10, '2022-10-29 11:58:16', 11, 1, '2022-10-29 11:34:57', '1.45');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `ventas`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `ventas`;
CREATE TABLE IF NOT EXISTS `ventas` (
`cod_total_pedido` smallint
,`fecha` date
,`importe` double
,`mesa` varchar(50)
,`total_iva` decimal(10,2)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `botones_categorias_comidas`
--
DROP TABLE IF EXISTS `botones_categorias_comidas`;

DROP VIEW IF EXISTS `botones_categorias_comidas`;
CREATE ALGORITHM=UNDEFINED DEFINER=`raul`@`localhost` SQL SECURITY DEFINER VIEW `botones_categorias_comidas` (`cod_categoria`, `nombre_categoria`, `habilitado_categorias`, `cod_comida`, `nombre_comida`, `habilitado_comidas`) AS    select `a`.`cod_categoria` AS `cod_categoria`,`a`.`nombre` AS `nombre`,`a`.`habilitado` AS `habilitado`,`b`.`cod_comida` AS `cod_comida`,`b`.`nombre` AS `nombre`,`b`.`habilitado` AS `habilitado` from (`categorias` `a` join `comidas` `b` on((`a`.`cod_categoria` = `b`.`cod_categoria`)))   ;

-- --------------------------------------------------------

--
-- Estructura para la vista `categorias_comidas`
--
DROP TABLE IF EXISTS `categorias_comidas`;

DROP VIEW IF EXISTS `categorias_comidas`;
CREATE ALGORITHM=UNDEFINED DEFINER=`raul`@`localhost` SQL SECURITY DEFINER VIEW `categorias_comidas` (`cod_comida`, `nombre_comida`, `descripcion`, `cantidad`, `precio`, `habilitado_comida`, `iva_repercutido`, `iva`, `cod_categoria`, `nombre_categoria`, `foto`, `habilitado_categoria`, `esBebida`) AS    select `a`.`cod_comida` AS `cod_comida`,`a`.`nombre` AS `nombre`,`a`.`descripcion` AS `descripcion`,`a`.`cantidad` AS `cantidad`,`a`.`precio` AS `precio`,`a`.`habilitado` AS `habilitado`,`a`.`IVA_repercutido` AS `iva_repercutido`,`a`.`IVA` AS `iva`,`b`.`cod_categoria` AS `cod_categoria`,`b`.`nombre` AS `nombre`,`b`.`foto` AS `foto`,`b`.`habilitado` AS `habilitado`,`b`.`esBebida` AS `esBebida` from (`comidas` `a` join `categorias` `b` on((`a`.`cod_categoria` = `b`.`cod_categoria`)))   ;

-- --------------------------------------------------------

--
-- Estructura para la vista `cocinar`
--
DROP TABLE IF EXISTS `cocinar`;

DROP VIEW IF EXISTS `cocinar`;
CREATE ALGORITHM=UNDEFINED DEFINER=`raul`@`localhost` SQL SECURITY DEFINER VIEW `cocinar` (`cod_linea_pedido`, `cod_comida`, `nombre_comida`, `descripcion`, `observaciones`, `cod_categoria`, `nombre_categoria`) AS    select `a`.`cod_linea_pedido` AS `cod_linea_pedido`,`b`.`cod_comida` AS `cod_comida`,`b`.`nombre` AS `nombre`,`b`.`descripcion` AS `descripcion`,`a`.`observaciones` AS `observaciones`,`c`.`cod_categoria` AS `cod_categoria`,`c`.`nombre` AS `nombre` from ((`lineas_pedido` `a` join `comidas` `b` on((`a`.`cod_comida` = `b`.`cod_comida`))) join `categorias` `c` on((`b`.`cod_categoria` = `c`.`cod_categoria`)))   ;

-- --------------------------------------------------------

--
-- Estructura para la vista `info_pedido`
--
DROP TABLE IF EXISTS `info_pedido`;

DROP VIEW IF EXISTS `info_pedido`;
CREATE ALGORITHM=UNDEFINED DEFINER=`raul`@`localhost` SQL SECURITY DEFINER VIEW `info_pedido` (`cod_total_pedido`, `cod_mesa`, `nombre_mesa`, `pagado`, `cod_linea_pedido`, `cod_comida`, `nombre_comida`, `unidades`, `observaciones`, `estado`, `cod_categoria`, `nombre_categoria`) AS    select `b`.`cod_total_pedido` AS `cod_total_pedido`,`a`.`cod_mesa` AS `cod_mesa`,`a`.`nombre` AS `nombre`,`b`.`pagado` AS `pagado`,`c`.`cod_linea_pedido` AS `cod_linea_pedido`,`d`.`cod_comida` AS `cod_comida`,`d`.`nombre` AS `nombre`,`c`.`unidades` AS `unidades`,`c`.`observaciones` AS `observaciones`,`c`.`estado` AS `estado`,`e`.`cod_categoria` AS `cod_categoria`,`e`.`nombre` AS `nombre` from ((((`mesas` `a` join `total_pedido` `b` on((`a`.`cod_mesa` = `b`.`cod_mesa`))) join `lineas_pedido` `c` on((`b`.`cod_total_pedido` = `c`.`cod_total_pedido`))) join `comidas` `d` on((`c`.`cod_comida` = `d`.`cod_comida`))) join `categorias` `e` on((`d`.`cod_categoria` = `e`.`cod_categoria`)))   ;

-- --------------------------------------------------------

--
-- Estructura para la vista `top_ventas`
--
DROP TABLE IF EXISTS `top_ventas`;

DROP VIEW IF EXISTS `top_ventas`;
CREATE ALGORITHM=UNDEFINED DEFINER=`raul`@`localhost` SQL SECURITY DEFINER VIEW `top_ventas` (`cod_categoria`, `nombre_categoria`, `cod_comida`, `nombre_comida`, `vendidos`) AS    with `cte` as (select `a`.`cod_categoria` AS `cod_categoria`,`a`.`nombre` AS `nom_categoria`,`b`.`cod_comida` AS `cod_comida`,`b`.`nombre` AS `nombre`,`c`.`unidades` AS `unidades` from ((`comidas` `b` left join `lineas_pedido` `c` on((`b`.`cod_comida` = `c`.`cod_comida`))) join `categorias` `a` on((`b`.`cod_categoria` = `a`.`cod_categoria`)))) select `d`.`cod_categoria` AS `cod_categoria`,`d`.`nom_categoria` AS `nom_categoria`,`d`.`cod_comida` AS `cod_comida`,`d`.`nombre` AS `nombre`,sum(if((`d`.`unidades` is null),0,`d`.`unidades`)) AS `vendidos` from `cte` `d` group by `d`.`cod_comida` order by `vendidos` desc   ;

-- --------------------------------------------------------

--
-- Estructura para la vista `total`
--
DROP TABLE IF EXISTS `total`;

DROP VIEW IF EXISTS `total`;
CREATE ALGORITHM=UNDEFINED DEFINER=`raul`@`localhost` SQL SECURITY DEFINER VIEW `total` (`cod_total_pedido`, `cod_linea_pedido`, `nombre_mesa`, `unidades`, `importe`, `pagado`, `cod_comida`, `nombre_comida`, `precio_comida`, `cod_categoria`, `nombre_categoria`, `estado`, `ivaRepercutido`, `porcentajeIVA`, `esBebida`) AS    select `b`.`cod_total_pedido` AS `cod_total_pedido`,`c`.`cod_linea_pedido` AS `cod_linea_pedido`,`a`.`nombre` AS `nombre`,`c`.`unidades` AS `unidades`,`b`.`importe` AS `importe`,`b`.`pagado` AS `pagado`,`d`.`cod_comida` AS `cod_comida`,`d`.`nombre` AS `nombre`,`d`.`precio` AS `precio`,`e`.`cod_categoria` AS `cod_categoria`,`e`.`nombre` AS `nombre`,`c`.`estado` AS `estado`,`c`.`iva` AS `ivaRepercutido`,`d`.`IVA` AS `porcentajeIVA`,`e`.`esBebida` AS `esBebida` from ((((`mesas` `a` join `total_pedido` `b` on((`a`.`cod_mesa` = `b`.`cod_mesa`))) join `lineas_pedido` `c` on((`b`.`cod_total_pedido` = `c`.`cod_total_pedido`))) join `comidas` `d` on((`c`.`cod_comida` = `d`.`cod_comida`))) join `categorias` `e` on((`d`.`cod_categoria` = `e`.`cod_categoria`)))   ;

-- --------------------------------------------------------

--
-- Estructura para la vista `ventas`
--
DROP TABLE IF EXISTS `ventas`;

DROP VIEW IF EXISTS `ventas`;
CREATE ALGORITHM=UNDEFINED DEFINER=`raul`@`localhost` SQL SECURITY DEFINER VIEW `ventas` (`cod_total_pedido`, `mesa`, `fecha`, `importe`, `total_iva`) AS    select `a`.`cod_total_pedido` AS `cod_total_pedido`,`b`.`nombre` AS `nombre`,cast(`a`.`fecha_hora_pagado` as date) AS `cast(a.fecha_hora_pagado as date)`,`a`.`importe` AS `importe`,`a`.`total_iva` AS `total_iva` from (`total_pedido` `a` join `mesas` `b` on((`a`.`cod_mesa` = `b`.`cod_mesa`)))   ;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comidas`
--
ALTER TABLE `comidas`
  ADD CONSTRAINT `comidas_ibfk_1` FOREIGN KEY (`cod_categoria`) REFERENCES `categorias` (`cod_categoria`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD CONSTRAINT `empleados_ibfk_1` FOREIGN KEY (`cod_role`) REFERENCES `roles` (`cod_role`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `lineas_pedido`
--
ALTER TABLE `lineas_pedido`
  ADD CONSTRAINT `lineas_pedido_ibfk_2` FOREIGN KEY (`cod_comida`) REFERENCES `comidas` (`cod_comida`) ON UPDATE CASCADE,
  ADD CONSTRAINT `lineas_pedido_ibfk_3` FOREIGN KEY (`cod_total_pedido`) REFERENCES `total_pedido` (`cod_total_pedido`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `total_pedido`
--
ALTER TABLE `total_pedido`
  ADD CONSTRAINT `total_pedido_ibfk_1` FOREIGN KEY (`cod_mesa`) REFERENCES `mesas` (`cod_mesa`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
