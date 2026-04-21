CREATE DATABASE IF NOT EXISTS tienda_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tienda_db;

CREATE TABLE categorias (
    id_categoria  INT          NOT NULL AUTO_INCREMENT,
    nombre        VARCHAR(80)  NOT NULL,
    descripcion   VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_categoria)
);

CREATE TABLE proveedores (
    id_proveedor  INT          NOT NULL AUTO_INCREMENT,
    nombre        VARCHAR(120) NOT NULL,
    telefono      VARCHAR(20)  NOT NULL,
    email         VARCHAR(120) NOT NULL,
    direccion     VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_proveedor)
);

CREATE TABLE productos (
    id_producto     INT           NOT NULL AUTO_INCREMENT,
    nombre          VARCHAR(120)  NOT NULL,
    descripcion     VARCHAR(255)  NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    stock           INT           NOT NULL DEFAULT 0,
    id_categoria    INT           NOT NULL,
    id_proveedor    INT           NOT NULL,
    PRIMARY KEY (id_producto),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor)
);

CREATE TABLE clientes (
    id_cliente  INT          NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(80)  NOT NULL,
    apellido    VARCHAR(80)  NOT NULL,
    email       VARCHAR(120) NOT NULL,
    telefono    VARCHAR(20)  NOT NULL,
    PRIMARY KEY (id_cliente)
);

CREATE TABLE empleados (
    id_empleado   INT          NOT NULL AUTO_INCREMENT,
    nombre        VARCHAR(80)  NOT NULL,
    apellido      VARCHAR(80)  NOT NULL,
    cargo         VARCHAR(60)  NOT NULL,
    email         VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_empleado)
);

CREATE TABLE ventas (
    id_venta    INT           NOT NULL AUTO_INCREMENT,
    fecha_hora  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total       DECIMAL(12,2) NOT NULL,
    estado      ENUM('pendiente','completada','anulada') NOT NULL DEFAULT 'pendiente',
    id_cliente  INT           NOT NULL,
    id_empleado INT           NOT NULL,
    PRIMARY KEY (id_venta),
    FOREIGN KEY (id_cliente)  REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
);

CREATE TABLE detalle_venta (
    id_detalle            INT           NOT NULL AUTO_INCREMENT,
    id_venta              INT           NOT NULL,
    id_producto           INT           NOT NULL,
    cantidad              INT           NOT NULL,
    precio_unitario_venta DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_detalle),
    FOREIGN KEY (id_venta)    REFERENCES ventas(id_venta),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

CREATE INDEX idx_ventas_fecha        ON ventas(fecha_hora);
CREATE INDEX idx_productos_categoria ON productos(id_categoria);
CREATE INDEX idx_clientes_email      ON clientes(email);

CREATE OR REPLACE VIEW vista_ventas_detalle AS
SELECT
    v.id_venta,
    v.fecha_hora,
    v.total,
    v.estado,
    CONCAT(c.nombre, ' ', c.apellido) AS cliente,
    CONCAT(e.nombre, ' ', e.apellido) AS empleado,
    p.nombre                          AS producto,
    d.cantidad,
    d.precio_unitario_venta
FROM ventas v
JOIN clientes      c ON v.id_cliente  = c.id_cliente
JOIN empleados     e ON v.id_empleado = e.id_empleado
JOIN detalle_venta d ON v.id_venta    = d.id_venta
JOIN productos     p ON d.id_producto = p.id_producto;