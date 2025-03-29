INSERT IGNORE INTO users (id, username, role, email, first_name, last_name, telephone, dni, profile_picture, password, plan, payment_plan_date, expire_plan_date) VALUES 
-- clientes
(1, 'D4nielBH', 'CLIENT', 'danbenhid@alum.us.es', 'Daniel', 'Benito Hidalgo', '123456789', '00000000D', 'https://i.pinimg.com/736x/cc/e6/e8/cce6e81540e6282c551f01937049614e.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', null, null, null),
(2, 'alice123', 'CLIENT', 'alice@example.com', 'Alice', 'Johnson', '123456789', '00000001A', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Alice_in_wonderland_1951.jpg/1200px-Alice_in_wonderland_1951.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', null, null, null),
(3, 'Natalii', 'CLIENT', 'natolmvil@alum.us.es', 'Natalia', 'Olmo Villegas', '567123890', '00000002N', 'https://media.licdn.com/dms/image/v2/D5603AQEG3z5ORRPXow/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1726919084266?e=2147483647&v=beta&t=atwQwaGmE3k9Zi-YdTCTkr5SzHngGKY44vfcAZdhaY4', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', null, null, null),
(4, 'PabloCC', 'CLIENT', 'pabcascom@alum.us.es', 'Pablo', 'Castellanos Compaña', '654321987', '00000003P', 'https://i.pinimg.com/736x/06/f0/79/06f07921405f71844818fa78bd8064f0.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', null, null, null),
(5, 'MariaCT', 'CLIENT', 'marcartal1@alum.us.es', 'María', 'Carrera Talaverón', '987654321', '00000004M', 'https://pbs.twimg.com/media/EyaRtQoWgAMd7iU.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', null, null, null),
(16, 'Fraan', 'CLIENT', 'fraavicar@alum.us.es.com', 'Fran', 'Avilés Carrera', '321789654', '00000005F', 'https://media.licdn.com/dms/image/v2/D4E03AQFk3oiu-3OLDQ/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1731263648526?e=2147483647&v=beta&t=iWb8NwRLUnxVmF34sGj0DReKSFEHm-99wXLlEH5ebPA', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', null, null, null),
-- proveedores
(6, 'ElCastilloDeMaxi', 'SUPPLIER', 'CastilloMaxi@example.com', 'Castillo', 'Maxi', '930348923', '00000000M', 'https://www.guiacatering.com/site/company/a7/1176/images/366309/el-castillo-de-maxi_ci3.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', "PREMIUM", '2025-03-20', '2030-04-20'),
(7, 'JLMorilla', 'SUPPLIER', 'juanluismorilla@example.com', 'Juan Luis', 'Morilla', '123456789', '10000000J', 'https://www.juanluismorilla.com/wp-content/uploads/2020/06/JLM_logomarca_RGB.png', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', "PREMIUM", '2025-03-20', '2030-04-20'),
(8, 'JMGomez', 'SUPPLIER', 'jmgosevilla@example.com', 'Jose Manuel', 'Gomez', '123456789', '20000000G', 'https://www.corteganaiberico.com/wp-content/uploads/2021/10/pata-negra-y-jamon-iberico-1.png', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', "PREMIUM", '2025-03-20', '2030-04-20'),
(9, 'JMGonzalez', 'SUPPLIER', 'gonzalezcaraballojosemanuel@example.com', 'Jose Manuel', 'Gonzalez Caraballo', '123456789', '30000000M', 'https://www.jamonibericomatas.com/wp-content/uploads/2022/01/Consejos-sobre-como-cortar-jamon-iberico-de-bellota.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', "BASIC", null, null),
(10, 'FelipeGN', 'SUPPLIER', 'felielectri@example.com', 'Felipe', 'G', '123456789', '40000000F', 'https://www.shutterstock.com/image-photo/woman-cutting-cheese-kitchen-slicing-600nw-2441834571.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', "BASIC", null, null),
(11, 'DLDecor', 'SUPPLIER', 'davidlaradecor@example.es', 'David', 'Lara', '123456789', '50000000D', 'https://www.davidlaradecor.es/wp-content/uploads/2018/01/logo-portada.png', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', "BASIC", null, null),
(12, 'MasterSound', 'SUPPLIER', 'danielvillarrealgallardo@example.com', 'Daniel', 'Villareal Gallardo', '123456789', '60000000S', 'https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_54/545096/17370601_800.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', "BASIC", null, null),
(13, 'ARCOS3CATERING', 'SUPPLIER', 'mariatrigueros16.maccga@example.com', 'Maria', 'Trigueros', '123456789', '70000000A', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvhC6mgSHclnNr2RPV1gDcZl7F0sC-ND4pcw&s', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', "BASIC", null, null),
(14, 'MongoMango', 'SUPPLIER', 'mongomango@example.com', 'Mongo', 'Mango', '932649056', '80000000M', 'https://vientosolar.org/wp-content/uploads/2016/03/bpp8409a-401x249.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', "BASIC", null, null),
(17, 'SurMusic', 'SUPPLIER', 'surmusicsevilla@example.com', 'Sur', 'Music', '678006287', '90000000S', 'https://surmusicsevilla.com/wp-content/uploads/2021/01/cropped-cropped-LOGO-BLANCO-1-RECORTADO.jpeg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', "BASIC", null, null),
(18, 'PandoCatering&Hacienda', 'SUPPLIER', 'gruposaneloy@example.com', 'Pando', 'Catering', '432984728', '11000000P', 'https://cateringpando.com/wp-content/uploads/2024/03/logo-index-catering-pando.png', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', "PREMIUM", '2025-03-20', '2030-04-20'),
-- admin
(15, 'Admin', 'ADMIN', 'admin@example.com', 'Admin', 'Soyadmin', '666666666', '44444144A', 'https://proassets.planetadelibros.com/usuaris/seudonimos/fotos/53/original/000052233_1_King_AuthorPhoto_c_Lindsay_Mills_2018.jpeg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK', null, null, null);

INSERT IGNORE INTO venues (id, postal_code, coordinates, address, max_guests, surface, name, available, city_available, service_price_guest, service_price_hour, picture, description, user_id, limited_by_price_per_guest, limited_by_price_per_hour, fixed_price, earliest_time, latest_time) VALUES 
(1, '41000', '37.42571305296568, -5.82959169111589', 'Cam. Rocío, 404', 110, 100.00, 'Castillo de Maxi' ,TRUE, 'Sevilla', null, null, 'https://www.guiacatering.com/site/company/a7/1176/images/366309/el-castillo-de-maxi_ci3.jpg', '¿Sabías que entre nuestros servicios se encuentra la posibilidad de disfrutar de un castillo hinchable? ¡Los más pequeños se lo pasarán en grande!', 6, FALSE, FALSE, 1500.00, '09:00:00', '23:59:00'),
(2, '41002', '37.411093725285504, -5.961539418106147', 'C/ Escarpia, 65', 200, 180.00, 'Mongo Mangos' ,TRUE, 'Sevilla', null, 400.00,'https://vientosolar.org/wp-content/uploads/2016/03/bpp8409a-401x249.jpg', 'Proporcionamos un lugar apegado a la naturaleza para que puedas disfrutar de un evento inolvidable.', 14, FALSE, TRUE, null, '09:00:00', '23:59:00'),
(3, '41016', '37.384586822413134, -5.924800681544798', 'Polígono el Pino, C/ Pino Alepo, 26', 250, 200.00, 'Local Sur Music' ,TRUE, 'Sevilla', null, 450.00,'https://lh3.googleusercontent.com/p/AF1QipOy1mqdDE4hGxFNLpITcwDKMT9RK5k2z3T7jvzR=s680-w680-h510', 'SurMusic Sevilla es una empresa especializada en la producción de eventos integrales y cuenta con más de 10 años de experiencia en el sector. Durante este tiempo, hemos trabajado en colaboración con empresas privadas, ayuntamientos y organizaciones, para llevar a cabo una amplia variedad de eventos. ', 17, FALSE, TRUE, null, '09:00:00', '23:59:00'),
(4, '41110', '37.348800012123185, -6.13346199446344', 'Ctra. Prado de la Torre, S/N', 1750, 4000.00, 'Hacienda Pando' ,TRUE, 'Sevilla', null, null,'https://haciendapando.com/wp-content/uploads/2023/12/haciendas-en-sevilla-para-celebraciones-scaled.jpg', 'La Hacienda Pando lleva décadas albergando todo tipo de eventos, ya sea para empresas o de corte familiar con bodas, comuniones o bautizos. En esta cuidada hacienda de estilo andaluz, con bellos jardines y amplios salones, pueden albergarse hasta 900 comensales.', 18, FALSE, FALSE, 5000.00, '10:00:00', '20:00:00'),
(5, '41001', '37.39132080000252, -5.997529461937325', 'C. San Eloy, 47', 189, 350.00, 'Restaurante Pando 1', TRUE, 'Sevilla', 42.00, null,'https://cateringpando.com/wp-content/uploads/2024/03/restaurante_pando_sevilla.jpg', 'Sumérgete en el encanto de la tradición andaluza en nuestro restaurante, ubicado en el corazón vibrante de Sevilla.', 18, TRUE, FALSE, null, '08:00:00', '23:30:00'),
(6, '41001', '37.39132080000252, -5.997529461937325', 'C. San Eloy, 47', 189, 350.00, 'Restaurante Pando 2', TRUE, 'Sevilla', 46.00, null,'https://cateringpando.com/wp-content/uploads/2024/03/restaurante_pando_sevilla.jpg', 'Sumérgete en el encanto de la tradición andaluza en nuestro restaurante, ubicado en el corazón vibrante de Sevilla.', 18, TRUE, FALSE, null, '08:00:00', '23:30:00'),
(7, '41001', '37.39132080000252, -5.997529461937325', 'C. San Eloy, 47', 189, 350.00, 'Restaurante Pando 3', TRUE, 'Sevilla', 49.00, null,'https://cateringpando.com/wp-content/uploads/2024/03/restaurante_pando_sevilla.jpg', 'Sumérgete en el encanto de la tradición andaluza en nuestro restaurante, ubicado en el corazón vibrante de Sevilla.', 18, TRUE, FALSE, null, '08:00:00', '23:30:00');

INSERT IGNORE INTO other_services (id, other_service_type, extra_information, name, available, city_available, service_price_guest, service_price_hour, picture, description, user_id, limited_by_price_per_guest, limited_by_price_per_hour, fixed_price) VALUES
(1, 'ENTERTAINMENT', 'Servicio de fotografía',  'Fotografías J. L. Morilla' ,FALSE, 'Sevilla', 15.00, null, 'https://www.juanluismorilla.com/wp-content/uploads/2020/06/JLM_logomarca_RGB.png', 'Soy Juan Luis, fotógrafo de bodas con más de 20 años de experiencia, y el encargado de daros un álbum de fotos con el que podáis revivir el día de vuestra boda, una y otra vez, con todo lujo de detalles.', 7, TRUE, FALSE, null),
(2, 'CATERING', 'Cortador de jamon',  'Cortador de jamón J. M. Gomez' ,TRUE, 'Sevilla', null, 300.00, 'https://iili.io/3An4WBa.md.jpg', 'Eleva la experiencia gastronómica con cortes precisos y elegantes. Especializado en el arte del jamón, combina destreza, técnica y conocimiento del producto para resaltar su sabor y textura. Ideal para eventos, restaurantes o amantes del jamón que buscan un servicio de calidad y presentación impecable.', 8, FALSE, TRUE, null),
(3, 'CATERING', 'Cortador de jamon',  'Cortador de jamón J. M. Gonzalez' ,TRUE, 'Sevilla', null, 400.00, 'https://www.jamonibericomatas.com/wp-content/uploads/2022/01/Consejos-sobre-como-cortar-jamon-iberico-de-bellota.jpg', 'Más que un oficio, un arte. Con habilidad y precisión, transforma cada pieza de jamón en finas lonchas que realzan su sabor y aroma. Un equilibrio perfecto entre técnica, tradición y pasión, ofreciendo una experiencia gastronómica única en eventos, celebraciones o catas especializadas', 9, FALSE, TRUE, null),
(4, 'CATERING', 'Cortador de queso',  'Cortador de queso FelipeGN' ,TRUE, 'Sevilla', null, 200.00, 'https://cdn.shopify.com/s/files/1/0399/9901/3016/files/CORTAR_EL_QUESO-2.png?v=1740041498', 'En un rincón, cortando queso… Con paciencia y precisión, el maestro cortador transforma cada pieza en porciones perfectas, resaltando su textura y sabor. Entre aromas intensos y tablas bien dispuestas, su oficio convierte cada corte.', 10, FALSE, TRUE, null),
(5, 'DECORATION', 'Decorador de eventos',  'Decorador de eventos DLDecor' ,FALSE, 'Sevilla', null, null, 'https://www.davidlaradecor.es/wp-content/uploads/2018/01/logo-portada.png', 'Convierte tus eventos en experiencias inolvidables. Con un estilo único y creativo, el decorador de eventos transforma espacios en escenarios de ensueño, llenos de color, texturas y detalles que reflejan tu personalidad y estilo.', 11, FALSE, FALSE, 200.00),
(6, 'ENTERTAINMENT', 'Sonido para eventos',  'Master Sound' ,TRUE, 'Sevilla', null, 200.00, 'https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_54/545096/17370601_800.jpg', 'Con nosotros no te perderás nada. En Master Sound, te escuchamos.', 12, FALSE, TRUE, null),
(7, 'CATERING', 'Catering para eventos',  'ARCOS 3 CATERING' ,FALSE, 'Sevilla', 200.00, null, 'https://cdn0.bodas.net/vendor/16070/3_2/960/jpeg/whatsapp-image-2022-11-17-at-1-15-18-pm_1_16070-166868815185642.jpeg', 'Nos ponemos a tu servicio con nuestro equipo de profesionales preocupados por que todo salga perfecto en cualquier tipo de evento o celebración que realicen.', 13, TRUE, FALSE, null);

INSERT IGNORE INTO events (id, event_type, guests, event_date, payment_date, confirmed_guests, paid, user_id) VALUES
(1, 'WEDDING', 120, '2026-12-31', '2026-08-31', 115, TRUE, 1),
(2, 'CHRISTENING', 50, '2026-12-31', '2026-10-31', 40, TRUE, 2),
(3, 'WEDDING', 200, '2026-12-31', '2026-08-31', 190, TRUE, 3),
(4, 'COMMUNION', 100, '2026-12-31', '2026-11-30', 90, TRUE, 4),
(5, 'WEDDING', 100, '2026-12-31', '2026-08-31', 90, TRUE, 5),
(6, 'WEDDING', 100, '2026-06-30', '2026-02-28', 90, TRUE, 1),
(7, 'CHRISTENING', 50, '2026-07-30', '2026-05-30', 40, TRUE, 2),
(8, 'COMMUNION', 30, '2026-08-30', '2026-07-30', 25, TRUE, 3),
(9, 'WEDDING', 200, '2026-09-30', '2026-05-30', 190, TRUE, 4),
(10, 'CHRISTENING', 100, '2026-10-30', '2026-08-30', 90, TRUE, 5);


INSERT IGNORE INTO invitations (id, first_name, last_name, number_of_guests, telephone, email, invitation_type, event_id) VALUES
(1, 'Antonio', 'Martinez Ares', '1', '654000111', 'oveja@example.com', 'SENT', 1),
(2, 'Juan Manuel', 'Braza Benitez', '2', '654000112', 'sheriff@example.com', 'SENT', 1),
(3, 'Juan Carlos', 'Aragon', '3', '654000113', 'veneno@example.com', 'SENT', 2),
(4, 'Manolo', 'Santander', '3', '654000114', 'viña@example.com', 'SENT', 2),
(5, 'Jesus', 'Bienvenido', '4', '654000115', 'rata@example.com', 'SENT', 3),
(6, 'Antonio', 'Martin', '2', '654000116', 'musa@example.com', 'SENT', 3),
(7, 'Jose', 'Guerrero', '1', '654000117', 'yuyu@example.com', 'SENT', 4),
(8, 'Francisco', 'Alba', '3', '654000118', 'caleta@example.com', 'SENT', 4),
(9, 'Kike', 'Remolino', '2', '654000119', 'heavy@example.com', 'SENT', 5),
(10, 'Julio', 'Pardo', '1', '654000110',  'opera@example.com', 'SENT', 5);


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
--user1
(1, 1, 3, null, '2026-12-31 13:00:00', '2026-12-31 22:00:00', 'APPROVED', 3600.00 * 0.35, 3600.0, '2025-02-12 22:00:00'),
(2, 1, 2, null, '2026-12-31 13:00:00', '2026-12-31 15:00:00', 'APPROVED', 600.00 * 0.35, 600.0, '2025-02-12 22:00:00'),
(3, 1, null, 1, '2026-12-31 12:00:00', '2026-12-31 23:00:00', 'APPROVED', 1500.00 * 0.35, 1500.0, '2025-02-12 22:00:00'),
--user2
(4, 2, 3, null, '2026-12-31 12:00:00', '2026-12-31 23:00:00', 'APPROVED', 4400.00 * 0.35, 4400.0, '2025-02-12 22:00:00'),
(5, 2, 4, null, '2026-12-31 13:00:00', '2026-12-31 15:00:00', 'APPROVED', 400.00 * 0.35, 400.0, '2025-02-12 22:00:00'),
(6, 2, 6, null, '2026-12-31 13:00:00', '2026-12-31 23:00:00', 'APPROVED', 200.00 * 0.35, 2000.0, '2025-02-12 22:00:00'),
(7, 2, null, 1, '2026-12-31 12:00:00', '2026-12-31 23:00:00', 'APPROVED', 1500.00 * 0.35, 1500.0, '2025-02-12 22:00:00'),
--user3
(8, 3, 3, null, '2026-12-31 14:00:00', '2026-12-31 22:00:00', 'APPROVED', 3200.00 * 0.35, 3200.0, '2025-02-12 22:00:00'),
(9, 3, 4, null, '2026-12-31 14:00:00', '2026-12-31 17:00:00', 'APPROVED', 600.00 * 0.35, 600.0, '2025-02-12 22:00:00'),
(10, 3, 6, null, '2026-12-31 14:00:00', '2026-12-31 23:00:00', 'APPROVED', 1800.00 * 0.35, 1800.0, '2025-02-12 22:00:00'),
(11, 3, null, 1, '2026-12-31 14:00:00', '2026-12-31 23:00:00', 'APPROVED', 1500.00 * 0.35, 1500.0, '2025-02-12 22:00:00'),
--user4
(12, 4, 4, null, '2026-12-31 12:00:00', '2026-12-31 14:00:00', 'APPROVED', 1600.00 * 0.35, 1600.0, '2025-02-12 22:00:00'),
(13, 4, 6, null, '2026-12-31 12:00:00', '2026-12-31 20:00:00', 'APPROVED', 400.00 * 0.35, 400.0, '2025-02-12 22:00:00'),
(14, 4, 2, null, '2026-12-31 12:00:00', '2026-12-31 14:00:00', 'APPROVED', 600.00 * 0.35, 600.0, '2025-02-12 22:00:00'),
(15, 4, null, 2, '2026-12-31 11:00:00', '2026-12-31 20:00:00', 'APPROVED', 3600.00 * 0.35, 3600.0, '2025-02-12 22:00:00'),
--user5
(16, 5, 2, null, '2026-12-31 13:00:00', '2026-12-31 15:00:00', 'APPROVED', 600.00 * 0.35, 600.0, '2025-02-12 22:00:00'),
(17, 5, 4, null, '2026-12-31 13:00:00', '2026-12-31 15:00:00', 'APPROVED', 400.00 * 0.35, 400.0, '2025-02-12 22:00:00'),
(18, 5, 6, null, '2026-12-31 13:00:00', '2026-12-31 23:00:00', 'APPROVED', 2000.00 * 0.35, 2000.0, '2025-02-12 22:00:00'),
(19, 5, null, 2, '2026-12-31 12:00:00', '2026-12-31 23:00:00', 'APPROVED', 4400.00 * 0.35, 4400.0, '2025-02-12 22:00:00'),
--user1
(20, 6, 3, null, '2026-06-30 13:00:00', '2026-06-30 22:00:00', 'APPROVED', 3600.00 * 0.35, 3600.0, '2025-02-12 22:00:00'),
(21, 6, 2, null, '2026-06-30 13:00:00', '2026-06-30 15:00:00', 'APPROVED', 600.00 * 0.35, 600.0, '2025-02-12 22:00:00'),
(22, 6, null, 1, '2026-06-30 12:00:00', '2026-06-30 23:00:00', 'APPROVED', 1500.00 * 0.35, 1500.0, '2025-02-12 22:00:00'),
--user2
(23, 7, 4, null, '2026-07-30 13:00:00', '2026-07-30 22:00:00', 'APPROVED', 800.00 * 0.35, 800.0, '2025-02-12 22:00:00'),
(24, 7, 3, null, '2026-07-30 13:00:00', '2026-07-30 15:00:00', 'APPROVED', 1800.00 * 0.35, 1800.0, '2025-02-12 22:00:00'),
(25, 7, null, 1, '2026-07-30 12:00:00', '2026-07-30 23:00:00', 'APPROVED', 1500.00 * 0.35, 1500.0, '2025-02-12 22:00:00'),
--user3
(26, 8, 4, null, '2026-08-30 13:00:00', '2026-08-30 15:00:00', 'APPROVED', 400.00 * 0.35, 400.0, '2025-02-12 22:00:00'),
(27, 8, 6, null, '2026-08-30 13:00:00', '2026-08-30 15:00:00', 'APPROVED', 400.00 * 0.35, 400.0, '2025-02-12 22:00:00'),
(28, 8, null, 1, '2026-08-30 12:00:00', '2026-08-30 23:00:00', 'APPROVED', 1500.00 * 0.35, 1500.0, '2025-02-12 22:00:00'),
--user4
(29, 9, 6, null, '2026-09-30 13:00:00', '2026-09-30 15:00:00', 'APPROVED', 400.00 * 0.35, 400.0, '2025-02-12 22:00:00'),
(30, 9, 3, null, '2026-09-30 13:00:00', '2026-09-30 15:00:00', 'APPROVED', 400.00 * 0.35, 400.0, '2025-02-12 22:00:00'),
(31, 9, null, 2, '2026-09-30 12:00:00', '2026-09-30 23:00:00', 'APPROVED', 4400.00 * 0.35, 4400.0, '2025-02-12 22:00:00'),
--user5
(32, 10, 3, null, '2026-10-30 13:00:00', '2026-10-30 17:00:00', 'APPROVED', 1600.00 * 0.35, 1600.0, '2025-02-12 22:00:00'),
(33, 10, 6, null, '2026-10-30 13:00:00', '2026-10-30 16:00:00', 'APPROVED', 600.00 * 0.35, 600.0, '2025-02-12 22:00:00'),
(34, 10, null, 2, '2026-10-30 12:00:00', '2026-10-30 23:00:00', 'APPROVED', 4400.00 * 0.35, 4400.0, '2025-02-12 22:00:00');