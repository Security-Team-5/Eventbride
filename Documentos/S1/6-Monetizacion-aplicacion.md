﻿# <p style="text-align: center;">Monetización de la aplicación</p>
## <p style="text-align: center;">Ingeniería del Software y Práctica Profesional (ISPP)</p>
<center><img src="../img/Eventbride.png"></center>

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

### Fecha: 11/03/2025

### Entregable: Sprint 1

---

### Historial de versiones

|Fecha |Versión |Descripción |Entrega |Contribuyente(s) |
| - | - | - | - | - |
|16/02/2025 |1\.0 |Creación del documento y redacción del mismo |DP ||
|08/03/2025 |2\.0 |Actualización requisitos |Sprint 1 |<p>Pablo Jesús Castellanos Compaña, </p><p>Natalia Olmo Villegas,</p><p> María de la Salud Carrera Talaverón </p>|
|11/03/2025|v2.1|Pasar el documento a markdown| Sprint 1 | Sergio Pons López |

## Contenido 

1. [Resumen ](#resumen)
2. [Introducción ](#intro)
3. [Funcionalidad por la que los usuarios estarían dispuestos a pagar](#id1)
4. [Contacto con los proveedores ](#id2)
5. [Ingresos de la aplicación  ](#id3)
6. [Sistema de reembolso](#id4)
7. [Bibliografía ](#bib)



<div id='resumen'></div>

## Resumen 

La aplicación facilita la organización de eventos al centralizar todos los servicios en una sola plataforma, eliminando la necesidad de buscar proveedores por separado. Ofrece seguridad mediante la verificación de los servicios y optimiza la gestión de invitados, catering y transporte, incluyendo descuentos por la contratación de múltiples servicios. Aunque  los  usuarios  podrían  contactar  a  los  proveedores  directamente  para  evitar comisiones, la conveniencia y confianza en la plataforma fomentarán su uso, como ocurre con Booking.  

El modelo de ingresos se basa en comisiones del 2% para usuarios y 2.5% para proveedores, además de un plan premium que permite a estos últimos publicar más servicios y acceder a estadísticas avanzadas. También se implementará un sistema de reembolsos  flexible  para  atraer  clientes.  Con  este  enfoque,  la  inversión  inicial  podría amortizarse  con  un  volumen  realista  de  eventos  anuales,  asegurando  la  viabilidad  y crecimiento del proyecto. 

<div id='intro'></div>

## Introducción 

En este documento se detallará la manera en la cual se monetizará la aplicación, las funcionalidades por la que estarían dispuestos a pagar los usuarios, el contacto con los proveedores y el sistema de reembolso que queremos llevar a cabo.

<div id='id1'></div>

## Funcionalidad por la que los usuarios estarían dispuestos a pagar 

Ofrecemos un sistema centralizado para la organización de eventos. Esto es algo que le quitaría mucho trabajo a los usuarios que quieren organizar algún evento de este tipo, ya que puede generar estrés y requiere mucho tiempo y organización buscar los servicios que ofrecemos por separado.

No  podemos  negar  que  los  usuarios  podrían  utilizar  nuestra  aplicación  para encontrar los servicios que ofrecemos y contratarlos sin hacer uso de la aplicación para ahorrarse las comisiones de compra. Obviamente esto es un problema que se encuentra en muchas empresas hoy en día. Por ejemplo, la conocida aplicación “Booking” se lleva una comisión por hacer la reserva del apartamento con ellos. Sin embargo, un usuario podría contactar con el apartamento mediante número de teléfono o por el propio chat que ofrece Booking, y gestionar la reserva sin hacer uso de la aplicación. Sin embargo, hoy en día Booking es una aplicación bastante popular y la gran mayoría de los usuarios prefieren gestionar sus estancias a través de la plataforma. ¿Cuáles son los motivos?

1. Booking proporciona seguridad y tiene una política de cancelación de la estancia que normalmente suele ser cancelación gratuita hasta pocos días antes del viaje.
1. Ofrece  medios  de  transporte  como  vuelos  o  alquiler  de  coches,  además  del alojamiento para facilitarte la llegada a tu destino.
1. Facilita la compra de entradas para las atracciones.
1. Perfil  de  usuario  con  nivel  “Genius”.  A  medida  que  se  van  gestionando  más reservas, vas subiendo de nivel lo que te proporciona más ofertas.

Nosotros, al igual que Booking, ofreceremos seguridad encargándonos de verificar que todos los servicios que se ofrecen en la aplicación son fiables. Además, una de las características por las que nos destacamos es la centralización de toda la organización de tu  evento:  lugar,  entretenimiento,  decoración,  catering,  etc.  Además,  introducimos  la novedad de las invitaciones.   

Al finalizar el evento, se generará una Url con toda la información del evento que se mandará a los invitados para que confirmen su asistencia a través de la aplicación, pero sin necesidad de registrarse. Deberán poner su nombre, apellidos, teléfono, dirección y correo electrónico. La aplicación mostrará una sección con todos los invitados y un recuento de cuantos son.  

Esto es importante para servicios como el catering, que suele cobrarse por número de comensales. El proceso para contratar un servicio será el siguiente:

- Se añadirán los servicios al evento.
- Se realizará el pago de una señal de todos los servicios excepto del catering.
  - Poner en la pantalla de pago un desglose de los servicios y el % sobre el precio que cada servicio haya puesto de señal.
- Se  realizará  una  “reserva”  del  catering  hasta  que  se  confirme  el  número  de invitados. 
- Poner en los detalles de la vista “Mis Eventos” un formulario para confirmar 

  el número de invitados. 

- Una vez esté el número de invitados confirmado, se procederá al pago de la  señal del catering. 
- **X** tiempo antes del evento se te cobrará el coste restante del evento.
- Poner un desglose con los servicios y sus precios y las comisiones que se lleva Eventbride. 
- Comisiones por pago a los usuarios: 2%
- Comisiones por cada venta de oferta a los proveedores: 2.5% 

Fecha en la que se realizará el pago del evento. Se te pedirá la tarjeta, pero no pagarás hasta las siguientes fechas.

- Bodas: 4 meses antes 
- Bautizos: 1 mes antes 
- Comuniones: 2 meses antes

Ciertos servicios podrán exigirte el pago de una  fianza que se añadirá en el desglose de precios a la hora de realizar el pago final. Junto a esto se añadirá también el porcentaje de comisión de Eventbride, todo anteriormente referenciado arriba en el documento.

El plazo para confirmar a los invitados será de hasta **cuatro** meses antes del evento en caso de tratarse de una boda; **dos** meses si es una comunión y **un** mes si es un bautizo. 

Además,  se  contempla  añadir  servicios  de  autobuses  o  taxis  de  ida  y  vuelta, privados de la propia aplicación, para facilitar el acceso al evento. Se ofrecerán descuentos en  estos  servicios  dependiendo  de  la  cantidad  de  servicios  contratados  en  nuestra aplicación. Esto es algo muy útil, pues si se ofrecen servicios de transporte ida para los invitados desde el lugar de celebración previo al evento, y servicios de transporte de vuelta con  una  o  varias  paradas,  a  un  precio  asequible,  los  invitados  podrán  sentirse  más cómodos.   Esto queda sujeto a la evolución del proyecto.

En cambio, para esta aplicación no vemos necesaria la incorporación de un sistema de niveles de puntos para acumular ofertas como en Booking, ya que entendemos que nuestros usuarios la usarán más esporádicamente, ya que el tipo de celebraciones que ofrecemos no son tan recurrentes como los viajes. No obstante, pensamos expandirnos para poder ofrecer servicios para organizar más eventos como cumpleaños en un futuro. Si esto ocurre, sí que podría ser interesante incorporar este sistema de puntos.

<div id='id2'></div>

## Contacto con los proveedores 

Para contactar con los proveedores, en un primer momento lo haremos de forma manual  a  través  de  su  número  de  teléfono  o  email.  Destinaremos  a  unos  cuantos integrantes  del  equipo  a  buscar  posibles  proveedores  que  quieran  utilizar  nuestros servicios. El beneficio que pueden obtener de esto sería más publicidad y facilidad a la hora de gestionar las reservas. A los proveedores se les ofrecerá la posibilidad de añadir este evento a Google Calendar para centralizar las reservas. A cambio, se le pedirá una pequeña comisión de sus ventas, que se explicarán en más detalle en el siguiente apartado.

Una vez que dispongamos de un reconocimiento considerable en redes sociales, contactaremos con los servicios a través de estas. Pero, como se ha mencionado se requiere de tener un cierto número de seguidores para que estos proveedores puedan confiar en nuestros servicios. 

<div id='id3'></div>

## Ingresos de la aplicación 

Los  ingresos  económicos  de  la  aplicación  vendrán  dados  por  los  siguientes 

parámetros:  

- Comisiones a usuarios y proveedores
  - Comisiones por pago a los usuarios: 2%
  - Comisiones por cada venta de oferta a los proveedores: 2.5%
- Plan premium proveedores: 
  - Estadísticas mejoradas
- Estadísticas de las interacciones de los usuarios con sus ofertas
  - Aumento del número de servicios a ofertar
- Patrocinio para que sus servicios salgan mejor posicionados

La aplicación será gratuita para los usuarios y ofrecerá una buena experiencia sin interrupciones con la finalidad de que el usuario pase por todo el proceso de creación de su evento hasta llegar a la pasarela de pago. En ella, se añadirá una comisión del  2% del total para el usuario. El usuario aceptará la comisión ya que está demostrado que un cliente es más susceptible a una venta una vez que abre la cartera. Además, el usuario ha ido creando la idea del evento de sus sueños en la cabeza y está a un click (pagar) de tener todo el evento organizado y por una pequeña comisión aceptará el pago.

En el caso de los proveedores, tendrán una comisión del 2.5% por cada servicio que vendan. La comisión de los proveedores debe ser baja para garantizar que los proveedores continúen usando la aplicación. No ganamos dinero por los intereses de un proveedor sino por la suma de comisiones que generan entre todos los servicios que existen en un pago.

Por último, los proveedores tendrán un número limitado de 5 ofertas. Para muchos de ellos, solo harán falta de 1 a 3 ofertas. Por ejemplo, un mago autónomo pondrá sólo su oferta  de  mago,  sin  embargo,  una  empresa  de  catering  puede  tener  varios  caterings disponibles.  

Si el proveedor está satisfecho con la aplicación querrá tener un mayor número de ofertas a causa del crecimiento de su negocio y será susceptible al pago de una membresía premium que permitirá a esta poner ofertas   ilimitadas.  Además,  se  le  ofrecerá  unas estadísticas de la interacción de los usuarios con sus ofertas, como, por ejemplo, cuantos usuarios añaden su oferta al carrito una vez entrado en los detalles.

[Ver Excel[ Ganancias.xlsx\]  ](https://uses0-my.sharepoint.com/:x:/g/personal/natolmvil_alum_us_es/EdS2Oo4PIGlKjVsFuRwkQ88BqyNE2jOEUUfDKJVEhNV2-w?e=hbcB0n)

Con este sistema, teniendo en cuenta sólo bodas, para amortizar la inversión inicial sólo necesitaríamos que se produjeran entre 42 a 63 pagos dependiendo de lo caras que sean las bodas. Viendo el volumen de bodas que se producen al año en Sevilla, es una cifra realista. 

<div id='id4'></div>

## Sistema de reembolso por cancelación del cliente 

En base a las estadísticas, el plazo para preparar los eventos es el siguiente.

- Bodas: 12 meses 
- Bautizos: 3 meses 
- Comuniones: 5 meses 

En base a estos datos, se ofrecerá la posibilidad de cancelación en rangos de fechas diferentes dependiendo de la celebración.

- Bodas: cancelación gratuita (salvo fianza) en caso de quedar 5 meses.
- Bautizos: cancelación gratuita (salvo fianza) en caso de quedar 1 meses. 
- Comuniones: cancelación gratuita (salvo fianza) en caso de quedar 3 meses.

Estos  rangos  serán  estándar.  Podrán  ser  modificados  por  los  servicios  que  lo deseen y deberán estar plasmados en la página de detalles del servicio.

Los gastos de gestión de la aplicación no serán devueltos en ningún caso. 

Sistema de reembolso por cancelación del proveedor 

Si el proveedor es el que cancela el servicio, se reembolsará la totalidad del pago efectuado. 

Los gastos de gestión de la aplicación no serán devueltos en ningún caso. 

<div id='bib'></div>

## Bibliografía 

Intencionalmente en blanco.

