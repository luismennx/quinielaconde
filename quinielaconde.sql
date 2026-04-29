-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: quiniela_conde
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--


--
-- Table structure for table `bolsas`
--

DROP TABLE IF EXISTS `bolsas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bolsas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `jornada_id` bigint unsigned NOT NULL,
  `costo_ticket` decimal(10,2) NOT NULL DEFAULT '30.00',
  `total_recaudado` decimal(10,2) NOT NULL DEFAULT '0.00',
  `porcentaje_premio` decimal(5,2) NOT NULL DEFAULT '70.00',
  `monto_a_repartir` decimal(10,2) NOT NULL DEFAULT '0.00',
  `estado` enum('abierta','cerrada','pagada','cancelada') NOT NULL DEFAULT 'abierta',
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `jornada_id` (`jornada_id`),
  CONSTRAINT `bolsas_ibfk_1` FOREIGN KEY (`jornada_id`) REFERENCES `jornadas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bolsas`
--

LOCK TABLES `bolsas` WRITE;
/*!40000 ALTER TABLE `bolsas` DISABLE KEYS */;
/*!40000 ALTER TABLE `bolsas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deportes`
--

DROP TABLE IF EXISTS `deportes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deportes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(80) NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deportes`
--

LOCK TABLES `deportes` WRITE;
/*!40000 ALTER TABLE `deportes` DISABLE KEYS */;
/*!40000 ALTER TABLE `deportes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos`
--

DROP TABLE IF EXISTS `equipos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `liga_id` bigint unsigned NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `abreviatura` varchar(20) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_equipos_liga` (`liga_id`),
  CONSTRAINT `equipos_ibfk_1` FOREIGN KEY (`liga_id`) REFERENCES `ligas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos`
--

LOCK TABLES `equipos` WRITE;
/*!40000 ALTER TABLE `equipos` DISABLE KEYS */;
/*!40000 ALTER TABLE `equipos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadisticas_usuario`
--

DROP TABLE IF EXISTS `estadisticas_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadisticas_usuario` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint unsigned NOT NULL,
  `tickets_jugados` int NOT NULL DEFAULT '0',
  `tickets_ganados` int NOT NULL DEFAULT '0',
  `total_aciertos` int NOT NULL DEFAULT '0',
  `porcentaje_efectividad` decimal(5,2) NOT NULL DEFAULT '0.00',
  `premios_ganados` decimal(10,2) NOT NULL DEFAULT '0.00',
  `actualizado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `estadisticas_usuario_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadisticas_usuario`
--

