USE tienda_db;
SET NAMES utf8mb4;

-- ============================================================
-- ROLES EN EL DBMS
-- ============================================================

CREATE ROLE IF NOT EXISTS 'rol_gerente';
CREATE ROLE IF NOT EXISTS 'rol_vendedor';
CREATE ROLE IF NOT EXISTS 'rol_cajero';
CREATE ROLE IF NOT EXISTS 'rol_bodeguero';
CREATE ROLE IF NOT EXISTS 'rol_consultor';

-- Gerente: acceso total
GRANT ALL PRIVILEGES ON tienda_db.* TO 'rol_gerente';

-- Vendedor: lectura general, crear ventas y descontar stock
GRANT SELECT ON tienda_db.* TO 'rol_vendedor';
GRANT INSERT, UPDATE ON tienda_db.ventas TO 'rol_vendedor';
GRANT INSERT ON tienda_db.detalle_venta TO 'rol_vendedor';
GRANT UPDATE (stock) ON tienda_db.productos TO 'rol_vendedor';

-- Cajero: gestionar ventas y clientes
-- Lectura general; se revoca acceso a datos personales de empleados
GRANT SELECT ON tienda_db.* TO 'rol_cajero';
REVOKE SELECT ON tienda_db.empleados FROM 'rol_cajero';
GRANT INSERT, UPDATE ON tienda_db.ventas TO 'rol_cajero';
GRANT INSERT ON tienda_db.detalle_venta TO 'rol_cajero';
GRANT INSERT, UPDATE ON tienda_db.clientes TO 'rol_cajero';

-- Bodeguero: gestionar productos e inventario
-- Lectura general; se revoca acceso a ventas, clientes y empleados
GRANT SELECT ON tienda_db.* TO 'rol_bodeguero';
REVOKE SELECT ON tienda_db.ventas FROM 'rol_bodeguero';
REVOKE SELECT ON tienda_db.detalle_venta FROM 'rol_bodeguero';
REVOKE SELECT ON tienda_db.clientes FROM 'rol_bodeguero';
REVOKE SELECT ON tienda_db.empleados FROM 'rol_bodeguero';
GRANT INSERT, UPDATE, DELETE ON tienda_db.productos TO 'rol_bodeguero';

-- Consultor: solo lectura para reportes
-- Lectura general; se revoca acceso a datos sensibles de empleados
GRANT SELECT ON tienda_db.* TO 'rol_consultor';
REVOKE SELECT ON tienda_db.empleados FROM 'rol_consultor';

-- Usuarios de prueba con sus roles asignados
CREATE USER IF NOT EXISTS 'u_gerente'@'%'   IDENTIFIED BY 'secret123';
CREATE USER IF NOT EXISTS 'u_vendedor'@'%'  IDENTIFIED BY 'secret123';
CREATE USER IF NOT EXISTS 'u_cajero'@'%'    IDENTIFIED BY 'secret123';
CREATE USER IF NOT EXISTS 'u_bodeguero'@'%' IDENTIFIED BY 'secret123';
CREATE USER IF NOT EXISTS 'u_consultor'@'%' IDENTIFIED BY 'secret123';

GRANT 'rol_gerente'   TO 'u_gerente'@'%';
GRANT 'rol_vendedor'  TO 'u_vendedor'@'%';
GRANT 'rol_cajero'    TO 'u_cajero'@'%';
GRANT 'rol_bodeguero' TO 'u_bodeguero'@'%';
GRANT 'rol_consultor' TO 'u_consultor'@'%';

SET DEFAULT ROLE ALL TO
  'u_gerente'@'%',
  'u_vendedor'@'%',
  'u_cajero'@'%',
  'u_bodeguero'@'%',
  'u_consultor'@'%';

-- Usuario principal de la app
GRANT ALL PRIVILEGES ON tienda_db.* TO 'proy3'@'%';
FLUSH PRIVILEGES;

-- ============================================================
-- STORED PROCEDURES
-- ============================================================

DELIMITER $$

-- SP 1: Crear venta (transacción + ROLLBACK dentro del SP)
DROP PROCEDURE IF EXISTS sp_crear_venta$$
CREATE PROCEDURE sp_crear_venta(
  IN  in_cliente_id  INT,
  IN  in_empleado_id INT,
  IN  in_producto_id INT,
  IN  in_cantidad    INT,
  OUT out_venta_id   INT,
  OUT out_error      VARCHAR(255)
)
sp_crear_venta: BEGIN
  DECLARE v_stock  INT DEFAULT 0;
  DECLARE v_precio DECIMAL(10,2) DEFAULT 0;
  DECLARE v_total  DECIMAL(12,2) DEFAULT 0;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SET out_venta_id = 0;
    SET out_error    = 'Error interno al crear la venta';
  END;

  SET out_venta_id = 0;
  SET out_error    = '';

  START TRANSACTION;

  SELECT stock, precio_unitario INTO v_stock, v_precio
    FROM productos WHERE id_producto = in_producto_id FOR UPDATE;

  IF v_stock IS NULL THEN
    SET out_error = 'Producto no encontrado';
    ROLLBACK;
    LEAVE sp_crear_venta;
  END IF;

  IF v_stock < in_cantidad THEN
    SET out_error = CONCAT('Stock insuficiente. Disponible: ', v_stock);
    ROLLBACK;
    LEAVE sp_crear_venta;
  END IF;

  SET v_total = v_precio * in_cantidad;

  INSERT INTO ventas (total, estado, id_cliente, id_empleado)
    VALUES (v_total, 'completada', in_cliente_id, in_empleado_id);
  SET out_venta_id = LAST_INSERT_ID();

  INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario_venta)
    VALUES (out_venta_id, in_producto_id, in_cantidad, v_precio);

  UPDATE productos SET stock = stock - in_cantidad
    WHERE id_producto = in_producto_id;

  COMMIT;
