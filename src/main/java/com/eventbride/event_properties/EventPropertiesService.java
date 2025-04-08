package com.eventbride.event_properties;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.transaction.annotation.Transactional;

import com.eventbride.dto.EventPropertiesDTO;
import com.eventbride.dto.EventPropertiesMapper;
import com.eventbride.dto.UserDTO;
import com.eventbride.event.Event;
import com.eventbride.event.EventRepository;
import com.eventbride.event_properties.EventProperties.Status;
import com.eventbride.notification.Notification;
import com.eventbride.notification.NotificationService;
import com.eventbride.notification.Notification.NotificationType;
import com.eventbride.otherService.OtherService;
import com.eventbride.otherService.OtherServiceRepository;
import com.eventbride.otherService.OtherServiceService;
import com.eventbride.user.User;
import com.eventbride.venue.Venue;
import com.eventbride.venue.VenueRepository;
import com.eventbride.venue.VenueService;

import ch.qos.logback.core.joran.sanity.Pair;

import org.springframework.stereotype.Service;

@Service
public class EventPropertiesService {
    private EventPropertiesRepository eventPropertiesRepository;
    private EventRepository eventRepository;
    private VenueService venueService;
    private OtherServiceService otherServiceService;
    private NotificationService notificationService;
    private EventPropertiesMapper eventPropertiesMapper;

    @Autowired
    public EventPropertiesService(EventPropertiesRepository eventPropertiesRepository,
            EventRepository eventRepository, VenueService venueService, OtherServiceService otherServiceService,
            NotificationService notificationService, EventPropertiesMapper eventPropertiesMapper) {
        this.eventPropertiesRepository = eventPropertiesRepository;
        this.eventRepository = eventRepository;
        this.venueService = venueService;
        this.otherServiceService = otherServiceService;
        this.notificationService = notificationService;
        this.eventPropertiesMapper = eventPropertiesMapper;

    }

    @Autowired
    OtherServiceRepository otherServiceRepository;

    @Autowired
    VenueRepository venueRepository;

    @Autowired
    JavaMailSender mailSender;

    @Transactional(readOnly = true)
    public List<EventProperties> findAll() {
        return eventPropertiesRepository.findAll();
    }

    @Transactional(readOnly = true)
    public EventPropertiesDTO findByIdDTO(int id) throws DataAccessException {
        Optional<EventProperties> g = eventPropertiesRepository.findById(id);
        Event e = eventPropertiesRepository.findEventByEventPropertiesId(id);
        return eventPropertiesMapper.toDTO(g.get(), e);
    }

    @Transactional(readOnly = true)
    public EventProperties findById(int id) throws DataAccessException {
        Optional<EventProperties> g = eventPropertiesRepository.findById(id);
        return g.get();
    }

    @Transactional(readOnly = true)
    public Optional<EventProperties> findByIdOptional(int id) throws DataAccessException {
        Optional<EventProperties> g = eventPropertiesRepository.findById(id);
        return g;
    }

    @Transactional
    public EventProperties save(EventProperties eventProperties) throws DataAccessException {
        return eventPropertiesRepository.save(eventProperties);
    }

    @Transactional
    public EventProperties updateEventProperties(EventProperties eventProperties, int id) throws DataAccessException {
        EventProperties toUpdate = findById(id);
        BeanUtils.copyProperties(eventProperties, toUpdate);
        if(eventProperties.getStatus() == EventProperties.Status.APPROVED) {
            Optional<Event> event = eventRepository.findByEventPropertiesId(eventProperties.getId());
            notificationService.createNotification(NotificationType.REQUEST_CONFIRMED, event.get().getUser(), event.get(), eventProperties, null);
        }
        return save(toUpdate);
    }

    @Transactional
    public EventProperties updateEventPropertiesToCancelled(Integer id) throws DataAccessException {
        EventProperties toUpdate = findById(id);
        toUpdate.setStatus(EventProperties.Status.CANCELLED);
        EventProperties saved = updateEventProperties(toUpdate, id);
        System.out.println("DESPUÉS DEL CAMBIO -> status: " + saved.getStatus());
        return saved;
    }

    @Transactional(readOnly = true)
    public EventProperties findEventPropertiesByEvent(Event event) {
        return (EventProperties) eventPropertiesRepository.findEventPropertiesByEvent(event);
    }

    @Transactional(readOnly = true)
    public Event findEventByEventPropertiesId(Integer eventPropertiesId) {
        return eventPropertiesRepository.findEventByEventPropertiesId(eventPropertiesId);
    }

