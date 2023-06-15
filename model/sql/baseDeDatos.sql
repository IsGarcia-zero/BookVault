-- MySQL Script generated by MySQL Workbench
-- Mon Jun  5 14:54:52 2023
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering


SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `BOOKVAULT` DEFAULT CHARACTER SET utf8 ;
USE `BOOKVAULT` ;

-- -----------------------------------------------------
-- Table `mydb`.`ADMINISTRADOR`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BOOKVAULT`.`ADMINISTRADOR` (
  `idAdmin` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(30) NOT NULL,
  `correo` VARCHAR(30) NOT NULL,
  `telefono` VARCHAR(10) NOT NULL,
  `fechaRegistro` DATE NOT NULL,
  PRIMARY KEY (`idAdmin`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`USUARIO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BOOKVAULT`.`USUARIO` (
  `idUsuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(20) NOT NULL,
  `primer_apellido` VARCHAR(15) NOT NULL,
  `segundo_apellido` VARCHAR(15) NULL,
  `edad` INT NOT NULL,
  `telefono` VARCHAR(10) NOT NULL,
  `correo` VARCHAR(30) NOT NULL,
  `intereses` VARCHAR(50) NOT NULL,
  `semestre` INT NOT NULL,
  `ADMINISTRADOR_idAdmin` INT NOT NULL,
  PRIMARY KEY (`idUsuario`),
  INDEX `fk_USUARIO_ADMINISTRADOR1_idx` (`ADMINISTRADOR_idAdmin` ASC),
  CONSTRAINT `fk_USUARIO_ADMINISTRADOR1`
    FOREIGN KEY (`ADMINISTRADOR_idAdmin`)
    REFERENCES `mydb`.`ADMINISTRADOR` (`idAdmin`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`LIBRO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BOOKVAULT`.`LIBRO` (
  `idLibro` INT NOT NULL AUTO_INCREMENT,
  `ISBN` VARCHAR(13) NOT NULL,
  `nombreAutor` VARCHAR(20) NOT NULL,
  `apellidosAutor` VARCHAR(20) NOT NULL,
  `edicion` INT NOT NULL,
  `cantidadPaginas` INT NOT NULL,
  `titulo` VARCHAR(30) NOT NULL,
  `ciudad` VARCHAR(20) NOT NULL,
  `editorial` VARCHAR(30) NOT NULL,
  `genero` VARCHAR(30) NULL,
  `yearEdicion` INT NOT NULL,
  `ADMINISTRADOR_idAdmin` INT NOT NULL,
  PRIMARY KEY (`idLibro`),
  INDEX `fk_LIBRO_ADMINISTRADOR1_idx` (`ADMINISTRADOR_idAdmin` ASC),
  CONSTRAINT `fk_LIBRO_ADMINISTRADOR1`
    FOREIGN KEY (`ADMINISTRADOR_idAdmin`)
    REFERENCES `mydb`.`ADMINISTRADOR` (`idAdmin`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

INSERT INTO LIBRO (ISBN, nombreAutor, apellidosAutor, edicion, cantidadPaginas, titulo, ciudad, editorial, genero, yearEdicion, ADMINISTRADOR_idAdmin)
VALUES ('9788498679789', 'Harper', 'Lee', 1, 281, 'Matar a un ruiseñor', 'Nueva York', 'J. B. Lippincott & Co.', 'Drama', 1960, 1);

INSERT INTO LIBRO (ISBN, nombreAutor, apellidosAutor, edicion, cantidadPaginas, titulo, ciudad, editorial, genero, yearEdicion, ADMINISTRADOR_idAdmin)
VALUES ('9788408048111', 'Mario', 'Vargas Llosa', 3, 567, 'La casa verde', 'Lima', 'Seix Barral', 'Realismo mágico', 1966, 1);

INSERT INTO LIBRO (ISBN, nombreAutor, apellidosAutor, edicion, cantidadPaginas, titulo, ciudad, editorial, genero, yearEdicion, ADMINISTRADOR_idAdmin)
VALUES ('9788432214228', 'Gustavo', 'Adolfo Bécquer', 1, 128, 'Rimas y leyendas', 'Sevilla', 'Espasa-Calpe', 'Poesía', 1860, 1);

INSERT INTO LIBRO (ISBN, nombreAutor, apellidosAutor, edicion, cantidadPaginas, titulo, ciudad, editorial, genero, yearEdicion, ADMINISTRADOR_idAdmin)
VALUES ('9780061120084', 'Dan', 'Brown', 1, 454, 'El código Da Vinci', 'Nueva York', 'Doubleday', 'Suspenso', 2003, 1);

INSERT INTO LIBRO (ISBN, nombreAutor, apellidosAutor, edicion, cantidadPaginas, titulo, ciudad, editorial, genero, yearEdicion, ADMINISTRADOR_idAdmin)
VALUES ('9780545010221', 'J.R.R.', 'Tolkien', 2, 398, 'El hobbit', 'Londres', 'George Allen & Unwin', 'Fantasía', 1937, 1);

INSERT INTO LIBRO (ISBN, nombreAutor, apellidosAutor, edicion, cantidadPaginas, titulo, ciudad, editorial, genero, yearEdicion, ADMINISTRADOR_idAdmin)
VALUES ('9788483462587', 'Paulo', 'Coelho', 1, 208, 'El Alquimista', 'Río de Janeiro', 'Editorial Planeta', 'Ficción', 1988, 1);

INSERT INTO LIBRO (ISBN, nombreAutor, apellidosAutor, edicion, cantidadPaginas, titulo, ciudad, editorial, genero, yearEdicion, ADMINISTRADOR_idAdmin)
VALUES ('9788420473582', 'Miguel', 'Delibes', 1, 344, 'Los santos inocentes', 'Valladolid', 'Alfaguara', 'Drama', 1981, 1);

INSERT INTO LIBRO (ISBN, nombreAutor, apellidosAutor, edicion, cantidadPaginas, titulo, ciudad, editorial, genero, yearEdicion, ADMINISTRADOR_idAdmin)
VALUES ('9788408208124', 'Isabel', 'Allende', 2, 368, 'La casa de los espíritus', 'Santiago', 'Editorial Sudamericana', 'Realismo mágico', 1982, 1);

INSERT INTO LIBRO (ISBN, nombreAutor, apellidosAutor, edicion, cantidadPaginas, titulo, ciudad, editorial, genero, yearEdicion, ADMINISTRADOR_idAdmin)
VALUES ('9788408193277', 'Stieg', 'Larsson', 1, 654, 'Los hombres que no amaban a las mujeres', 'Estocolmo', 'Norstedts Förlag', 'Suspenso', 2005, 1);

INSERT INTO LIBRO (ISBN, nombreAutor, apellidosAutor, edicion, cantidadPaginas, titulo, ciudad, editorial, genero, yearEdicion, ADMINISTRADOR_idAdmin)
VALUES ('9788432229031', 'Federico', 'García Lorca', 1, 256, 'Bodas de sangre', 'Granada', 'Espasa-Calpe', 'Drama', 1933, 1);

INSERT INTO LIBRO (ISBN, nombreAutor, apellidosAutor, edicion, cantidadPaginas, titulo, ciudad, editorial, genero, yearEdicion, ADMINISTRADOR_idAdmin)
VALUES ('9788466332288', 'John', 'Verdon', 1, 528, 'No abras los ojos', 'Nueva York', 'Random House', 'Suspenso', 2010, 1);

INSERT INTO LIBRO (ISBN, nombreAutor, apellidosAutor, edicion, cantidadPaginas, titulo, ciudad, editorial, genero, yearEdicion, ADMINISTRADOR_idAdmin)
VALUES ('9788433979537', 'Antoine', 'de Saint-Exupéry', 1, 96, 'El principito', 'Nueva York', 'Reynal & Hitchcock', 'Literatura infantil', 1943, 1);

INSERT INTO LIBRO (ISBN, nombreAutor, apellidosAutor, edicion, cantidadPaginas, titulo, ciudad, editorial, genero, yearEdicion, ADMINISTRADOR_idAdmin)
VALUES ('9788497592801', 'Fernando', 'Savater', 2, 208, 'Ética para Amador', 'Madrid', 'Editorial Ariel', 'Filosofía', 1991, 1);

INSERT INTO LIBRO (ISBN, nombreAutor, apellidosAutor, edicion, cantidadPaginas, titulo, ciudad, editorial, genero, yearEdicion, ADMINISTRADOR_idAdmin)
VALUES ('9788435018927', 'Jane', 'Austen', 1, 400, 'Orgullo y prejuicio', 'Londres', 'Egerton', 'Novela romántica', 1813, 1);

INSERT INTO LIBRO (ISBN, nombreAutor, apellidosAutor, edicion, cantidadPaginas, titulo, ciudad, editorial, genero, yearEdicion, ADMINISTRADOR_idAdmin)
VALUES ('9788420472905', 'Arturo', 'Pérez-Reverte', 1, 536, 'El club Dumas', 'Madrid', 'Alfaguara', 'Misterio', 1993, 1);

ALTER TABLE libros ADD pdf_url VARCHAR(255);


-- -----------------------------------------------------
-- Table `mydb`.`FAVORITO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BOOKVAULT`.`FAVORITO` (
  `idFavorito` INT NOT NULL AUTO_INCREMENT,
  `nombreAutor` VARCHAR(45) NOT NULL,
  `fecha` DATE NOT NULL,
  `tituloLibro` VARCHAR(30) NOT NULL,
  `USUARIO_idUsuario` INT NOT NULL,
  `LIBRO_idLibro` INT NOT NULL,
  PRIMARY KEY (`idFavorito`, `USUARIO_idUsuario`, `LIBRO_idLibro`),
  INDEX `fk_FAVORITO_USUARIO_idx` (`USUARIO_idUsuario` ASC),
  INDEX `fk_FAVORITO_LIBRO1_idx` (`LIBRO_idLibro` ASC),
  CONSTRAINT `fk_FAVORITO_USUARIO`
    FOREIGN KEY (`USUARIO_idUsuario`)
    REFERENCES `mydb`.`USUARIO` (`idUsuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_FAVORITO_LIBRO1`
    FOREIGN KEY (`LIBRO_idLibro`)
    REFERENCES `mydb`.`LIBRO` (`idLibro`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;
use BOOKVAULT;
SELECT * FROM LIBRO;
ALTER TABLE LIBRO ADD pdf_url VARCHAR(255);

ALTER TABLE LIBRO ADD img_libro VARCHAR(255);

UPDATE LIBRO
SET img_libro = 'lossantosinocentes.jpg'
WHERE idLibro=7;

UPDATE LIBRO
SET img_libro = 'mataraunruiseñor.jpg'
WHERE idLibro=1;
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;INSERT INTO LIBRO (ISBN, nombreAutor, apellidosAutor, edicion, cantidadPaginas, titulo, ciudad, editorial, genero, yearEdicion, ADMINISTRADOR_idAdmin) VALUES ('9788408193277', 'Stieg', 'Larsson', 1, 654, 'Los hombres que no amaban a las mujeres', 'Estocolmo', 'Norstedts Förlag', 'Suspenso', 2005, 1)