END$$

-- SP 2: Actualizar stock (IN/OUT + manejo de excepciones)
DROP PROCEDURE IF EXISTS sp_actualizar_stock$$
CREATE PROCEDURE sp_actualizar_stock(
  IN  in_producto_id  INT,
  IN  in_delta        INT,
  OUT out_nuevo_stock INT,
  OUT out_error       VARCHAR(255)
)
sp_actualizar_stock: BEGIN
  DECLARE v_stock_actual INT DEFAULT 0;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    SET out_nuevo_stock = -1;
    SET out_error = 'Error al actualizar el stock';
  END;

  SET out_nuevo_stock = -1;
  SET out_error       = '';

  SELECT stock INTO v_stock_actual
    FROM productos WHERE id_producto = in_producto_id;

  IF v_stock_actual IS NULL THEN
    SET out_error       = 'Producto no encontrado';
    SET out_nuevo_stock = -1;
    LEAVE sp_actualizar_stock;
  END IF;

  IF (v_stock_actual + in_delta) < 0 THEN
    SET out_error       = 'El ajuste dejaría stock negativo';
    SET out_nuevo_stock = v_stock_actual;
    LEAVE sp_actualizar_stock;
  END IF;

  UPDATE productos SET stock = stock + in_delta
    WHERE id_producto = in_producto_id;

  SET out_nuevo_stock = v_stock_actual + in_delta;
END$$

-- SP 3: Registrar cliente (IN/OUT + excepción por email duplicado)
DROP PROCEDURE IF EXISTS sp_registrar_cliente$$
CREATE PROCEDURE sp_registrar_cliente(
  IN  in_nombre    VARCHAR(80),
  IN  in_apellido  VARCHAR(80),
  IN  in_email     VARCHAR(120),
  IN  in_telefono  VARCHAR(20),
  OUT out_id       INT,
  OUT out_error    VARCHAR(255)
)
sp_registrar_cliente: BEGIN
  DECLARE v_existe INT DEFAULT 0;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    SET out_id    = 0;
    SET out_error = 'Error al registrar el cliente';
  END;

  SET out_id    = 0;
  SET out_error = '';

  SELECT COUNT(*) INTO v_existe FROM clientes WHERE email = in_email;

  IF v_existe > 0 THEN
    SET out_id    = 0;
    SET out_error = 'Ya existe un cliente con ese email';
    LEAVE sp_registrar_cliente;
  END IF;

  INSERT INTO clientes (nombre, apellido, email, telefono)
    VALUES (in_nombre, in_apellido, in_email, in_telefono);
  SET out_id = LAST_INSERT_ID();
END$$

-- SP 4: Anular venta (transacción explícita + ROLLBACK)
DROP PROCEDURE IF EXISTS sp_anular_venta$$
CREATE PROCEDURE sp_anular_venta(
  IN  in_venta_id    INT,
  OUT out_resultado  VARCHAR(100)
)
sp_anular_venta: BEGIN
  DECLARE v_estado VARCHAR(20);
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SET out_resultado = 'ERROR: fallo al anular la venta';
  END;

  SET out_resultado = '';

  START TRANSACTION;

  SELECT estado INTO v_estado FROM ventas
    WHERE id_venta = in_venta_id FOR UPDATE;

  IF v_estado IS NULL THEN
    ROLLBACK;
    SET out_resultado = 'ERROR: venta no encontrada';
    LEAVE sp_anular_venta;
  END IF;

  IF v_estado = 'anulada' THEN
    ROLLBACK;
    SET out_resultado = 'ERROR: la venta ya estaba anulada';
    LEAVE sp_anular_venta;
  END IF;

  UPDATE productos p
    JOIN detalle_venta d ON p.id_producto = d.id_producto
    SET p.stock = p.stock + d.cantidad
    WHERE d.id_venta = in_venta_id;

  UPDATE ventas SET estado = 'anulada' WHERE id_venta = in_venta_id;

  COMMIT;
  SET out_resultado = 'OK: venta anulada exitosamente';
END$$

-- SP 5: Resumen de ventas por empleado (IN/OUT params de salida)
DROP PROCEDURE IF EXISTS sp_reporte_empleado$$
CREATE PROCEDURE sp_reporte_empleado(
  IN  in_empleado_id   INT,
  OUT out_total_ventas INT,
  OUT out_monto_total  DECIMAL(12,2),
  OUT out_error        VARCHAR(255)
)
sp_reporte_empleado: BEGIN
  DECLARE v_existe INT DEFAULT 0;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    SET out_total_ventas = 0;
    SET out_monto_total  = 0;
    SET out_error        = 'Error al generar reporte';
  END;

  SET out_total_ventas = 0;
  SET out_monto_total  = 0;
  SET out_error        = '';

  SELECT COUNT(*) INTO v_existe
    FROM empleados WHERE id_empleado = in_empleado_id;

  IF v_existe = 0 THEN
    SET out_error = 'Empleado no encontrado';
    LEAVE sp_reporte_empleado;
  END IF;

  SELECT COUNT(*), COALESCE(SUM(total), 0)
    INTO out_total_ventas, out_monto_total
    FROM ventas
    WHERE id_empleado = in_empleado_id AND estado = 'completada';
END$$

DELIMITER ;