    @Transactional(readOnly = true)
    public List<EventProperties> findEventPropertiesByOtherService(Integer otherServiceId) {
        return eventPropertiesRepository.findEventPropertiesByOtherServiceId(otherServiceId);
    }

    @Transactional(readOnly = true)
    public List<EventProperties> findEventPropertiesByVenue(Integer venueId) {
        return eventPropertiesRepository.findEventPropertiesByVenueId(venueId);
    }

    @Transactional(readOnly = true)
    public List<List<Object>> findAllEventPropertiesAfterNow(Integer userId) {

        // Encontrar todos los eventproperties que tienen como dueño al usuario

        List<EventProperties> allOfUser = new ArrayList<>();

        for (EventProperties ep : eventPropertiesRepository.findAll()) {

            if (ep.getVenue() == null && ep.getOtherService().getUser().getId() == userId) {
                allOfUser.add(ep);
            } else if (ep.getOtherService() == null && ep.getVenue().getUser().getId() == userId) {
                allOfUser.add(ep);
            }
        }

        List<List<Object>> res = new ArrayList<>();

        for (Event e : eventRepository.findAll()) {
            List<EventProperties> epAsociadosEvento = e.getEventProperties();
            for (EventProperties ep : allOfUser) {
                for (EventProperties epAsociado : epAsociadosEvento) {
                    if (ep.getId() == epAsociado.getId()) {
                        List<Object> r = new ArrayList<>();
                        r.add(eventPropertiesMapper.toDTO(ep, e));
                        r.add(new UserDTO(e.getUser()));
                        res.add(r);
                    }
                }
            }
        }

        return res;
    }

    @Transactional
    public void getEventsPropsToCancelVenue(LocalDate fecha, Integer venueId, Integer eventPropId) {
        List<EventProperties> listToCancelVenues = eventPropertiesRepository.findVenuesToCancel(fecha, venueId,
                eventPropId);
        for (EventProperties eP : listToCancelVenues) {
            // Send emails
            Event event = eventPropertiesRepository.findEventByEventPropertiesId(eP.getId());
            User user = event.getUser();
            notificationService.createNotification(NotificationType.REQUEST_CANCELLED_AUTO, user, event, eP, null);
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom("eventbride6@gmail.com");
            mailMessage.setTo(user.getEmail());
            mailMessage.setSubject("Recinto cancelado");
            mailMessage.setText("El recinto " + eP.getVenue().getName() + " ha sido cancelado para el evento del dia "
                    + eP.getStartTime().toLocalDate() +
                    ". \n Puede volver a solicitar el servicio mediante la aplicacion." +
                    "\n\n Saludos, \n EventBride");
            mailSender.send(mailMessage);
            updateEventPropertiesToCancelled(eP.getId());
        }
    }

    @Transactional
    public void clientCancelOtherService(Integer eventPropId) {
        EventProperties eventProperty = eventPropertiesRepository.findById(eventPropId).get();
        
        Event event = eventPropertiesRepository.findEventByEventPropertiesId(eventPropId);

        if (Status.APPROVED.equals(eventProperty.getStatus())) {
            User client = event.getUser();
            User provider = eventProperty.getOtherService().getUser();
            
            notificationService.createNotification(NotificationType.REQUEST_CANCELLED_AUTO, provider, event, eventProperty);
            
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom("eventbride6@gmail.com");
            mailMessage.setTo(provider.getEmail());
            mailMessage.setSubject("Servicio cancelado por cliente");
            mailMessage.setText("El cliente " + client.getFirstName() + " " + client.getLastName() + 
                    " ha cancelado el servicio \"" + eventProperty.getOtherService().getName() + 
                    "\" para el evento del día " + eventProperty.getStartTime().toLocalDate() + 
                    ".\n\nSaludos,\nEventBride");
            mailSender.send(mailMessage);
        }
        System.out.println("Eliminando servicio con ID: " + eventProperty.getId());
        
        Optional<Event> eventOpt = eventRepository.findByEventPropertiesId(eventPropId);
        if (eventOpt.isPresent()) {
            Event event2 = eventOpt.get();
            event2.getEventProperties().removeIf(ep -> ep.getId().equals(eventPropId));
            eventRepository.save(event2);
        }
        
        eventProperty.setOtherService(null);
        eventProperty.setVenue(null);
        eventPropertiesRepository.save(eventProperty);
        
        eventPropertiesRepository.delete(eventProperty);
    }

