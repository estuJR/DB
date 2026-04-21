USE tienda_db;

-- CATEGORIAS
INSERT INTO categorias (nombre, descripcion) VALUES
('Electrónica',  'Dispositivos y accesorios electrónicos'),
('Ropa',         'Prendas de vestir para toda la familia'),
('Alimentos',    'Productos comestibles y bebidas'),
('Hogar',        'Artículos para el hogar y decoración'),
('Herramientas', 'Herramientas manuales y eléctricas'),
('Deportes',     'Artículos deportivos y de fitness'),
('Libros',       'Libros y material educativo'),
('Juguetes',     'Juguetes y juegos para niños'),
('Salud',        'Productos de salud y cuidado personal'),
('Automotriz',   'Accesorios y repuestos para vehículos');

-- PROVEEDORES
INSERT INTO proveedores (nombre, telefono, email, direccion) VALUES
('Distribuidora Guate S.A.', '2234-5678', 'ventas@distguate.com',   'Zona 12, Guatemala City'),
('Importaciones Azteca',     '2278-1234', 'contacto@azteca.gt',     'Zona 10, Guatemala City'),
('TechSupply GT',            '2345-6789', 'info@techsupply.gt',     'Mixco, Guatemala'),
('Textiles del Norte',       '7832-4567', 'pedidos@texnorte.gt',    'Quetzaltenango'),
('AlimentosFrescos Ltda.',   '2290-1234', 'logistica@alfrescos.gt', 'Villa Nueva, Guatemala'),
('HogarMax',                 '2367-8901', 'ventas@hogarmax.gt',     'Zona 11, Guatemala City'),
('FerrePlus',                '7823-9012', 'pedidos@ferreplus.gt',   'Escuintla'),
('SportZone Guatemala',      '2312-3456', 'mayoreo@sportzone.gt',   'Zona 4, Guatemala City'),
('Editorial Centroamérica',  '2289-5678', 'dist@edca.gt',           'Zona 1, Guatemala City'),
('AutoPartes Chapín',        '2356-7890', 'ventas@autopartes.gt',   'Zona 7, Guatemala City');

-- PRODUCTOS
INSERT INTO productos (nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor) VALUES
('Laptop HP 15"',       'Laptop 8GB RAM 256GB SSD',           4500.00, 15, 1, 3),
('Mouse Inalámbrico',   'Mouse USB 2.4GHz ergonómico',           85.00, 80, 1, 3),
('Teclado Mecánico',    'Teclado retroiluminado',               350.00, 40, 1, 3),
('Monitor 24"',         'Monitor FHD 75Hz IPS',               1800.00, 20, 1, 3),
('Auriculares BT',      'Auriculares Bluetooth over-ear',       420.00, 35, 1, 3),
('Camisa Oxford',       'Camisa de algodón 100%',               120.00,150, 2, 4),
('Pantalón Jean',       'Jean clásico corte recto',             195.00,200, 2, 4),
('Vestido Floral',      'Vestido casual primavera',             175.00,100, 2, 4),
('Chaqueta Polar',      'Polar con cierre completo',            280.00, 60, 2, 4),
('Calcetines x3',       'Pack 3 pares algodón',                  35.00,300, 2, 4),
('Arroz 5lb',           'Arroz grano largo',                     28.00,500, 3, 5),
('Aceite Vegetal 1L',   'Aceite de maíz refinado',               22.00,400, 3, 5),
('Frijol Negro 2lb',    'Frijol negro seco selecto',             18.00,600, 3, 5),
('Pasta Spaghetti',     'Pasta de trigo 500g',                   12.00,350, 3, 5),
('Café Molido 500g',    'Café 100% guatemalteco',                65.00,250, 3, 5),
('Sartén 28cm',         'Sartén recubrimiento cerámico',        185.00, 45, 4, 6),
('Juego de Sábanas',    'Sábanas queen microfibra',             220.00, 30, 4, 6),
('Lámpara LED',         'Lámpara escritorio USB',                95.00, 70, 4, 6),
('Cojín Decorativo',    'Cojín 40x40cm varios diseños',          55.00, 90, 4, 6),
('Organizador Closet',  'Organizador 6 estantes',               145.00, 25, 4, 6),
('Taladro 500W',        'Taladro percutor + brocas',            650.00, 18, 5, 7),
('Sierra Circular',     'Sierra 1400W disco 185mm',             980.00, 10, 5, 7),
('Cinta Métrica 5m',    'Cinta métrica profesional',             42.00,120, 5, 7),
('Balón de Fútbol',     'Balón cuero PU talla 5',               145.00, 60, 6, 8),
('Mancuernas 5kg x2',   'Mancuernas hierro recubiertas',        320.00, 25, 6, 8),
('Libro Algoritmos',    'Introducción a Algoritmos CLRS',       395.00, 20, 7, 9),
('Novela Bestseller',   'Ficción contemporánea premiada',        85.00, 45, 7, 9),
('Rompecabezas 1000pz', 'Puzzle paisaje 1000 piezas',           110.00, 35, 8,10),
('Aceite Motor 5W-30',  'Aceite sintético 1 cuarto',             95.00, 80,10,10),
('Kit Limpieza Auto',   'Shampoo + cera + esponja',             145.00, 55,10,10);

