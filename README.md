# Eventbride

Como configurar el proyecto.

1. Instalar MariaDB (https://mariadb.org/).
2. Instalar Java 17.
3. Abrir MYSQL Client y configurar la contraseña que se desee.
4. Poner los siguientes comandos:
```
    create database eventbride; (para crear la database)
    use Eventbride; (para meterte en la database)
    show tables; (para ver si se han creado. De primeras saldrá vacio)
```

5. En el proyecto buscar el archivo *application-mysql.properties.example* (ruta: src\main\resources\application-mysql.properties.example).

6. Duplicar ese archivo y renombrar la copia a *application-mysql.properties*

7. Cambiar en el nuevo *application-mysql.properties* el usuario y la contraseña que pusieras en la instalación de MariaDB:
```
    spring.datasource.username=${MYSQL_USER:TUUSUARIO}
    spring.datasource.password=${MYSQL_PASS:TUCONTRASEÑA}
```

El username habitual suele ser *root*.


8. Realizar los siguientes comandos:

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
9. User y pass para probar en el navegador:
    - user: alice123
    - pass: 1234

10. Con todo esto hecho, con el comando ```show tables;``` en el CMD de MySQL debería aparecer todo correctamente.
