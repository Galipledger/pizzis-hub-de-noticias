-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-10-2024 a las 21:07:51
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pizzis1`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios`
--

CREATE TABLE `comentarios` (
  `id` int(11) NOT NULL,
  `id_noticia` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `comentario` text NOT NULL,
  `fecha_comentario` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comentarios`
--

INSERT INTO `comentarios` (`id`, `id_noticia`, `id_usuario`, `comentario`, `fecha_comentario`) VALUES
(2, 4, 1, 'madrid\r\n\r\n', '2024-10-02 04:27:45'),
(5, 6, 2, 'jnnj', '2024-10-02 06:29:24'),
(6, 6, 2, 'hello', '2024-10-02 06:30:29'),
(8, 6, 1, 'hola', '2024-10-02 21:15:23'),
(12, 6, 4, 'wswskswqnjqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq', '2024-10-03 09:05:48'),
(15, 43, 1, 'wdwwwwwwwwwwwwwwkwkdn', '2024-10-04 21:04:12'),
(17, 41, 1, 'hola', '2024-10-05 01:10:19');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `likes_dislikes`
--

CREATE TABLE `likes_dislikes` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_noticia` int(11) DEFAULT NULL,
  `tipo` enum('like','dislike') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `likes_dislikes`
--

INSERT INTO `likes_dislikes` (`id`, `id_usuario`, `id_noticia`, `tipo`) VALUES
(1, 1, 5, 'like'),
(2, 2, 6, 'like'),
(3, 2, 5, 'like'),
(7, 2, 3, 'like'),
(8, 2, 4, 'like'),
(10, 4, 6, 'like'),
(11, 1, 16, 'like'),
(12, 1, 4, 'like'),
(13, 4, 4, 'like'),
(14, 1, 6, 'like'),
(17, 7, 4, 'like'),
(18, 7, 16, 'dislike'),
(19, 8, 4, 'like'),
(20, 9, 4, 'like'),
(21, 11, 4, 'like'),
(22, 12, 4, 'like'),
(23, 13, 4, 'like'),
(24, 14, 4, 'like'),
(25, 1, 3, 'dislike'),
(26, 1, 45, 'like'),
(27, 1, 43, 'dislike'),
(28, 1, 39, 'like'),
(29, 2, 41, 'like'),
(30, 1, 36, 'like'),
(31, 1, 41, 'dislike'),
(32, 2, 43, 'like'),
(33, 2, 16, 'like'),
(34, 1, 53, 'like'),
(35, 1, 68, 'dislike'),
(36, 4, 68, 'like'),
(37, 2, 68, 'like'),
(38, 17, 68, 'like'),
(39, 17, 4, 'like');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticias`
--

CREATE TABLE `noticias` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `contenido` text NOT NULL,
  `autor_id` int(11) NOT NULL,
  `miniatura` varchar(255) DEFAULT NULL,
  `fecha_publicacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `foto_extra` varchar(255) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `noticias`
--

INSERT INTO `noticias` (`id`, `titulo`, `contenido`, `autor_id`, `miniatura`, `fecha_publicacion`, `foto_extra`, `video`) VALUES
(3, 'el videojuego ambientado en la guerra de malvinas', 'la guerra de malvinas fue un conflicto que inicio en 1982\r\n', 1, '1727827472064-843413-1-15.jpg', '2024-10-02 00:04:32', NULL, NULL),
(4, 'recrean la final de madrid en fc24', 'en el 9/12/18 se jugo la final de libertadores entre river y boca donde river salio vencedor con un remontada 3-1\r\n\r\n', 1, '1727827567882-15435011738515.jpg', '2024-10-02 00:06:07', NULL, NULL),
(5, 'los problemas de la ps5 pro', 'la ps5 pro se anuncio recientemnete y ya ha recibido diversas criticas como su elevado precio y su casi nula inovacion con respecto a la ps5 normal\r\n\r\n', 1, '1727827751570-1726091267653.webp', '2024-10-02 00:09:11', NULL, NULL),
(6, 'el juego ambientado en la ww3', 'ww3 es un videojuego ambientado en la teercera guerra mundial, donde hay dos principales bandos: rusia y la otan\r\n', 1, '1727827904251-1366_2000.jpeg', '2024-10-02 00:11:44', NULL, NULL),
(16, 'call of duty black ops 6', 'call of duty black ops 6 es el nuevo videojuego ambientado en la guerra de golfo creado por activision-blizzard', 1, '1727946995323-shopping.webp', '2024-10-03 09:16:35', NULL, NULL),
(25, 'una decada para esto?', 'reciente a la fecha de la publicacion de esta noticia se lando el primer teaser trailler de minecraft y no es como todos esperabamos', 1, '1728053737236-2024-09-04-18-19-38-Teknofilo-1000x563.jpg', '2024-10-04 14:55:37', NULL, NULL),
(26, 'asi son los zombies de black ops 6', 'los zombies de treyarch regresan con el nuevo call of duty black ops 6. esta nueva entrega de zombies integra el nuevo motor grafico que se integro en mw19', 1, '1728055441604-BO6-ZOMBIES-888-TOUT.jpg', '2024-10-04 15:24:01', NULL, NULL),
(28, 'la nueva actualizacion de minecraft es decepcionante', 'mojang acaba de anunciar la nueva actualizacion 1.22 y es decepcionante como todas las actualizaciones que saco mojang en los ultimos 5 años', 1, '1728055914413-The-Pale-Garden-biome-in-minecraft.webp', '2024-10-04 15:31:54', NULL, NULL),
(29, 'pubg demanda a free fire', 'La batalla legal entre Krafton y Garena sigue su curso. Free Fire y Free Fire MAX fue acusado de ser un plagio de PlayerUnknown\'s Battlegrounds (PUBG) y la demanda judicial ya se encuentra en los tribunales de California, Estados Unidos. Y entre los documentos presentados a la Justicia, se difundieron algunas de las imágenes', 1, '1728056154975-images (2).jpeg', '2024-10-04 15:35:54', NULL, NULL),
(30, 'EA cancela proyecto de pvz3', 'os proyectos de fans son algo común en la industria del videojuego. Muchos, sin embargo, son bloqueados por parte de las compañías poseedoras de las IP. Desafortunadamente, tal es el caso de un grupo de fans que se propuso ofrecer un nuevo juego de Plants vs. Zombies que conservara la esencia del original.\r\n\r\nEl desarrollo de Plants vs. Zombies 3 ha sido largo y algo desesperante para los fans, que aún no pueden jugarlo. De hecho, ha habido algunos periodos de Acceso Anticipado, como el actual, aunque no puede disfrutarse en todas las regiones.', 1, '1728056542878-ggggevil.webp', '2024-10-04 15:42:22', NULL, NULL),
(31, 'gta definitive edition no es tan definitivo', 'flashbacks de Vietnam, o, mejor dicho, de vice City. Tras casi dos años del lanzamiento de este juego, el juego sigue teniendo fallos fatales', 1, '1728056860319-16370756096185.jpg', '2024-10-04 15:47:40', NULL, NULL),
(35, 'mas filtraciones de gta 6', 'a ya casi un año de que rockstar games saco el primer trailler de gta 6 después de mas de una década, llegan nuevas filtraciones de gta 6\r\n', 1, '1728057792099-99-details-from-the-gta-6-trailer_pzvq.jpg', '2024-10-04 16:03:12', NULL, NULL),
(36, 'nuevos personas en dragon ball sparking zero', 'el futuro nuevo juego de dragon ball: dragon ball sparking zero, presente nuevos personajes, muchos de estos personajes son de dragon ball gt', 1, '1728058216812-images (3).jpeg', '2024-10-04 16:10:16', NULL, NULL),
(38, 'una pelicula de minecraft sigue siendo decepcionante', 'se lanzo un adelanto de la pelicula de minecraft, y el adelanto sigue siendo tan lamentable como el mismisimos trailler del mismo', 1, '1728059131615-Minecraft-Pelicula-Mesa-Trabajo.webp', '2024-10-04 16:25:31', NULL, NULL),
(39, 'pvz3 es un desastre ', 'después de tanto años y de tantos retrasos (que no sirvieron para nada) se lanzo la primera version de pvz 3', 1, '1728059265706-pvz3-feature-image-16x9.jpg.adapt.crop16x9.1023w.jpg', '2024-10-04 16:27:45', NULL, NULL),
(41, 'red dead redeption 2 en ps plus', 'BOMBAZO! esta semana se anuncio de que sony  lanzara gratis red ddead redeption 2 gratis que poseen ps plus\r\n', 1, '1728059853249-red-dead-redemption-2-who-is-arthur-morgan_trru.1200.webp', '2024-10-04 16:37:33', NULL, NULL),
(43, 'se descubre nuevo detalle realista en red dead redeption 2', 'red dead redeption 2 es uno de los juegos mas cuidados y detallados que se han creado en la historia, despues de haberse lanza y hace 6 años los fans siguen encontrando detalles y ester eggs', 1, '1728063449311-_RDR2Screenshot001_99629fb2.webp', '2024-10-04 17:37:29', NULL, NULL),
(45, 'minecraft para ps5', 'el videojuego de minecraft despues de casi 4 años cambia su modelo de actualizaciones y prepara una versión nativa para PlayStation 5', 1, '1728063908880-UPYT544LYVHHZIQXMBUX442ATI.avif', '2024-10-04 17:45:08', NULL, NULL),
(48, 'elon musk afirma que un jugador con neuralink derrotara a profesionales en pocos años', 'elon musk es un tipo... peculiar. desde ofrecerse a un combate contra el dictador nicolas maduro hasta comprar twitter por la misma cantidad de dinero que recauda paises enteros en un año. en estas ultimas semanas ha recuperado noteriedad el dispositivo neuralink, que segun musk permitra a los jugadores normales a ser mejores que los jugadores profesiones o expertos\r\n', 1, '1728147725267-GCJORBH2XRCBZFM6KLVIDE23NU.avif', '2024-10-05 17:02:05', NULL, NULL),
(49, 'el juego que ayuda programar en sql', 'SQL Murder Mystery es un juego diseñado para aprender conceptos y comandos de SQL mientras se resuelve un misterio. Es adecuado tanto para principiantes como para usuarios experimentados de SQL, ya que permite aprender de manera autodirigida y divertida.', 1, '1728150026832-174092-clue-illustration.png', '2024-10-05 17:40:26', NULL, NULL),
(50, 'se confirma nuketown en black ops 6?', 'en estos ultimos dias se hizo popular una imagen revelada por unos influencers donde supuestamente se revela oficialmente la salida de nuketown en call of duty black ops 6', 1, '1728151984724-GYQ5vUtW4AAiHNb.jpeg', '2024-10-05 18:13:04', NULL, NULL),
(52, 'Josh Hutcherson  habla sobre la secuela de five nights ar freddt s', 'En una reciente entrevista, Josh Hutcherson habló de la escala de la película, cuyo rodaje comenzará en apenas unas semanas en Nueva Orleans. “Es mucho más grande. Hay mucho más en juego. Hay más animatrónicos y el mundo simplemente se abre de una manera grandiosa,” adelantó el actor que interpretó a Mike, el desafortunado guardia de seguridad asignado a Freddy Fazbear’s Pizza.', 1, '1728152314467-Five-Nights-at-Freddies-qen6j18lr2aiu1m48z1u8bvxjsoyhjiqwlk20soeiw.jpg', '2024-10-05 18:18:34', NULL, NULL),
(53, 'Epic Games reduce el pago de regalías a los desarrolladores que apuesten por Unreal Engine y Epic Games Store', 'Epic Games ha presentado un nuevo programa para desarrolladores con el que ofrece una reducción en el pago de regalías siempre que los juegos creados con Unreal Engine se publiquen en su tienda y de manera adicional en otras según la plataforma que admita el título. El estudio de videojuegos ha actualizado los términos de su tienda y su motor gráfico para ayudar a los desarrolladores a \"llegar a un público más amplio con términos más amigables\", una intención que se materializa en el programa \'Lanzamiento en todas partes con Epic\', presentado en el marco de Unreal Fest Seattle 2024. Este programa entrará en vigor el 1 de enero de 2025, y quienes se acojan a él deberán utilizar el motor Unreal Engine en sus juegos y publicarlos en Epic Games Store \"antes o al mismo tiempo\" que en otras plataformas que admita, como son PC Windows, Mac y Android (y más adelante también iOS). Los desarrolladores podrán acceder a una tasa del 3,5 por ciento en lugar del 5 por ciento para los juegos de Unreal Engine, que se aplicará \"en todas las plataformas y tiendas\" en las que ofrezcan sus juegos. Sin embargo, perderán esta ventaja si ofrecen el juego en otra tienda de PC o Android y no en Epic Games Store para la plataforma correspondiente, como ocurriría, por ejemplo, si el juego es compatible para móviles Android y el desarrollador lo ha compartido en una tienda distinta especializada en este sistema y no lo ha subido a la de Epic Games.', 1, '1728152727101-images (4).jpeg', '2024-10-05 18:25:27', NULL, NULL),
(68, 'sale el trailler global de call of duty black ops 6', 'ya en unas 3 semanas saldrá oficialmente call of duty black ops 6, aunque ya falta pco para el lanzamiento del videojuego, activios y treyarch lanzaron el trailler global de call of duty black ops 6', 1, '1728331179387-1366_2000 (1).jpeg', '2024-10-07 19:59:39', NULL, '1728331179387-black ops 6.mp4');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `es_admin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `contraseña`, `foto_perfil`, `es_admin`) VALUES
(1, 'jeremías Agustín', 'jeramiasbandelli@gmail.com', '22', NULL, 1),
(2, 'matias', 'matias@gmail.com', '22', NULL, 0),
(3, 'a', 'a@gmail.com', '22', NULL, 0),
(4, 'asuvachi', 'jeretgamergamesandmore@gmail.com', '22', NULL, 0),
(7, '22', 'l@gmail.com', '22', NULL, 0),
(8, 'ser', 'serenaporterie@gmail.com', '22', NULL, 0),
(9, 'jon{n', 'jeretgamer444@gmail.com', '22', NULL, 0),
(10, 'mario bros', 'messi@gmail.com', '22', NULL, 0),
(11, 'nko', 'ñ', '2', NULL, 0),
(12, 'a', 'a', '22', NULL, 0),
(13, 'elcarpincho', 'c', '22', NULL, 0),
(14, 'k', 'k', '22', NULL, 0),
(15, 'wdwd', 'wddw', 'wdw', NULL, 0),
(16, 'wd', 'eee', 'wd', NULL, 0),
(17, 'hello', 'hola@gmail.com', '22', NULL, 0),
(21, 'e2j2e2eok2ee2l', 'e2e2je2je2@gmail.com', 'jeret445', NULL, 0),
(23, 'matias', '2je2j2j@gmail.com', 'jeret445', NULL, 0),
(24, 'ananin', 'ananin@gmail.com', 'jeret445', NULL, 0),
(25, 'jeremías Agustín', '4krr4k4@gmail.com', 'jeret445', NULL, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_noticia` (`id_noticia`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `likes_dislikes`
--
ALTER TABLE `likes_dislikes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_vote` (`id_usuario`,`id_noticia`),
  ADD KEY `likes_dislikes_ibfk_2` (`id_noticia`);

--
-- Indices de la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `autor_id` (`autor_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `likes_dislikes`
--
ALTER TABLE `likes_dislikes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `noticias`
--
ALTER TABLE `noticias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`id_noticia`) REFERENCES `noticias` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `likes_dislikes`
--
ALTER TABLE `likes_dislikes`
  ADD CONSTRAINT `likes_dislikes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `likes_dislikes_ibfk_2` FOREIGN KEY (`id_noticia`) REFERENCES `noticias` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD CONSTRAINT `noticias_ibfk_1` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
