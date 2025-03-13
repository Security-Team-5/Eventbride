# <center>Manual de usuario</center>
## <center>Ingeniería del Software y Práctica Profesional (ISPP)</center>
<center><img src="..\img\Eventbride.png"></center>

### Grupo 3: Eventbride

### Miembros:
- Francisco Avilés Carrera
- Daniel Benito Hidalgo
- Ignacio Blanquero Blanco
- Adrián Cabello Martín
- María de la Salud Carrera Talaverón
- Pablo Jesús Castellanos Compaña
- Fernando José de Celis Hurtado
- David Godoy Fernández
- Miguel Hernández Sánchez
- Antonio Montero López
- Gonzalo Navas Remmers
- Héctor Noguera González
- Natalia Olmo Villegas
- Manuel Pérez Vélez
- Andrés Pizzano Cerrillos
- Sergio Pons López
- Lorenzo Torralba Lanzas

### Fecha: 12/03/2025

### Entregable: Sprint 1

---

### Historial de versiones

| Fecha      | Versión | Descripción                                | Entrega  | Contribuyente(s)                    |
|------------|---------|--------------------------------------------|----------|-------------------------------------|
| 09/03/2025 | v1.0    | Creación del documento y estructura básica | Sprint 1 | Fernando José de Celis Hurtado      |
| 12/03/2025 | v1.1    | Edición de Concordancia con los casos de uso  | Sprint 1 | Fernando José de Celis Hurtado, Antonio Montero López       |
| 13/03/2025 | v2.0    | Finalización del documento  | Sprint 1 | Fernando José de Celis Hurtado, Antonio Montero López       |


