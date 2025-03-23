package com.eventbride.event_properties;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.transaction.annotation.Transactional;

import com.eventbride.dto.EventPropertiesDTO;
import com.eventbride.event.Event;
import com.eventbride.event.EventRepository;
import com.eventbride.event_properties.EventProperties.Status;
import com.eventbride.otherService.OtherService;
import com.eventbride.otherService.OtherServiceRepository;
import com.eventbride.otherService.OtherServiceService;
import com.eventbride.user.User;
import com.eventbride.venue.Venue;
import com.eventbride.venue.VenueRepository;
import com.eventbride.venue.VenueService;

import org.springframework.stereotype.Service;

@Service
public class EventPropertiesService {
    private EventPropertiesRepository eventPropertiesRepository;
    private EventRepository eventRepository;
    private VenueService venueService;
    private OtherServiceService otherServiceService;

    @Autowired
    public EventPropertiesService(EventPropertiesRepository eventPropertiesRepository,
            EventRepository eventRepository, VenueService venueService, OtherServiceService otherServiceService) {
        this.eventPropertiesRepository = eventPropertiesRepository;
        this.eventRepository = eventRepository;
        this.venueService = venueService;
        this.otherServiceService = otherServiceService;

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
        return EventPropertiesDTO.fromEntity(g.get());
    }

    @Transactional(readOnly = true)
    public EventProperties findById(int id) throws DataAccessException {
        Optional<EventProperties> g = eventPropertiesRepository.findById(id);
        return g.get();
    }

    @Transactional
    public EventProperties save(EventProperties eventProperties) throws DataAccessException {
        return eventPropertiesRepository.save(eventProperties);
    }

    @Transactional
    public EventProperties updateEventProperties(EventProperties eventProperties, int id) throws DataAccessException {
        EventProperties toUpdate = findById(id);
        BeanUtils.copyProperties(eventProperties, toUpdate);
        return save(toUpdate);
    }

    @Transactional
    public EventProperties updateEventPropertiesToCancelled(Integer id) throws DataAccessException {
        EventProperties toUpdate = findById(id);
        toUpdate.setStatus(Status.CANCELLED);
        return save(toUpdate);
    }

    @Transactional(readOnly = true)
    public EventProperties findEventPropertiesByEvent(Event event) {
        return (EventProperties) eventPropertiesRepository.findEventPropertiesByEvent(event);
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
    public void getEventsPropsToCancelVenue(LocalDate fecha, Integer venueId, Integer eventPropId){
        List<EventProperties> listToCancelVenues = eventPropertiesRepository.findVenuesToCancel(fecha, venueId, eventPropId);
        for (EventProperties eP : listToCancelVenues) {
            deleteEventProperties(eP.getId());
            // Send emails
            Event event = eventPropertiesRepository.findEventByEventPropertiesId(eP.getId());
            User user = event.getUser();
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom("eventbride6@gmail.com");
            mailMessage.setTo(user.getEmail());
            mailMessage.setSubject("Recinto cancelado");
            mailMessage.setText("El recinto " + eP.getVenue().getName() + " ha sido cancelado" + "para el evento " + "eP.getEvent().getName()" + "el dia " + eP.getStartTime() +
            ". \n Puede volver a solicitar el servicio mediante la aplicacion." +
            "\n\n Saludos, \n EventBride");
            mailSender.send(mailMessage);
        }
    }

    @Transactional(readOnly = true)
    public void getEventsPropsToCancelOtherService(LocalDate fecha, Integer otherServiceId, Integer eventPropId){
        List<EventProperties> listToCancelOtherServices = eventPropertiesRepository.findOtherServicesToCancel(fecha, otherServiceId, eventPropId);
        for (EventProperties eP : listToCancelOtherServices) {
            updateEventPropertiesToCancelled(eP.getId());
            // Send emails
            Event event = eventPropertiesRepository.findEventByEventPropertiesId(eP.getId());
            User user = event.getUser();
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom("eventbride6gmail.com");
            mailMessage.setTo(user.getEmail());
            mailMessage.setSubject("Servicio cancelado");
            mailMessage.setText("El servicio " + eP.getOtherService().getName() + " ha sido cancelado" + "para el evento " + "eP.getEvent().getName()" + "el dia " + eP.getStartTime() +
            ". \n Puede volver a solicitar el servicio mediante la aplicacion." +
            "\n\n Saludos, \n EventBride");
            mailSender.send(mailMessage);
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
                throw new RuntimeException("Este servicio ya estÃ¡ asociado a este evento");
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
        event.get().getEventProperties().add(eventPropertiesSaved);
        eventRepository.save(event.get());
        return event.get();
    }

    @Transactional
    public void deleteEventProperties(int id) throws DataAccessException {
        eventPropertiesRepository.deleteById(id);
    }

    @Transactional
    public List<EventPropertiesDTO> findEventPropertiesPendingByUserId(Integer userId) {
        List<OtherService> otherServices = otherServiceService.getOtherServiceByUserId(userId);
        List<Venue> venues = venueService.getVenuesByUserId(userId);
        List<EventPropertiesDTO> res = new ArrayList<>();

        for (OtherService otherService : otherServices) {
            res.addAll(eventPropertiesRepository.findByOtherServiceAndStatus(otherService,
                    EventProperties.Status.PENDING).stream().map(e -> new EventPropertiesDTO(e)).toList());
        }

        for (Venue venue : venues) {
            res.addAll(eventPropertiesRepository.findByVenueAndStatus(venue,
                    EventProperties.Status.PENDING).stream().map(e -> new EventPropertiesDTO(e)).toList());
        }
        return res;
    }

}