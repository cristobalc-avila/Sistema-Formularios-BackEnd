-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-08-2022 a las 22:46:27
-- Versión del servidor: 10.4.21-MariaDB
-- Versión de PHP: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistemadeformularios`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formulario`
--

CREATE TABLE `formulario` (
  `id` int(11) NOT NULL,
  `titulo` varchar(254) NOT NULL,
  `descripcion` varchar(254) NOT NULL,
  `url` varchar(254) NOT NULL,
  `tipo_formulario` varchar(254) NOT NULL,
  `subtipo_formulario` varchar(254) NOT NULL,
  `estado` varchar(254) NOT NULL,
  `sexo_dirigido` varchar(254) NOT NULL,
  `carrera_dirigida` varchar(254) NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `formulario`
--

INSERT INTO `formulario` (`id`, `titulo`, `descripcion`, `url`, `tipo_formulario`, `subtipo_formulario`, `estado`, `sexo_dirigido`, `carrera_dirigida`, `fecha_vencimiento`, `id_usuario`) VALUES
(1, 'Conversatorio', 'Asiste al cuarto conversatorio de ICI, responde para inscribirte', 'https://forms.gle/WYZgZ498dgbJFHaa6', 'Actividad', 'Conversatorio\r\n', 'DISPONIBLE', 'masculino', 'Todas', '2022-10-26', 1),
(2, 'Seminario ICI', 'Participa de el nuevo seminario de ICI, y gana premios', 'https://forms.gle/WYZgZ498dgbJFHaa6', 'Actividad', 'Seminario', 'DISPONIBLE', 'Todos', 'Ingenieria Civil Informatica', '2022-09-30', 1),
(3, 'Encuesta de Asignatura Anatomia', 'Encuesta para cambiar horario de las clases del martes de Anatomia', 'https://forms.gle/WYZgZ498dgbJFHaa6', 'Encuesta de Asignatura', 'Encuesta', 'DISPONIBLE', 'Todos', 'Enfermeria', '2022-10-26', 1),
(4, 'Fotografía', 'Concurso de fotografía! participa enviándonos una foto de tu mascota y participa!', 'https://forms.gle/WYZgZ498dgbJFHaa6', 'Actividad', 'Concurso', 'DISPONIBLE', 'Todos', 'Todas', '2022-10-13', 1),
(5, 'ENCUESTA \"DIMENSIONES PSICOSOCIALES\"', 'Estimades compañeres,  junto con saludar, y esperando que se encuentren muy bien, como grupo de tesis conformado por Carlina Burgos Quezada, Alison Fernández Garrido y Makarena Gonzalez Quiñones, pertenecientes a la carrera de Psicología. Les escribimos ', 'https://forms.gle/wEQhmmT8aDJb7yJH7 ', 'Encuesta', 'Encuesta de Tesis', 'DISPONIBLE', 'Todos', 'Ingenieria Civil Informatica', '2022-08-18', 1),
(6, 'Cambiar certamen de Redes', 'Vota en esta encuesta para cambiar el certamen de Datos y Redes. Para el próximo viernes 26 de Agosto', 'https://forms.gle/WYZgZ498dgbJFHaa6', 'Encuesta', 'Encuesta de Asignatura', 'DISPONIBLE', 'Todos', 'Ingenieria Civil Informatica', '2022-08-27', 1),
(8, 'Encuesta de Tesis \"CHATBOT\"', 'Te invitamos a responder nuestra encuesta, cuyos datos serán utilizados para la implementación del chatbot para la página de la carrera', 'https://forms.gle/WYZgZ498dgbJFHaa6', 'Encuesta', 'encuesta de tesis', 'DISPONIBLE', 'Todos', 'Ingeniería Civil Informática', '2022-08-28', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuesta`
--

CREATE TABLE `respuesta` (
  `id_usuario` int(11) NOT NULL,
  `id_formulario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `respuesta`
--

INSERT INTO `respuesta` (`id_usuario`, `id_formulario`) VALUES
(1, 1),
(1, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(100) NOT NULL,
  `rut` varchar(12) NOT NULL,
  `nombre` varchar(254) NOT NULL,
  `correo` varchar(254) NOT NULL,
  `password` varchar(254) NOT NULL,
  `rol` varchar(254) NOT NULL,
  `sexo` varchar(254) NOT NULL,
  `carrera` varchar(254) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `rut`, `nombre`, `correo`, `password`, `rol`, `sexo`, `carrera`) VALUES
(1, '20363288-6', 'Cristobal Castro', 'cristobal@gmail.com', '$2b$10$A148qnL/NESMMDl5SwnQg.Wut/40wcH19XnKImJP2px0WHJfmKcA2', '2', 'masculino', 'Ingenieria Civil Informatica'),
(2, '11111111-1', 'Administrador', 'admin@gmail.com', '$2b$10$qSPKRGK635ibLLZcgc/S1umM0kKrvhZsHKOCXGTFoT3DcAF48Fbg2', '1', 'masculino', 'UBB'),
(3, '20362288-5', 'Javier Lopez', 'javier@gmail.com', '$2b$10$8Bde9.rXKeHzvvBSNTinJuqfSXZuNaanaOjP9HWn83CYFKY0hruny', '2', 'masculino', 'Enfermería'),
(4, '19693156-5', 'Daniela Lizana', 'daniela@gmail.com', '$2b$10$.QOmoRn.Kw1R0JiH1CesQO8eaM1uAytbOVrN65LxTAmcye0GRHfGS', '2', 'femenino', 'Nutrición y Dietética');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `formulario`
--
ALTER TABLE `formulario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_formulario_usuario` (`id_usuario`);

--
-- Indices de la tabla `respuesta`
--
ALTER TABLE `respuesta`
  ADD PRIMARY KEY (`id_usuario`,`id_formulario`),
  ADD KEY `id_formulario` (`id_formulario`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `formulario`
--
ALTER TABLE `formulario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `formulario`
--
ALTER TABLE `formulario`
  ADD CONSTRAINT `fk_formulario_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `respuesta`
--
ALTER TABLE `respuesta`
  ADD CONSTRAINT `respuesta_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `respuesta_ibfk_2` FOREIGN KEY (`id_formulario`) REFERENCES `formulario` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
