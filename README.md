# Eventbride

Como configurar el proyecto.

1. Instalar MariaDB (https://mariadb.org/).
2. Abrir MYSQL Client y configurar la contraseña que se desee.
3. Poner los siguientes comandos:
    1. create database eventbride; (para crear la database)
    2. use Eventbride; (para meterte en la database)
    3. show tables; (para ver si se han creado. De primeras saldrá vacio)


4. En el proyecto buscar el archivo *application-mysql.properties.example* (ruta: src\main\resources\application-mysql.properties.example).

5. Duplicar ese archivo y renombrar la copia a *application-mysql.properties*

6. Cambiar en *application-mysql.properties* el usuario y la contraseña que pusieras en la instalación de MariaDB:
```
    spring.datasource.username=${MYSQL_USER:root}
    spring.datasource.password=${MYSQL_PASS:TUCONTRASEÑA}
```

El username habitual suele ser *root*.


7. Realizar los siguientes comandos:

*Backend*
```
    ./mvnw clean install
    ./mvnw spring-boot:run
```
*Frontend*
```
    cd frontend
    npm install
    npm run dev
```
8. User y pass para probar en el navegador:
    - user: alice123
    - pass: 1234

9. Con todo esto hecho, con el comando ```show tables;``` en el CMD de MySQL debería aparecer todo correctamente.