    @Transactional
    public void clientCancelVenue(Integer eventPropertiesId) {
        EventProperties eventProperty = eventPropertiesRepository.findById(eventPropertiesId).get();
        
        Event event = eventPropertiesRepository.findEventByEventPropertiesId(eventPropertiesId);

        if (Status.APPROVED.equals(eventProperty.getStatus())) {
            User client = event.getUser();
            User provider = eventProperty.getVenue().getUser();
            
            notificationService.createNotification(NotificationType.REQUEST_CANCELLED_AUTO, provider, event, eventProperty);
            
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom("eventbride6@gmail.com");
            mailMessage.setTo(provider.getEmail());
            mailMessage.setSubject("Recinto cancelado por cliente");
            mailMessage.setText("El cliente " + client.getFirstName() + " " + client.getLastName() + 
                    " ha cancelado la reserva del recinto \"" + eventProperty.getVenue().getName() + 
                    "\" para el evento del día " + eventProperty.getStartTime().toLocalDate() + 
                    ".\n\nSaludos,\nEventBride");
            mailSender.send(mailMessage);
        }
        
        Optional<Event> eventOpt = eventRepository.findByEventPropertiesId(eventPropertiesId);
        if (eventOpt.isPresent()) {
            Event event2 = eventOpt.get();
            event2.getEventProperties().removeIf(ep -> ep.getId().equals(eventPropertiesId));
            eventRepository.save(event2);
        }
        
        eventProperty.setOtherService(null);
        eventProperty.setVenue(null);
        eventPropertiesRepository.save(eventProperty);
        
        eventPropertiesRepository.delete(eventProperty);
    }

    @Transactional
    public void getEventsPropsToCancelOtherService(LocalDate fecha, Integer otherServiceId, Integer eventPropId) {
        List<EventProperties> listToCancelOtherServices = eventPropertiesRepository.findOtherServicesToCancel(fecha,
                otherServiceId, eventPropId);
        for (EventProperties eP : listToCancelOtherServices) {
            // Send emails
            Event event = eventPropertiesRepository.findEventByEventPropertiesId(eP.getId());
            User user = event.getUser();
            notificationService.createNotification(NotificationType.REQUEST_CANCELLED_AUTO, user, event, eP, null);
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom("eventbride6gmail.com");
            mailMessage.setTo(user.getEmail());
            mailMessage.setSubject("Servicio cancelado");
            mailMessage.setText("El servicio " + eP.getOtherService().getName()
                    + " ha sido cancelado para el evento del dia " + eP.getStartTime().toLocalDate() +
                    ". \n Puede volver a solicitar el servicio mediante la aplicacion." +
                    "\n\n Saludos, \n EventBride");
            mailSender.send(mailMessage);
            updateEventPropertiesToCancelled(eP.getId());

        }
    }

    @Transactional
    public Event addOtherServiceToEvent(Integer eventId, Integer otherServiceId, LocalDateTime startDate,
            LocalDateTime endDate) {
        Optional<Event> event = eventRepository.findById(eventId);
        if (event.isEmpty()) {
            throw new RuntimeException("Evento no encontrado");
        }
        OtherService service = otherServiceRepository.findById(otherServiceId)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        List<EventProperties> eventPropertiesEvent = event.get().getEventProperties();
        if (eventPropertiesEvent == null) {
            eventPropertiesEvent = new ArrayList<>();
        }
        for (EventProperties e : eventPropertiesEvent) {
            if (e.getOtherService() != null && e.getOtherService().getId() == otherServiceId) {
                throw new RuntimeException("Este servicio ya está asociado a este evento");
            }
        }
        EventProperties eventProperties = new EventProperties();
        eventProperties.setOtherService(service);
        eventProperties.setVenue(null);
        eventProperties.setStartTime(startDate);
        eventProperties.setEndTime(endDate);
        eventProperties.setStatus(EventProperties.Status.PENDING);
        eventProperties.setBookDateTime(LocalDateTime.now());
        BigDecimal priceService;
        if (service.getLimitedByPricePerGuest() != null && service.getLimitedByPricePerGuest()) {
            priceService = BigDecimal.valueOf(event.get().getGuests()).multiply(service.getServicePricePerGuest());
        } else if (service.getLimitedByPricePerHour() != null && service.getLimitedByPricePerHour()) {
            long totalMinutes = Duration.between(startDate, endDate).toMinutes();
            BigDecimal hoursDecimal = BigDecimal.valueOf(totalMinutes)
                    .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
            priceService = hoursDecimal.multiply(service.getServicePricePerHour());
        } else {
            priceService = service.getFixedPrice();
        }
        eventProperties.setPricePerService(priceService);
        eventProperties.setDepositAmount(priceService.doubleValue() * 0.35);
        EventProperties eventPropertiesSaved = eventPropertiesRepository.save(eventProperties);
        notificationService.createNotification(NotificationType.NEW_REQUEST, eventProperties.getOtherService().getUser(), event.get(), eventProperties, null);
        event.get().getEventProperties().add(eventPropertiesSaved);
        eventRepository.save(event.get());
        return event.get();
    }