LOCK TABLES `estadisticas_usuario` WRITE;
/*!40000 ALTER TABLE `estadisticas_usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `estadisticas_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventos`
--

DROP TABLE IF EXISTS `eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `deporte_id` bigint unsigned NOT NULL,
  `liga_id` bigint unsigned NOT NULL,
  `temporada_id` bigint unsigned NOT NULL,
  `jornada_id` bigint unsigned NOT NULL,
  `equipo_local_id` bigint unsigned NOT NULL,
  `equipo_visitante_id` bigint unsigned NOT NULL,
  `fecha_evento` datetime NOT NULL,
  `marcador_local` int DEFAULT NULL,
  `marcador_visitante` int DEFAULT NULL,
  `resultado` enum('local','empate','visitante') DEFAULT NULL,
  `estado` enum('programado','en_vivo','finalizado','cancelado','suspendido','pospuesto') NOT NULL DEFAULT 'programado',
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `deporte_id` (`deporte_id`),
  KEY `liga_id` (`liga_id`),
  KEY `temporada_id` (`temporada_id`),
  KEY `equipo_local_id` (`equipo_local_id`),
  KEY `equipo_visitante_id` (`equipo_visitante_id`),
  KEY `idx_eventos_jornada` (`jornada_id`),
  KEY `idx_eventos_fecha` (`fecha_evento`),
  CONSTRAINT `eventos_ibfk_1` FOREIGN KEY (`deporte_id`) REFERENCES `deportes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `eventos_ibfk_2` FOREIGN KEY (`liga_id`) REFERENCES `ligas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `eventos_ibfk_3` FOREIGN KEY (`temporada_id`) REFERENCES `temporadas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `eventos_ibfk_4` FOREIGN KEY (`jornada_id`) REFERENCES `jornadas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `eventos_ibfk_5` FOREIGN KEY (`equipo_local_id`) REFERENCES `equipos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `eventos_ibfk_6` FOREIGN KEY (`equipo_visitante_id`) REFERENCES `equipos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos`
--

LOCK TABLES `eventos` WRITE;
/*!40000 ALTER TABLE `eventos` DISABLE KEYS */;
/*!40000 ALTER TABLE `eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ganadores`
--

DROP TABLE IF EXISTS `ganadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ganadores` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `bolsa_id` bigint unsigned NOT NULL,
  `usuario_id` bigint unsigned NOT NULL,
  `ticket_id` bigint unsigned NOT NULL,
  `aciertos` int NOT NULL,
  `premio` decimal(10,2) NOT NULL DEFAULT '0.00',
  `estado` enum('pendiente','pagado','cancelado') NOT NULL DEFAULT 'pendiente',
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `bolsa_id` (`bolsa_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `ticket_id` (`ticket_id`),
  CONSTRAINT `ganadores_ibfk_1` FOREIGN KEY (`bolsa_id`) REFERENCES `bolsas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `ganadores_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `ganadores_ibfk_3` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ganadores`
--

LOCK TABLES `ganadores` WRITE;
/*!40000 ALTER TABLE `ganadores` DISABLE KEYS */;
/*!40000 ALTER TABLE `ganadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jornadas`
--

DROP TABLE IF EXISTS `jornadas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jornadas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `temporada_id` bigint unsigned NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `numero` int NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_cierre` datetime NOT NULL,
  `estado` enum('programada','abierta','cerrada','finalizada','cancelada') NOT NULL DEFAULT 'programada',
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_jornadas_temporada` (`temporada_id`),
  CONSTRAINT `jornadas_ibfk_1` FOREIGN KEY (`temporada_id`) REFERENCES `temporadas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jornadas`
--

LOCK TABLES `jornadas` WRITE;
/*!40000 ALTER TABLE `jornadas` DISABLE KEYS */;
/*!40000 ALTER TABLE `jornadas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ligas`
--

DROP TABLE IF EXISTS `ligas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ligas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `deporte_id` bigint unsigned NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `pais` varchar(80) DEFAULT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ligas_deporte` (`deporte_id`),
  CONSTRAINT `ligas_ibfk_1` FOREIGN KEY (`deporte_id`) REFERENCES `deportes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ligas`
--

LOCK TABLES `ligas` WRITE;
/*!40000 ALTER TABLE `ligas` DISABLE KEYS */;
/*!40000 ALTER TABLE `ligas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimientos_saldo`
--

DROP TABLE IF EXISTS `movimientos_saldo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientos_saldo` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint unsigned NOT NULL,
  `ticket_id` bigint unsigned DEFAULT NULL,
  `recarga_id` bigint unsigned DEFAULT NULL,
  `ganador_id` bigint unsigned DEFAULT NULL,
  `monto` decimal(10,2) NOT NULL,
  `tipo` enum('recarga','compra_ticket','premio','ajuste','devolucion') NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ticket_id` (`ticket_id`),
  KEY `recarga_id` (`recarga_id`),
  KEY `ganador_id` (`ganador_id`),
  KEY `idx_movimientos_usuario` (`usuario_id`),
  CONSTRAINT `movimientos_saldo_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `movimientos_saldo_ibfk_2` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `movimientos_saldo_ibfk_3` FOREIGN KEY (`recarga_id`) REFERENCES `recargas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `movimientos_saldo_ibfk_4` FOREIGN KEY (`ganador_id`) REFERENCES `ganadores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientos_saldo`
--

LOCK TABLES `movimientos_saldo` WRITE;
/*!40000 ALTER TABLE `movimientos_saldo` DISABLE KEYS */;
/*!40000 ALTER TABLE `movimientos_saldo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint unsigned NOT NULL,
  `titulo` varchar(120) NOT NULL,
  `mensaje` text NOT NULL,
  `tipo` enum('info','exito','advertencia','error','recarga','ticket','premio','jornada') NOT NULL DEFAULT 'info',
  `leida` tinyint(1) NOT NULL DEFAULT '0',
  `url_accion` varchar(255) DEFAULT NULL,
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `leida_en` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_notificaciones_usuario` (`usuario_id`),
  CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `predicciones`
--

DROP TABLE IF EXISTS `predicciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `predicciones` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint unsigned NOT NULL,
  `evento_id` bigint unsigned NOT NULL,
  `seleccion` enum('local','empate','visitante') NOT NULL,
  `acierto` tinyint(1) DEFAULT NULL,
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_prediccion_ticket_evento` (`ticket_id`,`evento_id`),
  KEY `idx_predicciones_ticket` (`ticket_id`),
  KEY `idx_predicciones_evento` (`evento_id`),
  CONSTRAINT `predicciones_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `predicciones_ibfk_2` FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `predicciones`
--

LOCK TABLES `predicciones` WRITE;
/*!40000 ALTER TABLE `predicciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `predicciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ranking_jornada`
--

DROP TABLE IF EXISTS `ranking_jornada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ranking_jornada` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `jornada_id` bigint unsigned NOT NULL,
  `usuario_id` bigint unsigned NOT NULL,
  `ticket_id` bigint unsigned NOT NULL,
  `posicion` int NOT NULL,
  `aciertos` int NOT NULL,
  `premio` decimal(10,2) NOT NULL DEFAULT '0.00',
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `ticket_id` (`ticket_id`),
  KEY `idx_ranking_jornada` (`jornada_id`),
  CONSTRAINT `ranking_jornada_ibfk_1` FOREIGN KEY (`jornada_id`) REFERENCES `jornadas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `ranking_jornada_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `ranking_jornada_ibfk_3` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ranking_jornada`
--

LOCK TABLES `ranking_jornada` WRITE;
/*!40000 ALTER TABLE `ranking_jornada` DISABLE KEYS */;
/*!40000 ALTER TABLE `ranking_jornada` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recargas`
--

DROP TABLE IF EXISTS `recargas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recargas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint unsigned NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `metodo_pago` varchar(50) NOT NULL,
  `referencia_pago` varchar(120) DEFAULT NULL,
  `estado` enum('pendiente','aprobada','rechazada','cancelada') NOT NULL DEFAULT 'pendiente',
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `recargas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recargas`
--

LOCK TABLES `recargas` WRITE;
/*!40000 ALTER TABLE `recargas` DISABLE KEYS */;
/*!40000 ALTER TABLE `recargas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `temporadas`
--

DROP TABLE IF EXISTS `temporadas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `temporadas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `liga_id` bigint unsigned NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `activa` tinyint(1) NOT NULL DEFAULT '0',
  `estado` enum('activa','finalizada','cancelada') NOT NULL DEFAULT 'activa',
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_temporadas_liga` (`liga_id`),
  CONSTRAINT `temporadas_ibfk_1` FOREIGN KEY (`liga_id`) REFERENCES `ligas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `temporadas`
--

LOCK TABLES `temporadas` WRITE;
/*!40000 ALTER TABLE `temporadas` DISABLE KEYS */;
/*!40000 ALTER TABLE `temporadas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint unsigned NOT NULL,
  `jornada_id` bigint unsigned NOT NULL,
  `bolsa_id` bigint unsigned NOT NULL,
  `folio` varchar(50) NOT NULL,
  `costo_ticket` decimal(10,2) NOT NULL DEFAULT '30.00',
  `aciertos` int NOT NULL DEFAULT '0',
  `estado` enum('pendiente','activo','finalizado','ganador','perdedor','cancelado') NOT NULL DEFAULT 'activo',
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `folio` (`folio`),
  KEY `bolsa_id` (`bolsa_id`),
  KEY `idx_tickets_usuario` (`usuario_id`),
  KEY `idx_tickets_jornada` (`jornada_id`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`jornada_id`) REFERENCES `jornadas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `tickets_ibfk_3` FOREIGN KEY (`bolsa_id`) REFERENCES `bolsas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apodo` varchar(50) NOT NULL,
  `correo` varchar(120) NOT NULL,
  `whatsapp` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `saldo` decimal(10,2) NOT NULL DEFAULT '0.00',
  `rol` enum('jugador','admin') NOT NULL DEFAULT 'jugador',
  `estado` enum('activo','inactivo','bloqueado') NOT NULL DEFAULT 'activo',
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `apodo` (`apodo`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `whatsapp` (`whatsapp`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (6,'Luis Prueba','LUISPRUEBA','luisprueba@test.com','5599999999','$2b$10$QYdvSpJrj9LG.INkYUCCDe6spXYTaCZqlTsF6edFh8upV/htpZcPm',0.00,'jugador','activo','2026-04-25 22:51:02','2026-04-25 22:51:02'),(7,'Angel Gonzalez','Impa','impa0986@gmail.com','5566271809','$2b$10$g6IzKIWoGw4SUxhVcsWOGe8oZHR6dbrGbfQYFQf2JFQ28vjQ9NUI2',0.00,'jugador','activo','2026-04-25 23:00:20','2026-04-25 23:00:20');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-28 22:21:06
