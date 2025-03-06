INSERT IGNORE INTO users (id, username, role, email, first_name, last_name, telephone, dni, profile_picture, password) VALUES 
-- clientes
(1, 'alice123', 'CLIENT', 'alice@example.com', 'Alice', 'Johnson', '123456789', '00000000A', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Alice_in_wonderland_1951.jpg/1200px-Alice_in_wonderland_1951.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK'),
(2, 'bob456', 'CLIENT', 'bob@example.com', 'Bob', 'Smith', '987654321', '11111111A', 'https://i.pinimg.com/1200x/3c/de/d5/3cded5aa576c39ccdad0ddf4180903ca.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK'),
(3, 'charlie789', 'CLIENT', 'charlie@example.com', 'Charlie', 'Brown', '567123890', '22222222A', 'https://lavozdetarija.com/wp-content/uploads/2022/11/Charlie-Brown-y-Snoopy.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK'),
(4, 'diana001', 'CLIENT', 'diana@example.com', 'Diana', 'Prince', '654321987', '33333333A', 'https://avatarfiles.alphacoders.com/823/82348.png', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK'),
(5, 'edward_dev', 'CLIENT', 'edward@example.com', 'Edward', 'Snowden', '321789654', '44444444A', 'https://proassets.planetadelibros.com/usuaris/seudonimos/fotos/53/original/000052233_1_King_AuthorPhoto_c_Lindsay_Mills_2018.jpeg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK'),
-- proveedores
(6, 'El castillo de Maxi', 'SUPPLIER', 'CastilloMaxi@example.com', 'Castillo', 'Maxi', '930348923', '55555555A', 'https://www.guiacatering.com/site/company/a7/1176/images/366309/el-castillo-de-maxi_ci3.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK'),
(7, 'JLMorilla', 'SUPPLIER', 'foto@juanluismorilla.com', 'Juan Luis', 'Morilla', '123456789', '66666666A', 'https://scontent.fsvq2-1.fna.fbcdn.net/v/t39.30808-6/290011138_447969930669386_9159143717868862291_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=T1p9q0sk0y0Q7kNvgEF3K__&_nc_oc=AdilDvDQ1V4pXorh78Fh0B784FQTl9Qpr33KK4Mml2qvkAV9L80X0ks7V0Kv9omBkWs&_nc_zt=23&_nc_ht=scontent.fsvq2-1.fna&_nc_gid=A9eedOJ07WIUB4Mn065w5VH&oh=00_AYBvtPG3AkWjWyLPHKkXMhBIDuubPS9BzWDWy59FVvluKw&oe=67CB913C', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK'),
(8, 'JMGomez', 'SUPPLIER', 'jmgosevilla@gmail.com', 'Jose Manuel', 'Gomez', '123456789', '77777777A', 'https://www.corteganaiberico.com/wp-content/uploads/2021/10/pata-negra-y-jamon-iberico-1.png', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK'),
(9, 'JMGonzalez', 'SUPPLIER', 'gonzalezcaraballojosemanuel@gmail.com', 'Jose Manuel', 'Gonzalez Caraballo', '123456789', '88888888A', 'https://www.jamonibericomatas.com/wp-content/uploads/2022/01/Consejos-sobre-como-cortar-jamon-iberico-de-bellota.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK'),
(10, 'FelipeGN', 'SUPPLIER', 'felielectri@gmail.com', 'Felipe', 'G', '123456789', '99999999A', 'https://www.shutterstock.com/image-photo/woman-cutting-cheese-kitchen-slicing-600nw-2441834571.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK'),
(11, 'DLDecor', 'SUPPLIER', 'info@davidlaradecor.es', 'David', 'Lara', '123456789', '00000000B', 'https://www.davidlaradecor.es/wp-content/uploads/2018/01/logo-portada.png', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK'),
(12, 'Master Sound', 'SUPPLIER', 'danielvillarrealgallardo@gmail.com', 'Daniel', 'Villareal Gallardo', '123456789', '11111111B', 'https://scontent.fsvq2-2.fna.fbcdn.net/v/t39.30808-6/362215902_1714969262352914_6618147487731709894_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=8FMz_wolYrMQ7kNvgGNwSK5&_nc_oc=AdiIIcUPAoH_UqWyaDIdw2cb0WPREpTUFc5DmWjOCKzMD5kZjT2JpyU8y7naUK67Hhk&_nc_zt=23&_nc_ht=scontent.fsvq2-2.fna&_nc_gid=AAjj9XxIRPa0kkXRysufzjn&oh=00_AYAKmsRLHiYkWxtMZgned_gKZjg0oVc1QXA-f18IrkBuAA&oe=67CB861C', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK'),
(13, 'ARCOS 3 CATERING', 'SUPPLIER', 'mariatrigueros16.maccga@gmail.com', 'Maria', 'Trigueros', '123456789', '22222222B', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvhC6mgSHclnNr2RPV1gDcZl7F0sC-ND4pcw&s', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK'),
(14, 'Mongo mango', 'SUPPLIER', 'mongomango@example.com', 'Mongo', 'Mango', '932649056', '33333333B', 'https://vientosolar.org/wp-content/uploads/2016/03/bpp8409a-401x249.jpg', '$2a$10$gyqEuh5bpJVhwuN44YwkjeaR6/1u2KqFTGhjYxWtH27Dmka569AmK');


INSERT IGNORE INTO venues (id, postal_code, coordinates, address, max_guests, surface, name, available, city_available, service_price_guest, service_price_hour, picture, description, user_id, hours, limited_by_price_per_guest, limited_by_price_per_hour, fixed_price) VALUES 
(1, '41001', '37.388630, -5.982430', 'Calle Sierpes, 1', 110, 100.00, 'Prueba1' ,TRUE, 'Sevilla', 1000.00, null, 'https://www.guiacatering.com/site/company/a7/1176/images/366309/el-castillo-de-maxi_ci3.jpg', '¿Sabías que entre nuestros servicios se encuentra la posibilidad de disfrutar de un castillo hinchable? ¡Los más pequeños se lo pasarán en grande!', 6, 0, TRUE, FALSE, null),
(2, '41002', '37.388630, -5.982430', 'Calle Sierpes, 2', 200, 180.00, 'Prueba9' ,TRUE, 'Sevilla', null, 400.00,'https://vientosolar.org/wp-content/uploads/2016/03/bpp8409a-401x249.jpg', 'Proporcionamos un lugar apegado a la naturaleza para que puedas disfrutar de un evento inolvidable.', 14, 6, FALSE, TRUE, null);

INSERT IGNORE INTO other_services (id, other_service_type, extra_information, name, available, city_available, service_price_guest, service_price_hour, picture, description, user_id, hours, limited_by_price_per_guest, limited_by_price_per_hour, fixed_price) VALUES
(1, 'ENTERTAINMENT', 'Servicio de fotografía',  'Fotografías J. L. Morilla' ,TRUE, 'Sevilla', 500.00, null, 'https://scontent.fsvq2-1.fna.fbcdn.net/v/t39.30808-6/290011138_447969930669386_9159143717868862291_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=T1p9q0sk0y0Q7kNvgEF3K__&_nc_oc=AdilDvDQ1V4pXorh78Fh0B784FQTl9Qpr33KK4Mml2qvkAV9L80X0ks7V0Kv9omBkWs&_nc_zt=23&_nc_ht=scontent.fsvq2-1.fna&_nc_gid=A9eedOJ07WIUB4Mn065w5VH&oh=00_AYBvtPG3AkWjWyLPHKkXMhBIDuubPS9BzWDWy59FVvluKw&oe=67CB913C', 'Soy Juan Luis, fotógrafo de bodas con más de 20 años de experiencia, y el encargado de daros un álbum de fotos con el que podáis revivir el día de vuestra boda, una y otra vez, con todo lujo de detalles.', 7, null, TRUE, FALSE, null),
(2, 'CATERING', 'Cortador de jamon',  'Cortador de jamón J. M. Gomez' ,TRUE, 'Sevilla', null, 300.00, 'https://www.corteganaiberico.com/wp-content/uploads/2021/10/pata-negra-y-jamon-iberico-1.png', 'Eleva la experiencia gastronómica con cortes precisos y elegantes. Especializado en el arte del jamón, combina destreza, técnica y conocimiento del producto para resaltar su sabor y textura. Ideal para eventos, restaurantes o amantes del jamón que buscan un servicio de calidad y presentación impecable.', 8, 1, FALSE, TRUE, null),
(3, 'CATERING', 'Cortador de jamon',  'Cortador de jamón J. M. Gonzalez' ,TRUE, 'Sevilla', null, 400.00, 'https://www.jamonibericomatas.com/wp-content/uploads/2022/01/Consejos-sobre-como-cortar-jamon-iberico-de-bellota.jpg', 'Más que un oficio, un arte. Con habilidad y precisión, transforma cada pieza de jamón en finas lonchas que realzan su sabor y aroma. Un equilibrio perfecto entre técnica, tradición y pasión, ofreciendo una experiencia gastronómica única en eventos, celebraciones o catas especializadas', 9, 1, FALSE, TRUE, null),
(4, 'CATERING', 'Cortador de queso',  'Cortador de queso FelipeGN' ,TRUE, 'Sevilla', null, 200.00, 'https://cdn.shopify.com/s/files/1/0399/9901/3016/files/CORTAR_EL_QUESO-2.png?v=1740041498', 'En un rincón, cortando queso… Con paciencia y precisión, el maestro cortador transforma cada pieza en porciones perfectas, resaltando su textura y sabor. Entre aromas intensos y tablas bien dispuestas, su oficio convierte cada corte.', 10, 2, FALSE, TRUE, null),
(5, 'DECORATION', 'Decorador de eventos',  'Decorador de eventos DLDecor' ,TRUE, 'Sevilla', null, null, 'https://www.davidlaradecor.es/wp-content/uploads/2018/01/logo-portada.png', 'Convierte tus eventos en experiencias inolvidables. Con un estilo único y creativo, el decorador de eventos transforma espacios en escenarios de ensueño, llenos de color, texturas y detalles que reflejan tu personalidad y estilo.', 11, null, FALSE, FALSE, 200.00),
(6, 'ENTERTAINMENT', 'Sonido para eventos',  'Master Sound' ,TRUE, 'Sevilla', null, 200.00, 'https://scontent.fsvq2-2.fna.fbcdn.net/v/t39.30808-6/362215902_1714969262352914_6618147487731709894_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=8FMz_wolYrMQ7kNvgGNwSK5&_nc_oc=AdiIIcUPAoH_UqWyaDIdw2cb0WPREpTUFc5DmWjOCKzMD5kZjT2JpyU8y7naUK67Hhk&_nc_zt=23&_nc_ht=scontent.fsvq2-2.fna&_nc_gid=AAjj9XxIRPa0kkXRysufzjn&oh=00_AYAKmsRLHiYkWxtMZgned_gKZjg0oVc1QXA-f18IrkBuAA&oe=67CB861C', 'Convierte tus eventos en experiencias inolvidables. Con un estilo único y creativo, el decorador de eventos transforma espacios en escenarios de ensueño, llenos de color, texturas y detalles que reflejan tu personalidad y estilo.', 12, 5, FALSE, TRUE, null),
(7, 'CATERING', 'Catering para eventos',  'ARCOS 3 CATERING' ,TRUE, 'Sevilla', 200.00, null, 'https://cdn0.bodas.net/vendor/16070/3_2/960/jpeg/whatsapp-image-2022-11-17-at-1-15-18-pm_1_16070-166868815185642.jpeg', 'Nos ponemos a tu servicio con nuestro equipo de profesionales preocupados por que todo salga perfecto en cualquier tipo de evento o celebración que realicen.', 13, null, TRUE, FALSE, null);

INSERT IGNORE INTO events (id, event_type, guests, budget, event_date, user_id) VALUES
(1, 'WEDDING', 120, 1100.00, '2023-12-31', 1),
(2, 'CHRISTENING', 50, 500.00, '2023-12-31', 2),
(3, 'WEDDING', 200, 1700.00, '2023-12-31', 3),
(4, 'COMMUNION', 100, 900.00, '2023-12-31', 4),
(5, 'WEDDING', 100, 10000.00, '2023-12-31', 5),
(6, 'WEDDING', 100, 10000.00, '2023-06-30', 1),
(7, 'CHRISTENING', 50, 5000.00, '2023-07-30', 2),
(8, 'COMMUNION', 30, 3000.00, '2023-08-30', 3),
(9, 'WEDDING', 200, 20000.00, '2023-09-30', 4),
(10, 'CHRISTENING', 100, 11000.00, '2023-10-30', 5);

INSERT IGNORE INTO invitations (id, first_name, last_name, telephone, address, email, event_id) VALUES
(1, 'Antonio', 'Martinez Ares', '654000111', 'Calle Sierpes, 1', 'oveja@example.com', 1),
(2, 'Juan Manuel', 'Braza Benitez', '654000112', 'Calle Sierpes, 2', 'sheriff@example.com', 1),
(3, 'Juan Carlos', 'Aragon', '654000113', 'Calle Sierpes, 3', 'veneno@example.com', 2),
(4, 'Manolo', 'Santander', '654000114', 'Calle Sierpes, 4', 'viña@example.com', 2),
(5, 'Jesus', 'Bienvenido', '654000115', 'Calle Sierpes, 5', 'rata@example.com', 3),
(6, 'Antonio', 'Martin', '654000116', 'Calle Sierpes, 6', 'musa@example.com', 3),
(7, 'Jose', 'Guerrero', '654000117', 'Calle Sierpes, 7', 'yuyu@example.com', 4),
(8, 'Francisco', 'Alba', '654000118', 'Calle Sierpes, 8', 'caleta@example.com', 4),
(9, 'Kike', 'Remolino', '654000119', 'Calle Sierpes, 9', 'heavy@example.com', 5),
(10, 'Julio', 'Pardo', '654000110', 'Calle Sierpes, 10', 'opera@example.com', 5);


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

INSERT IGNORE INTO event_properties (id, event_id, other_service_id, venue_id, approved, request_date) VALUES
(1, 1, 1, null, TRUE, '2023-12-01'),
(2, 1, 2, null, TRUE, '2023-12-01'),
(3, 1, null, 1, TRUE, '2023-12-01'),

(4, 2, 1, null, TRUE, '2023-12-02'),
(5, 2, 3, null, TRUE, '2023-12-02'),
(6, 2, 6, null, TRUE, '2023-12-02'),
(7, 2, null, 1, TRUE, '2023-12-02'),

(8, 3, 1, null, TRUE, '2023-12-03'),
(9, 3, 4, null, TRUE, '2023-12-03'),
(10, 3, 6, null, TRUE, '2023-12-03'),
(11, 3, null, 1, TRUE, '2023-12-03'),

(12, 4, 5, null, TRUE, '2023-12-04'),
(13, 4, 6, null, TRUE, '2023-12-04'),
(14, 4, 7, null, TRUE, '2023-12-04'),
(15, 4, null, 2, TRUE, '2023-12-04'),

(16, 5, 2, null, TRUE, '2023-12-02'),
(17, 5, 5, null, TRUE, '2023-12-02'),
(18, 5, 6, null, TRUE, '2023-12-02'),
(19, 5, null, 2, TRUE, '2023-12-02'),

(20, 6, 1, null, TRUE, '2023-05-30'),
(21, 6, 2, null, TRUE, '2023-05-30'),
(22, 6, null, 1, TRUE, '2023-05-30'),

(23, 7, 1, null, TRUE, '2023-06-30'),
(24, 7, 3, null, TRUE, '2023-06-30'),
(25, 7, null, 1, TRUE, '2023-06-30'),

(26, 8, 4, null, TRUE, '2023-07-30'),
(27, 8, 5, null, TRUE, '2023-07-30'),
(28, 8, null, 1, TRUE, '2023-07-30'),

(29, 9, 5, null, TRUE, '2023-08-30'),
(30, 9, 7, null, TRUE, '2023-08-30'),
(31, 9, null, 2, TRUE, '2023-08-30'),

(32, 10, 3, null, TRUE, '2023-09-30'),
(33, 10, 5, null, TRUE, '2023-09-30'),
(34, 10, null, 2, TRUE, '2023-09-30');