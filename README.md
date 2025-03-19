## <center>Ingeniería del Software y Práctica Profesional (ISPP)</center>
<center><img src="docs/img/Eventbride.png"></center>

## Introducción

Eventbride es una plataforma dedicada a la contratación de servicios ver con eventos como bodas, comuniones y bautizos. Permite gestionar invitados, proveedores, presupuestos y todo lo demás.

## Características

- Gestor de invitados: Organiza y realiza seguimiento de las confirmaciones de asistencia.

- Gestor de proveedores: Administra contratos y servicios de catering, música, decoración, entre otros.

- Presupuesto y pagos: Lleva un control detallado de los gastos y pagos.

- Agenda y tareas: Planifica actividades y fechas importantes.

- Interfaz intuitiva: Diseño moderno y fácil de usar.

## Guía de instalación y arranque del sistema

### Pasos previos

1. Instalar [MariaDB](https://mariadb.org/).
2. Instalar [Java 17](https://www.oracle.com/es/java/technologies/downloads/#java17).
3. Configurar variable de entorno (JAVA_HOME) con la ruta donde esté el jdk17.
4. Abrir MYSQL Client y configurar la contraseña que se desee.
5. Poner los siguientes comandos:
```
    create database eventbride; (para crear la database)
    use eventbride; (para meterte en la database)
    show tables; (para ver si se han creado. De primeras saldrá vacio)
```

6. En el proyecto buscar el archivo *application-dev.properties.example* (ruta: src\main\resources\application-dev.properties.example).

7. Duplicar ese archivo y renombrar la copia a *application-dev.properties*.

8. Cambiar en el nuevo *application-dev.properties* el usuario y la contraseña que pusieras en la instalación de MariaDB. El username habitual suele ser *root*:
```
    spring.datasource.username=${MYSQL_USER:TUUSUARIO}
    spring.datasource.password=${MYSQL_PASS:TUCONTRASEÑA}
```
**IMPORTANTE: no pongas el user y contraseña entre comillas, sigue la estructura literal, por ejemplo:**
```
    spring.datasource.username=${MYSQL_USER:RyanGosling}
    spring.datasource.password=${MYSQL_PASS:lalaland}
```

9. Repetir los pasos 5, 6 y 7 con el archivo *application-mysql.properties.example* (ruta: src\main\resources\application-mysql.properties.example).

### Arranque del sistema

#### ***Backend***
```
    ./mvnw clean install
    ./mvnw spring-boot:run
```
#### ***Frontend***
```
    cd frontend
    npm install
    npm run dev
```

Con las siguientes credenciales deberías poder acceder al sistema correctamente:
    - user: alice123
    - pass: 1234

¡Ya puedes empezar a realizar cambios!

## Participantes

Damos las gracias a todos los participantes de este proyecto. Gracias a ellos ha sido posible.

[[Contribute](https://github.com/ISPP-Eventbride/Eventbride/graphs/contributors)].

## Contacto

eventbride6@gmail.com   |  [Instagram](https://www.instagram.com/eventbride_sevilla/)