INSERT IGNORE INTO users (id, username, role, email, first_name, last_name, telephone, dni, profile_picture, password, plan, payment_plan_date, expire_plan_date, receives_emails) VALUES 
-- clientes
(1, 'D4nielBH', 'CLIENT', 'danbenhid@alum.us.es', 'Daniel', 'Benito Hidalgo', '123456789', '02000000A', 'https://i.pinimg.com/736x/cc/e6/e8/cce6e81540e6282c551f01937049614e.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', null, null, null, false),
(2, 'alice123', 'CLIENT', 'alice@example.com', 'Alice', 'Johnson', '123456789', '00000000A', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Alice_in_wonderland_1951.jpg/1200px-Alice_in_wonderland_1951.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', null, null, null, false),
(3, 'Natalii', 'CLIENT', 'natolmvil@alum.us.es', 'Natalia', 'Olmo Villegas', '567123890', '22222222A', 'https://media.licdn.com/dms/image/v2/D5603AQEG3z5ORRPXow/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1726919084266?e=2147483647&v=beta&t=atwQwaGmE3k9Zi-YdTCTkr5SzHngGKY44vfcAZdhaY4', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', null, null, null, false),
(4, 'PabloCC', 'CLIENT', 'pabcascom@alum.us.es', 'Pablo', 'Castellanos Compaña', '654321987', '33333333A', 'https://i.pinimg.com/736x/06/f0/79/06f07921405f71844818fa78bd8064f0.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', null, null, null, false),
(5, 'MariaCT', 'CLIENT', 'marcartal1@alum.us.es', 'María', 'Carrera Talaverón', '987654321', '11111111A', 'https://pbs.twimg.com/media/EyaRtQoWgAMd7iU.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', null, null, null, true),
(16, 'Fraan', 'CLIENT', 'fraavicar@alum.us.es.com', 'Fran', 'Avilés Carrera', '321789654', '44444444A', 'https://media.licdn.com/dms/image/v2/D4E03AQFk3oiu-3OLDQ/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1731263648526?e=2147483647&v=beta&t=iWb8NwRLUnxVmF34sGj0DReKSFEHm-99wXLlEH5ebPA', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', null, null, null, false),
-- proveedores
(6, 'El castillo de Maxi', 'SUPPLIER', 'CastilloMaxi@example.com', 'Castillo', 'Maxi', '930348923', '55555555A', 'https://www.guiacatering.com/site/company/a7/1176/images/366309/el-castillo-de-maxi_ci3.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', "PREMIUM", '2025-03-20 22:00:00', '2025-04-20 22:00:00', false),
(7, 'JLMorilla', 'SUPPLIER', 'foto@juanluismorilla.com', 'Juan Luis', 'Morilla', '123456789', '66666666A', 'https://www.juanluismorilla.com/wp-content/uploads/2020/06/JLM_logomarca_RGB.png', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', "PREMIUM", '2025-03-20 22:00:00', '2025-04-20 22:00:00', false),
(8, 'JMGomez', 'SUPPLIER', 'jmgosevilla@gmail.com', 'Jose Manuel', 'Gomez', '123456789', '77777777A', 'https://www.corteganaiberico.com/wp-content/uploads/2021/10/pata-negra-y-jamon-iberico-1.png', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', "PREMIUM", '2025-03-20 22:00:00', '2025-04-20 22:00:00', false),
(9, 'JMGonzalez', 'SUPPLIER', 'gonzalezcaraballojosemanuel@gmail.com', 'Jose Manuel', 'Gonzalez Caraballo', '123456789', '88888888A', 'https://www.jamonibericomatas.com/wp-content/uploads/2022/01/Consejos-sobre-como-cortar-jamon-iberico-de-bellota.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', "BASIC", null, null, false),
(10, 'FelipeGN', 'SUPPLIER', 'felielectri@gmail.com', 'Felipe', 'G', '123456789', '99999999A', 'https://www.shutterstock.com/image-photo/woman-cutting-cheese-kitchen-slicing-600nw-2441834571.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', "BASIC", null, null, false),
(11, 'DLDecor', 'SUPPLIER', 'info@davidlaradecor.es', 'David', 'Lara', '123456789', '00000000B', 'https://www.davidlaradecor.es/wp-content/uploads/2018/01/logo-portada.png', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', "BASIC", null, null, false),
(12, 'Master Sound', 'SUPPLIER', 'danielvillarrealgallardo@gmail.com', 'Daniel', 'Villareal Gallardo', '123456789', '11111111B', 'https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_54/545096/17370601_800.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', "BASIC", null, null, false),
(13, 'ARCOS 3 CATERING', 'SUPPLIER', 'mariatrigueros16.maccga@gmail.com', 'Maria', 'Trigueros', '123456789', '22222222B', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvhC6mgSHclnNr2RPV1gDcZl7F0sC-ND4pcw&s', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', "BASIC", null, null, false),
(14, 'Mongo mango', 'SUPPLIER', 'mongomango@example.com', 'Mongo', 'Mango', '932649056', '33333333B', 'https://vientosolar.org/wp-content/uploads/2016/03/bpp8409a-401x249.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', "BASIC", null, null, false),
-- admin
(15, 'admin', 'ADMIN', 'admin@example.com', 'Admin', 'Soyadmin', '666666666', '44444144A', 'https://proassets.planetadelibros.com/usuaris/seudonimos/fotos/53/original/000052233_1_King_AuthorPhoto_c_Lindsay_Mills_2018.jpeg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', null, null, null, false);

INSERT IGNORE INTO venues (id, postal_code, coordinates, address, max_guests, surface, name, available, city_available, service_price_guest, service_price_hour, picture, description, user_id, limited_by_price_per_guest, limited_by_price_per_hour, fixed_price, earliest_time, latest_time) VALUES 
(1, '41001', '37.388630, -5.982430', 'Calle Sierpes, 1', 110, 100.00, 'Castillo de Maxi' ,TRUE, 'Sevilla', null, null, 'https://www.guiacatering.com/site/company/a7/1176/images/366309/el-castillo-de-maxi_ci3.jpg', '¿Sabías que entre nuestros servicios se encuentra la posibilidad de disfrutar de un castillo hinchable? ¡Los más pequeños se lo pasarán en grande!', 6, FALSE, FALSE, 1500.00, '09:00:00', '23:59:00'),
(2, '41002', '37.388630, -5.982430', 'Calle Sierpes, 2', 200, 180.00, 'Mongo Mangos' ,TRUE, 'Sevilla', null, 400.00,'https://vientosolar.org/wp-content/uploads/2016/03/bpp8409a-401x249.jpg', 'Proporcionamos un lugar apegado a la naturaleza para que puedas disfrutar de un evento inolvidable.', 14, FALSE, TRUE, null, '09:00:00', '23:59:00');

INSERT IGNORE INTO other_services (id, other_service_type, extra_information, name, available, city_available, service_price_guest, service_price_hour, picture, description, user_id, limited_by_price_per_guest, limited_by_price_per_hour, fixed_price) VALUES
(1, 'ENTERTAINMENT', 'Servicio de fotografía',  'Fotografías J. L. Morilla' ,TRUE, 'Sevilla', 500.00, null, 'https://www.juanluismorilla.com/wp-content/uploads/2020/06/JLM_logomarca_RGB.png', 'Soy Juan Luis, fotógrafo de bodas con más de 20 años de experiencia, y el encargado de daros un álbum de fotos con el que podáis revivir el día de vuestra boda, una y otra vez, con todo lujo de detalles.', 7, TRUE, FALSE, null),
(2, 'CATERING', 'Cortador de jamon',  'Cortador de jamón J. M. Gomez' ,TRUE, 'Sevilla', null, 300.00, 'https://www.corteganaiberico.com/wp-content/uploads/2021/10/pata-negra-y-jamon-iberico-1.png', 'Eleva la experiencia gastronómica con cortes precisos y elegantes. Especializado en el arte del jamón, combina destreza, técnica y conocimiento del producto para resaltar su sabor y textura. Ideal para eventos, restaurantes o amantes del jamón que buscan un servicio de calidad y presentación impecable.', 8, FALSE, TRUE, null),
(3, 'CATERING', 'Cortador de jamon',  'Cortador de jamón J. M. Gonzalez' ,TRUE, 'Sevilla', null, 400.00, 'https://www.jamonibericomatas.com/wp-content/uploads/2022/01/Consejos-sobre-como-cortar-jamon-iberico-de-bellota.jpg', 'Más que un oficio, un arte. Con habilidad y precisión, transforma cada pieza de jamón en finas lonchas que realzan su sabor y aroma. Un equilibrio perfecto entre técnica, tradición y pasión, ofreciendo una experiencia gastronómica única en eventos, celebraciones o catas especializadas', 9, FALSE, TRUE, null),
(4, 'CATERING', 'Cortador de queso',  'Cortador de queso FelipeGN' ,TRUE, 'Sevilla', null, 200.00, 'https://cdn.shopify.com/s/files/1/0399/9901/3016/files/CORTAR_EL_QUESO-2.png?v=1740041498', 'En un rincón, cortando queso… Con paciencia y precisión, el maestro cortador transforma cada pieza en porciones perfectas, resaltando su textura y sabor. Entre aromas intensos y tablas bien dispuestas, su oficio convierte cada corte.', 10, FALSE, TRUE, null),
(5, 'DECORATION', 'Decorador de eventos',  'Decorador de eventos DLDecor' ,TRUE, 'Sevilla', null, null, 'https://www.davidlaradecor.es/wp-content/uploads/2018/01/logo-portada.png', 'Convierte tus eventos en experiencias inolvidables. Con un estilo único y creativo, el decorador de eventos transforma espacios en escenarios de ensueño, llenos de color, texturas y detalles que reflejan tu personalidad y estilo.', 11, FALSE, FALSE, 200.00),
(6, 'ENTERTAINMENT', 'Sonido para eventos',  'Master Sound' ,TRUE, 'Sevilla', null, 200.00, 'https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_54/545096/17370601_800.jpg', 'Con nosotros no te perderás nada. En Master Sound, te escuchamos.', 12, FALSE, TRUE, null),
(7, 'CATERING', 'Catering para eventos',  'ARCOS 3 CATERING' ,TRUE, 'Sevilla', 200.00, null, 'https://cdn0.bodas.net/vendor/16070/3_2/960/jpeg/whatsapp-image-2022-11-17-at-1-15-18-pm_1_16070-166868815185642.jpeg', 'Nos ponemos a tu servicio con nuestro equipo de profesionales preocupados por que todo salga perfecto en cualquier tipo de evento o celebración que realicen.', 13, TRUE, FALSE, null);

INSERT IGNORE INTO events (id, event_type, guests, budget, event_date, payment_date, confirmed_guests, paid, user_id) VALUES
(1, 'WEDDING', 120, 1100.00, '2026-12-31', '2026-08-31', 115, TRUE, 1),
(2, 'CHRISTENING', 50, 500.00, '2026-12-31', '2026-10-31', 40, TRUE, 2),
(3, 'WEDDING', 200, 1700.00, '2026-12-31', '2026-08-31', 190, TRUE, 3),
(4, 'COMMUNION', 100, 900.00, '2026-12-31', '2026-11-30', 90, TRUE, 4),
(5, 'WEDDING', 100, 10000.00, '2026-12-31', '2026-08-31', 90, TRUE, 5),
(6, 'WEDDING', 100, 10000.00, '2026-06-30', '2026-02-28', 90, TRUE, 1),
(7, 'CHRISTENING', 50, 5000.00, '2026-07-30', '2026-05-30', 40, TRUE, 2),
(8, 'COMMUNION', 30, 3000.00, '2026-08-30', '2026-07-30', 25, TRUE, 3),
(9, 'WEDDING', 200, 20000.00, '2026-09-30', '2026-05-30', 190, TRUE, 4),
(10, 'CHRISTENING', 100, 11000.00, '2026-10-30', '2026-08-30', 90, TRUE, 5);


INSERT IGNORE INTO invitations (id, first_name, last_name, telephone, email, invitation_type, event_id) VALUES
(1, 'Antonio', 'Martinez Ares', '654000111', 'oveja@example.com', 'SENT', 1),
(2, 'Juan Manuel', 'Braza Benitez', '654000112', 'sheriff@example.com', 'SENT', 1),
(3, 'Juan Carlos', 'Aragon', '654000113', 'veneno@example.com', 'SENT', 2),
(4, 'Manolo', 'Santander', '654000114', 'viña@example.com', 'SENT', 2),
(5, 'Jesus', 'Bienvenido', '654000115', 'rata@example.com', 'SENT', 3),
(6, 'Antonio', 'Martin', '654000116', 'musa@example.com', 'SENT', 3),
(7, 'Jose', 'Guerrero', '654000117', 'yuyu@example.com', 'SENT', 4),
(8, 'Francisco', 'Alba', '654000118', 'caleta@example.com', 'SENT', 4),
(9, 'Kike', 'Remolino', '654000119', 'heavy@example.com', 'SENT', 5),
(10, 'Julio', 'Pardo', '654000110',  'opera@example.com', 'SENT', 5);


INSERT IGNORE INTO ratings (id, user_id, other_service_id, venue_id, stars, comment) VALUES
--user 1
(1, 1, null, 1, 5, 'Great venue, had an amazing time!'),
(2, 1, 1, null, 4, 'Great photography service, would recommend!'),
(3, 1, 2, null, 4, 'Great service, would recommend!'),
--user2
(4, 2, null, 1, 3, 'Good venue, but could be better.'),
(5, 2, 1, null, 5, 'Great photography service, would recommend!'),
(6, 1, 3, null, 4, 'Great service, would recommend!'),
(7, 1, 6, null, 4, 'Great service, would recommend!'),
--user3
(8, 3, null, 1, 5, 'Great venue, had an amazing time!'),
(9, 3, 1, null, 4, 'Great photography service, would recommend!'),
(10, 1, 4, null, 4, 'Great service, would recommend!'),
(11, 1, 5, null, 4, 'Great service, would recommend!'),
(12, 1, 6, null, 4, 'Great service, would recommend!'),
--user4
(13, 4, null, 2, 3, 'Good venue, but could be better.'),
(14, 4, 7, null, 5, 'Great photography service, would recommend!'),
(15, 1, 5, null, 4, 'Great service, would recommend!'),
(16, 1, 6, null, 4, 'Great service, would recommend!'),
--user5
(17, 5, null, 2, 5, 'Great venue, had an amazing time!'),
(18, 5, 2, null, 5, 'Great photography service, would recommend!'),
(19, 1, 3, null, 4, 'Great service, would recommend!'),
(20, 1, 5, null, 4, 'Great service, would recommend!'),
(21, 1, 6, null, 4, 'Great service, would recommend!');

INSERT IGNORE INTO event_properties (id, event_id, other_service_id, venue_id, start_time, end_time, status, deposit_amount, price_per_service, book_date) VALUES
(1, 1, 1, null, '2026-12-31 13:00:00', '2026-12-31 22:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(2, 1, 2, null, '2026-12-31 13:00:00', '2026-12-31 15:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(3, 1, null, 1, '2026-12-31 12:00:00', '2026-12-31 23:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),

(4, 2, 1, null, '2026-12-31 12:00:00', '2026-12-31 23:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(5, 2, 3, null, '2026-12-31 13:00:00', '2026-12-31 15:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(6, 2, 6, null, '2026-12-31 13:00:00', '2026-12-31 23:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(7, 2, null, 1, '2026-12-31 12:00:00', '2026-12-31 23:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),

(8, 3, 1, null, '2026-12-31 14:00:00', '2026-12-31 22:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(9, 3, 4, null, '2026-12-31 14:00:00', '2026-12-31 17:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(10, 3, 6, null, '2026-12-31 14:00:00', '2026-12-31 23:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(11, 3, null, 1, '2026-12-31 14:00:00', '2026-12-31 23:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),

(12, 4, 5, null, '2026-12-31 12:00:00', '2026-12-31 14:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(13, 4, 6, null, '2026-12-31 12:00:00', '2026-12-31 20:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(14, 4, 7, null, '2026-12-31 12:00:00', '2026-12-31 14:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(14, 4, 7, null, '2026-12-31 12:00:00', '2026-12-31 14:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(15, 4, null, 2, '2026-12-31 11:00:00', '2026-12-31 20:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),

(16, 5, 2, null, '2026-12-31 13:00:00', '2026-12-31 15:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(17, 5, 5, null, '2026-12-31 13:00:00', '2026-12-31 15:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(18, 5, 6, null, '2026-12-31 13:00:00', '2026-12-31 23:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(19, 5, null, 2, '2026-12-31 12:00:00', '2026-12-31 23:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),

(20, 6, 1, null, '2026-06-30 13:00:00', '2026-06-30 22:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(21, 6, 2, null, '2026-06-30 13:00:00', '2026-06-30 15:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(22, 6, null, 1, '2026-06-30 12:00:00', '2026-06-30 23:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),

(23, 7, 1, null, '2026-07-30 13:00:00', '2026-07-30 22:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(24, 7, 3, null, '2026-07-30 13:00:00', '2026-07-30 15:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(25, 7, null, 1, '2026-07-30 12:00:00', '2026-07-30 23:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),

(26, 8, 4, null, '2026-08-30 13:00:00', '2026-08-30 15:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(27, 8, 5, null, '2026-08-30 13:00:00', '2026-08-30 15:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(28, 8, null, 1, '2026-08-30 12:00:00', '2026-08-30 23:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),

(29, 9, 5, null, '2026-09-30 13:00:00', '2026-09-30 15:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(30, 9, 7, null, '2026-09-30 13:00:00', '2026-09-30 15:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(31, 9, null, 2, '2026-09-30 12:00:00', '2026-09-30 23:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),

(32, 10, 3, null, '2026-10-30 13:00:00', '2026-10-30 15:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(33, 10, 5, null, '2026-10-30 13:00:00', '2026-10-30 15:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00'),
(34, 10, null, 2, '2026-10-30 12:00:00', '2026-10-30 23:00:00', 'APPROVED', 200.00 * 0.35, 200.0, '2025-02-12 22:00:00');