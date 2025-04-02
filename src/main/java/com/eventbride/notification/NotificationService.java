package com.eventbride.notification;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.eventbride.event.Event;
import com.eventbride.event_properties.EventProperties;
import com.eventbride.notification.Notification.NotificationType;
import com.eventbride.user.User;
import com.eventbride.user.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    JavaMailSender mailSender;

    @Transactional
    public List<Notification> getAllNotificationsForUser(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return notificationRepository.findByUserId(user.get().getId());
    }

    @Transactional
    public void createNotification(Notification.NotificationType type, User user, Event event,
            EventProperties eventProperties) {
        Notification notification = new Notification();
        notification.setCreatedAt(LocalDateTime.now());
        notification.setUser(user);
        switch (type) {
            case REQUEST_CANCELLED_PROVIDER:
                notification.setType(NotificationType.REQUEST_CANCELLED_PROVIDER);
                notification.setSubject("Solicitud de reserva cancelada");
                notification.setMessage("Tu solicitud de reserva de "
                        + (eventProperties.getOtherService() != null ? eventProperties.getOtherService().getName()
                                : eventProperties.getVenue().getName())
                        + " para el evento " + "event.getName(PONEDLE NOMBRE AL EVENTO YA)"
                        + " ha sido cancelada por el proveedor.");
                sendEmailNotification(user, notification.getSubject(), notification.getMessage());
                break;
            case REQUEST_CANCELLED_AUTO:
                notification.setType(NotificationType.REQUEST_CANCELLED_AUTO);
                notification.setSubject("Solicitud de reserva cancelada");
                notification.setMessage("Tu solicitud de reserva de "
                        + (eventProperties.getOtherService() != null ? eventProperties.getOtherService().getName()
                                : eventProperties.getVenue().getName())
                        + " para el evento " + "event.getName(PONEDLE NOMBRE AL EVENTO YA)"
                        + " ha sido cancelada automáticamente ya que otro usuario ha reservado en la misma franja. Pruebe a solicitar una nueva o a buscar otro servicio.");
                sendEmailNotification(user, notification.getSubject(), notification.getMessage());
                break;
            case EVENT_CREATED:
                notification.setType(NotificationType.EVENT_CREATED);
                notification.setSubject("Evento creado");
                notification.setMessage(
                        "Tu evento " + "event.getName(PONEDLE NOMBRE AL EVENTO YA)" + " ha sido creado con éxito.");
                sendEmailNotification(user, notification.getSubject(), notification.getMessage());
                break;
            case PAYMENT_REMINDER:
                notification.setType(NotificationType.PAYMENT_REMINDER);
                notification.setSubject("Payment Reminder");
                notification.setMessage("This is a reminder for your upcoming payment.");
                sendEmailNotification(user, notification.getSubject(), notification.getMessage());
                break;
            case NEW_MESSAGE:
                notification.setType(NotificationType.NEW_MESSAGE);
                notification.setSubject("Nuevo mensaje");
                notification.setMessage("Has recibido un mensaje, revisa tus chats.");
                sendEmailNotification(user, notification.getSubject(), notification.getMessage());
                break;
            case REQUEST_CONFIRMED:
                notification.setType(NotificationType.REQUEST_CONFIRMED);
                notification.setSubject("Solicitud de reserva confirmada");
                notification.setMessage("Tu solicitud reserva de "
                        + (eventProperties.getOtherService() != null ? eventProperties.getOtherService().getName()
                                : eventProperties.getVenue().getName())
                        + " para el evento " + "event.getName(PONEDLE NOMBRE AL EVENTO YA)"
                        + " ha sido confirmada. Paga la señal cuanto antes para terminar de reservarlo. ¡Que no te lo quiten!");
                sendEmailNotification(user, notification.getSubject(), notification.getMessage());
                break;
            case DEPOSIT_REMINDER:
                notification.setType(NotificationType.DEPOSIT_REMINDER);
                notification.setSubject("Deposit Reminder");
                notification.setMessage("This is a reminder for your deposit payment.");
                sendEmailNotification(user, notification.getSubject(), notification.getMessage());
                break;
            case NEW_REQUEST:
                notification.setType(NotificationType.NEW_REQUEST);
                notification.setSubject("Nueva solicitud de reserva");
                notification.setMessage("Has recibido una nueva solicitud de tu servicio "
                        + (eventProperties.getOtherService() != null ? eventProperties.getOtherService().getName()
                                : eventProperties.getVenue().getName())
                        + " para el evento " + "event.getName(PONEDLE NOMBRE AL EVENTO YA)"
                        + ". Revisa la petición y áceptala para permitir al cliente pagar la señal o recházala en caso de no poder ofrecer el servicio.");
                sendEmailNotification(user, notification.getSubject(), notification.getMessage());
                break;
            case NEW_DEPOSIT_PAYMENT:
                notification.setType(NotificationType.NEW_DEPOSIT_PAYMENT);
                notification.setSubject("Nuevo pago de señal");
                notification.setMessage("El usuario ha pagado la señal de tu reserva de " + 
                        (eventProperties.getOtherService() != null ? eventProperties.getOtherService().getName()
                                : eventProperties.getVenue().getName())
                        + " para el evento " + "event.getName(PONEDLE NOMBRE AL EVENTO YA)"
                        + ". Estamos procesando el pago. Si no lo recibes en los próximos días, por favor, contacta con el soporte de EventBride.");
                sendEmailNotification(user, notification.getSubject(), notification.getMessage());
                break;
            case NEW_REMAINING_PAYMENT:
                notification.setType(NotificationType.NEW_REMAINING_PAYMENT);
                notification.setSubject("Nuevo pago final");
                notification.setMessage("El usuario ha pagado el monto restante para la contratación de tu servicio " + 
                        (eventProperties.getOtherService() != null ? eventProperties.getOtherService().getName()
                                : eventProperties.getVenue().getName())
                        + " para el evento " + "event.getName(PONEDLE NOMBRE AL EVENTO YA)"
                        + ". Estamos procesando el pago. Si no lo recibes en los próximos días, por favor, contacta con el soporte de EventBride.");
                sendEmailNotification(user, notification.getSubject(), notification.getMessage());
                break;
            default:
                throw new RuntimeException("Unknown notification type: " + type);
        }
        notificationRepository.save(notification);
    }

    @Transactional
    public void sendEmailNotification(User to, String subject, String body) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom("eventbride6@gmail.com");
        mailMessage.setTo(to.getEmail());
        mailMessage.setSubject(subject);
        mailMessage.setText("Hola " + to.getFirstName() + ",\n" + body + "\n\n Saludos, \n EventBride");
        mailSender.send(mailMessage);
    }
}
