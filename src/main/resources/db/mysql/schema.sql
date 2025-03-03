-- Superclase usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  first_name VARCHAR(40) NOT NULL,
  last_name VARCHAR(40) NOT NULL,
  telephone VARCHAR(9) NOT NULL,
  dni VARCHAR(9) NOT NULL UNIQUE,
  profile_picture VARCHAR(500) NOT NULL,
  password VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- Clases hijo: cliente y proveedor
CREATE TABLE IF NOT EXISTS clients (
  clientId INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id INT UNSIGNED NOT NULL UNIQUE,  -- Evita que un usuario sea cliente y proveedor a la vez
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS suppliers (
  supplierId INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id INT UNSIGNED NOT NULL UNIQUE,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Clase evento
CREATE TABLE IF NOT EXISTS events (
  eventId INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  eventType ENUM('WEDDING', 'CHRISTENING', 'COMMUNION') NOT NULL,
  guests INT NOT NULL CHECK (guests > 0),
  budget DECIMAL(10,2) NOT NULL CHECK (budget >= 0),
  date DATE NOT NULL,
  clientId INT UNSIGNED NOT NULL,
  FOREIGN KEY (clientId) REFERENCES clients(clientId) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Clase servicio
CREATE TABLE IF NOT EXISTS services (
  serviceId INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  available BOOLEAN NOT NULL,
  cityAvailable VARCHAR(30) NOT NULL,
  servicePrice DECIMAL(10,3) NOT NULL CHECK (servicePrice >= 0),
  picture VARCHAR(250) NOT NULL,
  description VARCHAR(250) NOT NULL,
  supplierId INT UNSIGNED NOT NULL,
  FOREIGN KEY (supplierId) REFERENCES suppliers(supplierId) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla intermedia: evento - servicio
CREATE TABLE IF NOT EXISTS booking_services (
  eventId INT UNSIGNED NOT NULL,
  serviceId INT UNSIGNED NOT NULL,
  PRIMARY KEY (eventId, serviceId),
  FOREIGN KEY (eventId) REFERENCES events(eventId) ON DELETE CASCADE,
  FOREIGN KEY (serviceId) REFERENCES services(serviceId) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Clase hijo de servicio: recinto
CREATE TABLE IF NOT EXISTS venues (
  venueId INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  postalCode VARCHAR(5) NOT NULL,
  coordinates VARCHAR(30) NOT NULL,
  address VARCHAR(50) NOT NULL,
  maxGuests INT NOT NULL CHECK (maxGuests > 0),
  surface DECIMAL(10,2) NOT NULL CHECK (surface >= 0),
  serviceId INT UNSIGNED NOT NULL UNIQUE,  -- Un recinto es un servicio único
  FOREIGN KEY (serviceId) REFERENCES services(serviceId) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Clase hijo de servicio: servicio alternativo
CREATE TABLE IF NOT EXISTS other_services (
  otherServiceId INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  otherServiceType ENUM('CATERING', 'ENTERTAINMENT', 'DECORATION') NOT NULL,
  extraInformation VARCHAR(250) NOT NULL,
  serviceId INT UNSIGNED NOT NULL UNIQUE,  -- Un servicio alternativo es un servicio único
  FOREIGN KEY (serviceId) REFERENCES services(serviceId) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Clase rating
CREATE TABLE IF NOT EXISTS ratings (
  ratingId INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  stars INT NOT NULL CHECK (stars BETWEEN 1 AND 5),
  comment VARCHAR(250) NOT NULL,
  clientId INT UNSIGNED NOT NULL,
  serviceId INT UNSIGNED NOT NULL,
  FOREIGN KEY (clientId) REFERENCES clients(clientId) ON DELETE CASCADE,
  FOREIGN KEY (serviceId) REFERENCES services(serviceId) ON DELETE CASCADE
) ENGINE=InnoDB;