## Contenido
1. [Introducción](#intro)
2. [Concordancia con los casos de uso](#id1)
    1. [Usuario Cliente](#id2)
    2. [Usuario Proveedor](#id3)
3. [Guía de la aplicación](#id4)
4. [Información necesaria para utilizar todo lo relacionado con Eventbride](#id5)
5. [Requisitos para utilizar el sistema](#id6)
6. [Video demo de la aplicación](#id7)
7. [Bibliografía](#id8)

<div id='intro'></div>

## Introducción

Bienvenid@ a Eventbride, la plataforma definitiva para la gestión y organización de eventos. Eventbride está diseñada para facilitar la planificación de eventos como bodas, bautizos y comuniones, ofreciendo herramientas intuitivas y eficientes para gestionar todos los detalles importantes. Con Eventbride, podrá coordinar proveedores, gestionar invitados, y asegurarse de que cada aspecto de su evento sea perfecto.

Este manual de usuario le guiará a través de las funcionalidades principales de la aplicación, desde la creación de una cuenta hasta la gestión de eventos y servicios. Nuestro objetivo es proporcionarle una experiencia de usuario fluida y sin complicaciones, permitiéndole disfrutar del proceso de planificación y asegurando que su evento sea memorable y único.

<div id='id1'></div>

## Concordancia con los casos de uso

<div id='id2'></div>

### Usuario Cliente

1. **Crear evento (CC - 03)**

   *“El usuario quiere crear un evento.”*

   Para crear el evento, el usuario debe realizar los siguientes pasos:

- Seleccionar el botón “**Crear evento**” desde la pantalla principal. 

  Otra forma de realizarlo es darle a la opción “**Desde cero**” una vez haya pulsado “**Crear evento**” en el navbar.

- Una vez en la pantalla “Crear evento” el usuario debe de realizar las siguientes acciones:
  - Establecer qué tipo de evento desea crear siendo las opciones: “Boda”, “Bautizo” o “Comunión”.
  - Introducir el número de invitados estimados para el evento.
  - Reflejar el presupuesto estimado para todo el evento.
  - Escoger la fecha del evento.
- Ya introducidos todos los datos, pulsar el botón de “Crear evento”.

<div id='id3'></div>

### Usuario Proveedor

1. **Registrar servicio (CC - 02)**

   *“El usuario de un servicio quiere ofertarlos a través de la aplicación.”*

   Para registrar un servicio, el proveedor debe realizar los siguientes pasos:

- Seleccionar el botón “**Mis servicios**” desde la pantalla principal. 
- Una vez en la pantalla donde se reflejan los servicios, el proveedor debe de pulsar en el botón “**+ Crear nuevo servicio**”.
- Ya situados en la pantalla “**Registrar Servicio**”, el proveedor deberá realizar las siguientes acciones:
  - Establecer qué tipo de servicio que desea crear siendo las opciones: “**Recinto para eventos**” o “**Otros**”. Donde “**Otros**” engloba cualquier servicio que no sea un local. Esta elección cambia los últimos valores a introducir en el formulario de creación.
  - Introducir el nombre del servicio que se desea exponer.
  - Marcar si se encuentra disponible actualmente, escribir la ciudad donde es disponible.
  - Establecer si se trata de un servicio que se cobra “**Por invitado**”, “**Por hora**” o con “**Precio fijo**” y establecer el precio.
  - Importar el enlace a la imagen que quieres mostrar en tu servicio.
  - Escribir la descripción que quieres tener en tu servicio.
  - En caso de ser un “**Recinto para eventos**”, el usuario debe de introducir los siguientes valores: el “**Código postal**” del recinto, sus “**Coordenadas**”, su “**Dirección**”, el número “**Máximo de invitados**” y su “**Superficie (m²)**” en metros cuadrados.
  - En caso de haberse establecido con “**Otros**”, el usuario debe de introducir los siguientes valores: el tipo de servicio, escogiendo entre “**Catering**”, “**Entretenimiento**” y “**Decoración**”, además, podrá introducir algo de información adicionar relevante en “**Información extra**”.

- Ya introducidos todos los datos, pulsar el botón de “**Registrar otro servicio**”.

<div id='id4'></div>

## Guía de la aplicación

Para comenzar, al iniciar la aplicación se muestra un formulario de inicio de sesión el cual hay que completar para poder acceder a las funcionalidades de esta.

![](..\img\login1.png)

En caso de no tener cuenta, se puede acceder a la pestaña de registrarse y completar el formulario correspondiente para poder crearse una cuenta en el sistema.

![](..\img\login2.png)

Para cualquier tipo de usuario se puede ver una página de inicio que es la página siguiente donde nos presentamos y hay una breve descripción sobre lo que hacemos y como trabajamos.

![](..\img\inicio.png)

Si iniciamos sesión con un usuario **cliente**, y accedemos a la sección de mis servicios, se pueden observar los servicios pertenecientes al usuario y sus respectivos datos.

![](..\img\miseventos.png)

Se puede entrar en detalles de los eventos para poder leer toda la información de los mismos y también se puede borrar el evento que se seleccione.

![](..\img\detalleseventos.png)

También se puede meter en la sección de crear evento donde se muestra un formulario a completar y se crea el evento. 

![](..\img\crearevento.png)

Y hasta el momento, también se puede acceder a la pestaña de términos y condiciones para poder leerlas.

![](..\img\terminos.png)

Si iniciamos sesión con un usuario **proveedor** y se accede a la pestaña de mis servicios, se muestran los servicios pertenecientes al proveedor pudiéndose editar y crear nuevos servicios en la misma sección.

![](..\img\misservicios.png)

Dentro de editar un servicio, se muestra un formulario a modificar si se desea cambiar algún atributo del servicio.

![](..\img\editarservicio.png)

Y de la misma forma si se quiere crear un servicio, se muestra el formulario correspondiente a completar.

![](..\img\crearservicio.png)

Si iniciamos sesión con un usuario **admin**, y accedemos a administrar servicios, se muestran todos los servicios del sistema dando la opción de editar y eliminar. 

![](..\img\administrarservicios.png)

Si accedemos a la sección de editar, se nos muestra el formulario a rellenar.

![](..\img\admineditarservicio.png)

Si accedemos a la sección de administrar usuarios, se encuentran todos los usuarios del sistema devolviéndolos directamente en forma de formulario y si se desea editar se modifica dicho formulario y se pulsa el botón de editar. También se pueden eliminar del sistema.

![](..\img\administrarusuarios.png)

Por último, la sección de administrar eventos funciona de la misma manera que la anterior mencionada.

![](..\img\administrareventos.png)

<div id='id5'></div>

## Información necesaria para utilizar todo lo relacionado con Eventbride

**Landing page:** <https://sites.google.com/view/eventbride/inicio?authuser=0>

**Credenciales de la aplicación:**

Clientes:

- Usuario: **alice123** Contraseña: **1234**
- Usuario: **bob456** Contraseña: **1234**
- Usuario: **charlie789** Contraseña: **1234**
- Usuario: **diana001** Contraseña: **1234**
- Usuario: **edward\_dev** Contraseña: **1234**

Proveedores:

- Usuario: **El castillo de Maxi** Contraseña: **1234**
- Usuario: **JLMorilla** Contraseña: **1234**
- Usuario: **JMGomez** Contraseña: **1234**
- Usuario: **JMGonzalez** Contraseña: **1234**
- Usuario: **FelipeGN** Contraseña: **1234**
- Usuario: **DLDecor** Contraseña: **1234**
- Usuario: **Master Sound** Contraseña: **1234**
- Usuario: **ARCOS 3 CATERING** Contraseña: **1234**
- Usuario: **Mongo mango** Contraseña: **1234**

Administrador:

- Usuario: **Admin** Contraseña: **1234**

**URL del despliegue de la aplicación: <https://ispp-2425-03.ew.r.appspot.com/login>** 

**URL de GitHub: <https://github.com/ISPP-Eventbride>**

**Credenciales correo corporativo:**

- Usuario: [**eventbride6@gmail.com](mailto:eventbride6@gmail.com)** Contraseña: **3vent\_Br1de**

**Credenciales de Clockify:** cuando inicies sesión con clockify te pedirá un correo electrónico, meter el correo corporativo. Acto seguido te enviará una clave al correo corporativo.

<div id='id6'></div>

## Requisitos para utilizar el sistema
Todo lo relacionado para la puesta en marcha del proyecto viene indicado en el README del repositorio de GitHub.

<div id='id7'></div>

## Video demo de la aplicación
El video demo de la aplicación se encuentra en el siguiente [enlace](https://uses0-my.sharepoint.com/personal/natolmvil_alum_us_es/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fnatolmvil%5Falum%5Fus%5Fes%2FDocuments%2FISPP%2FSPRINT1%2FVideo%20demo&ga=1).

<div id='id8'></div>

## Bibliografía
Intencionalmente en blanco
