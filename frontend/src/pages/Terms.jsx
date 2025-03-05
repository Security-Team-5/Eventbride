import "../static/resources/css/Terms.css"

function Terms() {
    return (
    <div className="terms-container">
      <h1>Términos y Condiciones</h1> 

      <section>
        <h2>Objeto del Acuerdo</h2>
        <div className="term-paragraph">
          <p className="term">
            Este documento regula el uso de la plataforma EventBride, que conecta a usuarios interesados en organizar
            eventos (bodas, bautizos, comuniones, etc.) con proveedores que ofrecen servicios y espacios (lugares, catering,
            música, espectáculos, etc.) para dichos eventos.
          </p>
        </div>
      </section>

      <section>
        <h2>Aceptación de los Términos</h2>

        <div className="term-paragraph">
          <p className="term">
          Para poder hacer uso de EventBride, tanto usuarios como proveedores deben aceptar los términos y condiciones
          aquí definidos, así como comprometerse a cumplir estos en su totalidad, pudiendo vetarse el acceso a la plataforma
          a aquellos usuarios que los incumplan activamente.
          </p>
        </div>
      </section>

      <section>
        <h2>Registro y Uso de la Plataforma</h2>
        <div className="term-paragraph">
          <p className="term">
          Los usuarios deberán proporcionar información veraz y mantener la confidencialidad de sus credenciales de acceso.
          Los proveedores deberán registrar su negocio y ofrecer una descripción precisa y actualizada de los servicios y
          espacios disponibles. Ambos se comprometen a utilizar la plataforma de manera responsable y en cumplimiento con la
          normativa vigente.
          </p>
        </div>
      </section>

      <section>
        <h2>Procesamiento de Pagos</h2>

        <div className="term-paragraph">
          <p className="term">
          EventBride facilita las transacciones a través de pasarelas de pago, utilizando PayPal para garantizar un proceso
          seguro y confiable. Los pagos se realizan directamente entre el usuario y el proveedor, actuando EventBride
          únicamente como intermediario en la gestión del pago. Asimismo, acepta que la calidad, ejecución y resultados de
          los servicios dependen exclusivamente del proveedor, eximiendo a la plataforma de cualquier garantía o
          responsabilidad al respecto.
          </p>
        </div>
      </section>

      <section>
        <h2>Reservas, Cancelaciones y Reembolsos</h2>
        <div className="term-paragraph">
          <p className="term">
          Las condiciones específicas de reserva y reembolso se definirán en el acuerdo entre el usuario y el proveedor,
          siempre en línea con nuestras políticas generales.
          </p>
        </div>
        <ul>
          <li>Bodas: la cancelación gratuita debe realizarse al menos 5 meses antes de la fecha del evento.</li>
          <li>Bautizos: la cancelación gratuita debe realizarse al menos 2 meses antes del evento.</li>
          <li>Comuniones: la cancelación gratuita debe realizarse al menos 3 meses antes del evento.</li>
        </ul>
        
        <div className="term-paragraph">
          <p className="term">
          En caso de que el proveedor cancele el servicio, el cliente recibirá el reembolso completo del pago realizado.
          Los gastos de gestión de la aplicación no serán devueltos en ningún caso. Sin importar cuál de las dos partes
          cancele el evento.
          </p>
        </div>
      </section>

      <section>
        
        <h2>Valoración de Servicios</h2>
        <div className="term-paragraph">
          <p className="term">
          Los usuarios podrán calificar y dejar reseñas sobre la atención y calidad de los servicios recibidos a través de
          un sistema de valoración integrado en la plataforma. Las valoraciones serán públicas y contribuirán a la
          reputación de los proveedores, permitiendo a otros usuarios tomar decisiones informadas. EventBride se reserva el
          derecho de moderar o eliminar valoraciones que contengan contenido ofensivo o que no cumplan con las políticas de
          uso establecidas.
          </p>
        </div>
      </section>

      <section>
        <h2>Caso de Incumplimiento de los Servicios</h2>
        <div className="term-paragraph">
          <p className="term">
          En el supuesto de que el proveedor no preste el servicio contratado, la plataforma limitará su actuación a
          eliminar la oferta correspondiente de la aplicación. EventBride no interviene en la resolución de disputas
          derivadas del incumplimiento, siendo el usuario quien deberá iniciar las reclamaciones y gestionar cualquier
          procedimiento legal o de mediación directamente con el proveedor.
          </p>
        </div>
      </section>

      <section>
        <h2>Propiedad Intelectual y Uso de Contenidos</h2>
        <div className="term-paragraph">
          <p className="term">
          Todo el contenido, diseño, logotipos y marcas de EventBride son propiedad exclusiva de la plataforma. Queda
          prohibida la reproducción, distribución o modificación de dichos elementos sin autorización previa.
          </p>
        </div>
      </section>

      <section>
        <h2>Protección de Datos</h2>
        <div className="term-paragraph">
          <p className="term">
          EventBride se compromete a tratar los datos personales de usuarios y proveedores conforme a la legislación
          vigente en materia de protección de datos, garantizando su confidencialidad y seguridad.
          </p>
        </div>
      </section>
    </div>
    );

    
}



export default Terms;