-- CLIENTES
INSERT INTO clientes (nombre, apellido, email, telefono) VALUES
('María',     'González', 'mgonzalez@gmail.com',  '5512-3456'),
('Carlos',    'Pérez',    'cperez@hotmail.com',    '4423-7890'),
('Ana',       'Martínez', 'amartinez@gmail.com',   '3345-6789'),
('Luis',      'López',    'llopez@yahoo.com',      '5567-8901'),
('Sofía',     'García',   'sgarcia@gmail.com',     '4478-9012'),
('Jorge',     'Rodríguez','jrodriguez@gmail.com',  '3390-1234'),
('Valentina', 'Herrera',  'vherrera@hotmail.com',  '5501-2345'),
('Roberto',   'Díaz',     'rdiaz@gmail.com',       '4412-3456'),
('Paola',     'Jiménez',  'pjimenez@yahoo.com',    '3323-4567'),
('Miguel',    'Torres',   'mtorres@gmail.com',     '5534-5678'),
('Fernanda',  'Flores',   'fflores@gmail.com',     '4445-6789'),
('Andrés',    'Chávez',   'achavez@hotmail.com',   '3356-7890'),
('Daniela',   'Morales',  'dmorales@gmail.com',    '5567-8901'),
('Ricardo',   'Ramírez',  'rramirez@yahoo.com',    '4478-9012'),
('Camila',    'Castro',   'ccastro@gmail.com',     '3389-0123'),
('Eduardo',   'Vargas',   'evargas@gmail.com',     '5590-1234'),
('Laura',     'Reyes',    'lreyes@hotmail.com',    '4401-2345'),
('Sebastián', 'Ortiz',    'sortiz@gmail.com',      '3312-3456'),
('Natalia',   'Mendoza',  'nmendoza@yahoo.com',    '5523-4567'),
('Francisco', 'Ruiz',     'fruiz@gmail.com',       '4434-5678'),
('Karla',     'Núñez',    'knunez@gmail.com',      '3345-6789'),
('Diego',     'Aguilar',  'daguilar@hotmail.com',  '5556-7890'),
('Isabella',  'Vega',     'ivega@gmail.com',       '4467-8901'),
('Emilio',    'Ríos',     'erios@yahoo.com',       '3378-9012'),
('Mariana',   'Molina',   'mmolina@gmail.com',     '5589-0123');

