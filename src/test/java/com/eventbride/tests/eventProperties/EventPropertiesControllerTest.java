package com.eventbride.tests.eventProperties;

import com.eventbride.dto.EventDTO;
import com.eventbride.dto.EventPropertiesDTO;
import com.eventbride.dto.EventPropertiesMapper;
import com.eventbride.dto.OtherServiceDTO;
import com.eventbride.dto.UserDTO;
import com.eventbride.dto.VenueDTO;
import com.eventbride.event.Event;
import com.eventbride.event.EventService;
import com.eventbride.event_properties.EventProperties;
import com.eventbride.event_properties.EventProperties.Status;
import com.eventbride.event_properties.EventPropertiesController;
import com.eventbride.event_properties.EventPropertiesRepository;
import com.eventbride.event_properties.EventPropertiesService;
import com.eventbride.otherService.OtherService;
import com.eventbride.otherService.OtherServiceService;
import com.eventbride.user.User;
import com.eventbride.user.UserService;
import com.eventbride.venue.Venue;
import com.eventbride.venue.VenueService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class EventPropertiesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EventPropertiesRepository eventPropertiesRepository;

    @MockBean
    private EventPropertiesMapper eventPropertiesMapper;

    @MockBean
    private EventPropertiesService eventPropertiesService;

    @MockBean
    private EventService eventService;

    @MockBean
    private VenueService venueService;

    @MockBean
    private OtherServiceService otherServiceService;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    private EventProperties createEventProperty() {
        EventProperties ep = new EventProperties();
        ep.setId(1);
        ep.setPricePerService(BigDecimal.valueOf(150.0));
        ep.setBookDateTime(LocalDateTime.now());
        ep.setStatus(Status.PENDING);
        return ep;
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testFindAllEvents_asAdmin_returnsList() throws Exception {
        List<EventProperties> mockList = List.of(createEventProperty());
        when(eventPropertiesService.findAll()).thenReturn(mockList);

        mockMvc.perform(get("/api/event-properties"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].pricePerService", is(150.0)));
    }

    @Test
    @WithMockUser(username = "cliente", authorities = {"STUDENT"})
    void testFindAllEvents_asNonAdmin_returnsError() throws Exception {
        mockMvc.perform(get("/api/event-properties"))
                .andExpect(status().isBadRequest())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof IllegalArgumentException))
                .andExpect(result -> assertEquals(
                        "No tienes permisos para ver estos datos. https://blog.scrt.ch/wp-content/uploads/2015/03/jurassicpark_magicword1.png",
                        result.getResolvedException().getMessage()));
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testUpdateService_asAdmin_success() throws Exception {
        EventProperties existing = new EventProperties();
        existing.setId(1);
        existing.setStartTime(LocalDateTime.of(2025, 5, 1, 10, 0));
        existing.setEndTime(LocalDateTime.of(2025, 5, 1, 14, 0));
        existing.setStatus(EventProperties.Status.PENDING);
        existing.setPricePerService(BigDecimal.valueOf(100));

        EventProperties updated = new EventProperties();
        updated.setStartTime(LocalDateTime.of(2025, 5, 2, 10, 0));
        updated.setEndTime(LocalDateTime.of(2025, 5, 2, 15, 0));
        updated.setStatus(EventProperties.Status.APPROVED);
        updated.setPricePerService(BigDecimal.valueOf(100));

        Event mockEvent = new Event();

        EventPropertiesDTO mockDTO = org.mockito.Mockito.mock(EventPropertiesDTO.class);

        when(eventPropertiesService.findByIdOptional(1)).thenReturn(Optional.of(existing));
        when(eventPropertiesRepository.findEventByEventPropertiesId(1)).thenReturn(mockEvent);
        when(eventPropertiesService.updateEventProperties(any(EventProperties.class), eq(1))).thenReturn(updated);
        when(eventPropertiesMapper.toDTO(any(EventProperties.class), any(Event.class))).thenReturn(mockDTO);

        mockMvc.perform(put("/api/event-properties/admin/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "student", authorities = {"STUDENT"})
    void testUpdateService_asStudent_returnsUnauthorized() throws Exception {
        EventProperties updated = new EventProperties();
        updated.setStartTime(LocalDateTime.of(2025, 5, 2, 10, 0));
        updated.setEndTime(LocalDateTime.of(2025, 5, 2, 15, 0));
        updated.setStatus(EventProperties.Status.APPROVED);
        updated.setPricePerService(BigDecimal.valueOf(100));

        mockMvc.perform(put("/api/event-properties/admin/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "proveedor", authorities = {"SUPPLIER"})
    void testFindByIdProvider_notOwnerOfVenue_returnsError() throws Exception {
        // Usuario autenticado
        User currentUser = new User();
        currentUser.setId(1);
        currentUser.setUsername("proveedor");

        // Mocks para los DTOs
        UserDTO venueOwnerDTO = mock(UserDTO.class);
        when(venueOwnerDTO.getId()).thenReturn(999); // Propietario distinto

        VenueDTO venueDTO = mock(VenueDTO.class);
        when(venueDTO.getUserDTO()).thenReturn(venueOwnerDTO);

        EventDTO eventDTO = mock(EventDTO.class);
        when(eventDTO.getId()).thenReturn(1); // No debe ser null

        EventPropertiesDTO eventPropertiesDTO = mock(EventPropertiesDTO.class);
        when(eventPropertiesDTO.getEventDTO()).thenReturn(eventDTO);
        when(eventPropertiesDTO.getVenueDTO()).thenReturn(venueDTO);
        when(eventPropertiesDTO.getOtherServiceDTO()).thenReturn(null); // Solo Venue

        // Servicios mockeados
        when(userService.getUserByUsername("proveedor")).thenReturn(Optional.of(currentUser));
        when(eventPropertiesService.findByIdDTO(1)).thenReturn(eventPropertiesDTO);
        when(eventService.findById(1)).thenReturn(new Event());

        mockMvc.perform(get("/api/event-properties/provider/1"))
                .andExpect(status().isBadRequest())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof IllegalArgumentException))
                .andExpect(result -> assertEquals("El recinto no te pertenece", result.getResolvedException().getMessage()));
    }

    @Test
    @WithMockUser(username = "proveedor", authorities = {"SUPPLIER"})
    void testFindByIdProvider_isOwner_returnsDTO() throws Exception {
        User currentUser = new User();
        currentUser.setId(1);
        currentUser.setUsername("proveedor");

        UserDTO ownerDTO = mock(UserDTO.class);
        when(ownerDTO.getId()).thenReturn(1);

        OtherServiceDTO otherServiceDTO = mock(OtherServiceDTO.class);
        when(otherServiceDTO.getUserDTO()).thenReturn(ownerDTO);

        EventDTO eventDTO = mock(EventDTO.class);
        when(eventDTO.getId()).thenReturn(1);

        EventPropertiesDTO eventPropertiesDTO = mock(EventPropertiesDTO.class);
        when(eventPropertiesDTO.getEventDTO()).thenReturn(eventDTO);
        when(eventPropertiesDTO.getOtherServiceDTO()).thenReturn(otherServiceDTO);
        when(eventPropertiesDTO.getVenueDTO()).thenReturn(null);

        when(userService.getUserByUsername("proveedor")).thenReturn(Optional.of(currentUser));
        when(eventPropertiesService.findByIdDTO(1)).thenReturn(eventPropertiesDTO);
        when(eventService.findById(1)).thenReturn(new Event());

        mockMvc.perform(get("/api/event-properties/provider/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "cliente", authorities = {"CLIENT"})
    void testAddOtherServiceToEvent_serviceUnavailable_returnsBadRequest() throws Exception {
        User user = new User();
        user.setId(1);
        user.setUsername("cliente");

        Event event = new Event();
        event.setId(1);
        event.setUser(user);

        OtherService service = new OtherService();
        service.setId(10);
        service.setAvailable(false);

        when(userService.getUserByUsername("cliente")).thenReturn(Optional.of(user));
        when(eventService.findById(1)).thenReturn(event);
        when(otherServiceService.getAllOtherServices()).thenReturn(List.of(service));

        mockMvc.perform(put("/api/event-properties/1/add-otherservice/10")
                        .param("startDate", "2025-04-10 12:00:00")
                        .param("endDate", "2025-04-10 15:00:00"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("No puedes deshabilitar servicios asociados a eventos"));
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testCancelEventPropertie_withVenue_success() throws Exception {
        Venue venue = new Venue();
        venue.setId(10);

        EventProperties eventProp = new EventProperties();
        eventProp.setId(1);
        eventProp.setStartTime(LocalDateTime.of(2025, 4, 20, 12, 0));
        eventProp.setVenue(venue);
        eventProp.setOtherService(null);

        when(eventPropertiesService.findById(1)).thenReturn(eventProp);

        mockMvc.perform(put("/api/event-properties/cancel/1"))
                .andExpect(status().isOk());

        verify(eventPropertiesService).getEventsPropsToCancelVenue(
                eq(eventProp.getStartTime().toLocalDate()),
                eq(venue.getId()),
                eq(eventProp.getId())
        );
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testCancelEventPropertie_withOtherService_success() throws Exception {
        OtherService otherService = new OtherService();
        otherService.setId(20);

        EventProperties eventProp = new EventProperties();
        eventProp.setId(2);
        eventProp.setStartTime(LocalDateTime.of(2025, 4, 21, 10, 0));
        eventProp.setVenue(null);
        eventProp.setOtherService(otherService);

        when(eventPropertiesService.findById(2)).thenReturn(eventProp);

        mockMvc.perform(put("/api/event-properties/cancel/2"))
                .andExpect(status().isOk());

        verify(eventPropertiesService).getEventsPropsToCancelOtherService(
                eq(eventProp.getStartTime().toLocalDate()),
                eq(otherService.getId()),
                eq(eventProp.getId())
        );
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testCancelEventPropertie_nullStartTime_returns500() throws Exception {
        EventProperties eventProp = new EventProperties();
        eventProp.setId(3);
        eventProp.setStartTime(null);
        eventProp.setVenue(new Venue());

        when(eventPropertiesService.findById(3)).thenReturn(eventProp);

        mockMvc.perform(put("/api/event-properties/cancel/3"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @WithMockUser(username = "proveedor", authorities = {"SUPPLIER"})
    void testRejectService_supplierWithOtherService_success() throws Exception {
        User user = new User();
        user.setId(1);
        user.setUsername("proveedor");

        OtherService service = new OtherService();
        service.setId(10);
        service.setUser(user);

        EventProperties ep = new EventProperties();
        ep.setId(1);
        ep.setOtherService(service);

        when(userService.getUserByUsername("proveedor")).thenReturn(Optional.of(user));
        when(eventPropertiesService.findById(1)).thenReturn(ep);
        when(eventPropertiesService.save(any())).thenReturn(ep);

        mockMvc.perform(delete("/api/event-properties/1"))
                .andExpect(status().isOk());

        verify(eventPropertiesService).deleteEventProperties(eq(1), isNull(), eq(service));
    }

    @Test
    @WithMockUser(username = "cliente", authorities = {"CLIENT"})
    void testClientCancelEventProperty_notFound_returns404() throws Exception {
        when(eventPropertiesService.findById(999)).thenReturn(null);

        mockMvc.perform(delete("/api/event-properties/client/999"))
                .andExpect(status().isNotFound());
    }

}