    @Transactional
    public Event addVenueToEvent(Integer eventId, Integer venueId, LocalDateTime startDate, LocalDateTime endDate) {
        Optional<Event> event = eventRepository.findById(eventId);
        Venue service = venueRepository.findById(venueId)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        List<EventProperties> eventPropertiesEvent = event.get().getEventProperties();
        for (EventProperties e : eventPropertiesEvent) {
            if (e.getVenue() != null) {
                throw new RuntimeException("Este evento ya tiene un servicio asociado.");
            }
        }
        EventProperties eventProperties = new EventProperties();
        eventProperties.setOtherService(null);
        eventProperties.setVenue(service);
        eventProperties.setStartTime(startDate);
        eventProperties.setEndTime(endDate);
        eventProperties.setStatus(EventProperties.Status.PENDING);
        eventProperties.setBookDateTime(LocalDateTime.now());
        BigDecimal priceService;
        if (service.getLimitedByPricePerGuest()) {
            priceService = BigDecimal.valueOf(event.get().getGuests()).multiply(service.getServicePricePerGuest());
        } else if (service.getLimitedByPricePerHour()) {
            long totalMinutes = Duration.between(startDate, endDate).toMinutes();
            BigDecimal hoursDecimal = BigDecimal.valueOf(totalMinutes)
                    .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
            priceService = hoursDecimal.multiply(service.getServicePricePerHour());
        } else {
            priceService = service.getFixedPrice();
        }
        eventProperties.setPricePerService(priceService);
        eventProperties.setDepositAmount(priceService.doubleValue() * 0.35);
        EventProperties eventPropertiesSaved = eventPropertiesRepository.save(eventProperties);
        notificationService.createNotification(NotificationType.NEW_REQUEST, eventProperties.getVenue().getUser(), event.get(), eventProperties, null);
        event.get().getEventProperties().add(eventPropertiesSaved);
        eventRepository.save(event.get());
        return event.get();
    }

    @Transactional
    public void deleteEventProperties(int id, Venue venue, OtherService otherService) throws DataAccessException {
        EventProperties eventProperties = new EventProperties();
        eventProperties = eventPropertiesRepository.findById(id).orElse(null);
        Optional<Event> event = eventRepository.findByEventPropertiesId(id);
        if (otherService == null) {
            eventProperties.setVenue(venue);
            notificationService.createNotification(NotificationType.REQUEST_CANCELLED_PROVIDER, event.get().getUser(), event.get(), eventProperties, null);
            eventProperties.setVenue(null);
        } else {
            eventProperties.setOtherService(otherService);
            notificationService.createNotification(NotificationType.REQUEST_CANCELLED_PROVIDER, event.get().getUser(), event.get(), eventProperties, null);
            eventProperties.setOtherService(null);
        }
        eventPropertiesRepository.deleteById(id);

    }

    @Transactional
    public List<EventPropertiesDTO> findEventPropertiesPendingByUserId(Integer userId) {
        List<OtherService> otherServices = otherServiceService.getOtherServiceByUserId(userId);
        List<Venue> venues = venueService.getVenuesByUserId(userId);
        List<EventPropertiesDTO> res = new ArrayList<>();

        for (OtherService otherService : otherServices) {
            List<EventProperties> props = eventPropertiesRepository.findByOtherServiceAndStatus(
                    otherService, EventProperties.Status.PENDING);

            for (EventProperties ep : props) {
                Event event = eventPropertiesRepository.findEventByEventPropertiesId(ep.getId());
                res.add(eventPropertiesMapper.toDTO(ep, event));
            }
        }

        for (Venue venue : venues) {
            List<EventProperties> props = eventPropertiesRepository.findByVenueAndStatus(
                    venue, EventProperties.Status.PENDING);

            for (EventProperties ep : props) {
                Event event = eventPropertiesRepository.findEventByEventPropertiesId(ep.getId());
                res.add(eventPropertiesMapper.toDTO(ep, event));
            }
        }

        return res;
    }


}