-- EMPLEADOS
INSERT INTO empleados (nombre, apellido, cargo, email, password_hash) VALUES
('Elena', 'Castillo','Gerente',   'ecastillo@tienda.gt','$2b$10$QIbY4BWIZl9Gtd0AytSRCuoMs.J5ULYaIYEe8/bJPIQsO/Tg5mUrq'),
('Marco', 'Solís',   'Vendedor',  'msolis@tienda.gt',   '$2b$10$QIbY4BWIZl9Gtd0AytSRCuoMs.J5ULYaIYEe8/bJPIQsO/Tg5mUrq'),
('Rosa',  'Fuentes', 'Vendedor',  'rfuentes@tienda.gt', '$2b$10$QIbY4BWIZl9Gtd0AytSRCuoMs.J5ULYaIYEe8/bJPIQsO/Tg5mUrq'),
('David', 'Barrios', 'Cajero',    'dbarrios@tienda.gt', '$2b$10$QIbY4BWIZl9Gtd0AytSRCuoMs.J5ULYaIYEe8/bJPIQsO/Tg5mUrq'),
('Gloria','Salazar', 'Bodeguero', 'gsalazar@tienda.gt', '$2b$10$QIbY4BWIZl9Gtd0AytSRCuoMs.J5ULYaIYEe8/bJPIQsO/Tg5mUrq');

-- VENTAS
INSERT INTO ventas (fecha_hora, total, estado, id_cliente, id_empleado) VALUES
('2026-01-05 09:15:00',  585.00,'completada', 1, 2),
('2026-01-07 10:30:00',  345.00,'completada', 2, 3),
('2026-01-08 11:00:00', 4500.00,'completada', 3, 2),
('2026-01-10 14:20:00',  220.00,'completada', 4, 4),
('2026-01-12 09:45:00',  650.00,'completada', 5, 3),
('2026-01-15 16:00:00',  205.00,'completada', 6, 2),
('2026-01-18 10:10:00',  395.00,'completada', 7, 4),
('2026-01-20 13:30:00',  150.00,'completada', 8, 3),
('2026-01-22 11:50:00',  280.00,'completada', 9, 2),
('2026-01-25 15:20:00', 1800.00,'completada',10, 4),
('2026-02-01 09:00:00',  138.00,'completada',11, 3),
('2026-02-03 10:45:00',  420.00,'completada',12, 2),
('2026-02-05 12:00:00',  145.00,'completada',13, 4),
('2026-02-08 14:30:00',  320.00,'completada',14, 3),
('2026-02-10 09:20:00',  730.00,'completada',15, 2),
('2026-02-12 11:10:00',  110.00,'completada',16, 4),
('2026-02-15 16:40:00',  175.00,'completada',17, 3),
('2026-02-18 10:30:00',  205.00,'completada',18, 2),
('2026-02-20 13:00:00',  980.00,'completada',19, 4),
('2026-02-22 09:55:00',  420.00,'completada',20, 3),
('2026-03-01 11:25:00',  350.00,'completada',21, 2),
('2026-03-05 14:50:00',  145.00,'completada',22, 4),
('2026-03-08 10:15:00',  240.00,'completada',23, 3),
('2026-03-10 09:30:00',   46.00,'completada',24, 2),
('2026-03-12 15:45:00', 4500.00,'pendiente', 25, 4);

-- DETALLE_VENTA
INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario_venta) VALUES
(1,  6, 2, 120.00), (1, 10, 3,  35.00), (1,  9, 1, 280.00),
(2,  7, 1, 195.00), (2,  8, 1, 175.00),
(3,  1, 1,4500.00),
(4, 17, 1, 220.00),
(5, 21, 1, 650.00),
(6, 15, 2,  65.00), (6, 11, 3,  28.00), (6, 12, 2,  22.00),
(7, 26, 1, 395.00),
(8, 19, 1,  55.00), (8, 18, 1,  95.00),
(9,  9, 1, 280.00),
(10, 4, 1,1800.00),
(11,13, 3,  18.00), (11,14, 2,  12.00), (11,11, 3,  28.00),
(12, 5, 1, 420.00),
(13,24, 1, 145.00),
(14,25, 1, 320.00),
(15, 3, 1, 350.00), (15, 2, 1,  85.00), (15,18, 1,  95.00), (15,16,1,185.00),
(16,28, 1, 110.00),
(17, 8, 1, 175.00),
(18, 6, 1, 120.00), (18,27, 1,  85.00),
(19,22, 1, 980.00),
(20, 5, 1, 420.00),
(21, 3, 1, 350.00),
(22,24, 1, 145.00),
(23,29, 1,  95.00), (23,30, 1, 145.00),
(24,10, 1,  35.00), (24,13, 1,  18.00),
(25, 1, 1,4500.00);

