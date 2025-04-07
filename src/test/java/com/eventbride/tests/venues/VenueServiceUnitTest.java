package com.eventbride.tests.venues;

import com.eventbride.dto.OtherServiceDTO;
import com.eventbride.dto.ServiceDTO;
import com.eventbride.dto.VenueDTO;
import com.eventbride.event_properties.EventPropertiesRepository;
import com.eventbride.otherService.OtherService;
import com.eventbride.service.ServiceService;
import com.eventbride.user.User;
import com.eventbride.user.UserService;
import com.eventbride.venue.Venue;
import com.eventbride.venue.VenueRepository;
import com.eventbride.venue.VenueService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VenueServiceUnitTest {

    @Mock
    private VenueRepository venueRepository;

    @Mock
    private EventPropertiesRepository eventPropertiesRepository;

    @InjectMocks
    private VenueService venueService;

    @Mock
    private UserService userService;

    @Mock
    private ServiceService serviceService;

    @Test
    void getAllVenues_ShouldReturnVenuesOrderedByUserPlan() {
        User premiumUser = new User();
        premiumUser.setPlan(User.Plan.PREMIUM);

        User basicUser = new User();
        basicUser.setPlan(User.Plan.BASIC);

        Venue venue1 = new Venue();
        venue1.setUser(basicUser);

        Venue venue2 = new Venue();
        venue2.setUser(premiumUser);

        List<Venue> venues = List.of(venue1, venue2);
        when(venueRepository.findAll()).thenReturn(venues);

        List<Venue> result = venueService.getAllVenues();

        assertEquals(2, result.size());
        assertEquals(premiumUser, result.get(0).getUser());
        assertEquals(basicUser, result.get(1).getUser());
    }

    @Test
    void getAllVenues_ShouldThrowException_WhenVenueUserIsNull() {
        Venue venueWithNullUser = new Venue();
        venueWithNullUser.setUser(null);

        Venue venueWithUser = new Venue();
        User user = new User();
        user.setPlan(User.Plan.BASIC);
        venueWithUser.setUser(user);

        when(venueRepository.findAll()).thenReturn(List.of(venueWithNullUser, venueWithUser));

        assertThrows(NullPointerException.class, () -> venueService.getAllVenues());
    }

    @Test
    void getAllVenues_ShouldThrowException_WhenRepositoryFails() {
        when(venueRepository.findAll()).thenThrow(new RuntimeException("Database connection error"));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> venueService.getAllVenues());
        assertEquals("Database connection error", exception.getMessage());
    }

    @Test
    void getVenueById_ShouldReturnVenue_WhenIdExists() {
        int venueId = 1;
        Venue venue = new Venue();
        venue.setId(venueId);

        when(venueRepository.findById(venueId)).thenReturn(Optional.of(venue));

        Optional<Venue> result = venueService.getVenueById(venueId);

        assertTrue(result.isPresent());
        assertEquals(venueId, result.get().getId());
    }

    @Test
    void getVenueById_ShouldReturnEmpty_WhenIdDoesNotExist() {
        int nonExistentId = 999;
        when(venueRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        Optional<Venue> result = venueService.getVenueById(nonExistentId);

        assertFalse(result.isPresent());
    }

    @Test
    void getVenueById_ShouldThrowException_WhenRepositoryFails() {
        int venueId = 1;
        when(venueRepository.findById(venueId)).thenThrow(new RuntimeException("Database error"));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> venueService.getVenueById(venueId));
        assertEquals("Database error", exception.getMessage());
    }

    @Test
    void getVenuesByUserId_ShouldReturnVenues_WhenUserIdExists() {
        int userId = 1;
        Venue venue1 = new Venue();
        venue1.setId(101);
        Venue venue2 = new Venue();
        venue2.setId(102);

        when(venueRepository.findByUserId(userId)).thenReturn(List.of(venue1, venue2));

        List<Venue> result = venueService.getVenuesByUserId(userId);

        assertEquals(2, result.size());
        assertTrue(result.contains(venue1));
        assertTrue(result.contains(venue2));
    }

    @Test
    void getVenuesByUserId_ShouldReturnEmptyList_WhenUserIdHasNoVenues() {
        int userId = 99;
        when(venueRepository.findByUserId(userId)).thenReturn(List.of());

        List<Venue> result = venueService.getVenuesByUserId(userId);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void getVenuesByUserId_ShouldThrowException_WhenRepositoryFails() {
        int userId = 1;
        when(venueRepository.findByUserId(userId)).thenThrow(new RuntimeException("Database failure"));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> venueService.getVenuesByUserId(userId));
        assertEquals("Database failure", exception.getMessage());
    }

    @Test
    void getFilteredVenues_ShouldReturnFilteredAndSortedVenues_WhenValidInput() {
        String city = "Sevilla";
        Integer maxGuests = 100;
        Double surface = 50.0;

        User premiumUser = new User();
        premiumUser.setPlan(User.Plan.PREMIUM);

        User basicUser = new User();
        basicUser.setPlan(User.Plan.BASIC);

        Venue venue1 = new Venue();
        venue1.setUser(basicUser);

        Venue venue2 = new Venue();
        venue2.setUser(premiumUser);

        when(venueRepository.findByFilters(city, maxGuests, surface)).thenReturn(List.of(venue1, venue2));

        List<Venue> result = venueService.getFilteredVenues(city, maxGuests, surface);

        assertEquals(2, result.size());
        assertEquals(premiumUser, result.get(0).getUser());
        assertEquals(basicUser, result.get(1).getUser());
    }

    @Test
    void getFilteredVenues_ShouldThrowException_WhenVenueHasNullUser() {
        String city = "Cádiz";
        Integer maxGuests = 50;
        Double surface = 20.0;

        Venue venueWithUser = new Venue();
        User user = new User();
        user.setPlan(User.Plan.BASIC);
        venueWithUser.setUser(user);

        Venue venueWithNullUser = new Venue();
        venueWithNullUser.setUser(null);

        when(venueRepository.findByFilters(city, maxGuests, surface))
            .thenReturn(List.of(venueWithNullUser, venueWithUser));

        assertThrows(NullPointerException.class, () -> venueService.getFilteredVenues(city, maxGuests, surface));
    }

    @Test
    void getFilteredVenues_ShouldThrowException_WhenRepositoryFails() {
        String city = "Granada";
        Integer maxGuests = 80;
        Double surface = 30.0;

        when(venueRepository.findByFilters(city, maxGuests, surface))
            .thenThrow(new RuntimeException("Query error"));

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
            venueService.getFilteredVenues(city, maxGuests, surface)
        );
        assertEquals("Query error", exception.getMessage());
    }

    @Test
    void save_ShouldSaveVenue_WhenUserExistsAndSlotLimitNotExceeded() {
        User user = new User();
        user.setId(1);
        user.setPlan(User.Plan.BASIC);

        Venue venue = new Venue();
        venue.setUser(user);

        OtherService os1 = mock(OtherService.class);
        Venue v1 = mock(Venue.class);
        ServiceDTO services = new ServiceDTO(List.of(os1), List.of(v1));

        when(userService.getUserById(1)).thenReturn(Optional.of(user));
        when(serviceService.getAllServiceByUserId(1)).thenReturn(services);
        when(venueRepository.save(venue)).thenReturn(venue);

        Venue result = venueService.save(venue);

        assertNotNull(result);
        assertEquals(user, result.getUser());
    }

    @Test
    void save_ShouldThrowException_WhenUserDoesNotExist() {
        int nonExistentUserId = 999;
        User user = new User();
        user.setId(nonExistentUserId);

        Venue venue = new Venue();
        venue.setUser(user);

        when(userService.getUserById(nonExistentUserId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> venueService.save(venue));
        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void save_ShouldThrowException_WhenPremiumUserExceedsServiceLimit() {
        int userId = 2;
        User user = new User();
        user.setId(userId);
        user.setPlan(User.Plan.PREMIUM);

        Venue venue = new Venue();
        venue.setUser(user);

        List<OtherService> otherServices = new ArrayList<>();
        List<Venue> venues = new ArrayList<>();

        for (int i = 0; i < 5; i++) {
            otherServices.add(mock(OtherService.class));
            venues.add(mock(Venue.class));
        }

        ServiceDTO services = new ServiceDTO(otherServices, venues);

        when(userService.getUserById(userId)).thenReturn(Optional.of(user));
        when(serviceService.getAllServiceByUserId(userId)).thenReturn(services);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> venueService.save(venue));
        assertEquals("Has alcanzado el límite de venues en el plan PREMIUM.", exception.getMessage());
    }

    @Test
    void update_ShouldUpdateVenue_WhenVenueExists() {
        int venueId = 1;

        Venue existingVenue = new Venue();
        existingVenue.setId(venueId);
        existingVenue.setAddress("Old Address");

        Venue updatedVenue = new Venue();
        updatedVenue.setAddress("New Address");
        updatedVenue.setPostalCode("41001");
        updatedVenue.setMaxGuests(150);

        when(venueRepository.findById(venueId)).thenReturn(Optional.of(existingVenue));
        when(venueRepository.save(any(Venue.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Venue result = venueService.update(venueId, updatedVenue);

        assertNotNull(result);
        assertEquals("New Address", result.getAddress());
        assertEquals("41001", result.getPostalCode());
        assertEquals(150, result.getMaxGuests());
    }

    @Test
    void update_ShouldThrowException_WhenVenueDoesNotExist() {
        int venueId = 999;
        Venue updatedVenue = new Venue();

        when(venueRepository.findById(venueId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
            venueService.update(venueId, updatedVenue)
        );

        assertEquals("Venue not found", exception.getMessage());
    }

    @Test
    void update_ShouldThrowException_WhenRepositoryFailsToSave() {
        int venueId = 1;

        Venue existingVenue = new Venue();
        existingVenue.setId(venueId);

        Venue updatedVenue = new Venue();
        updatedVenue.setAddress("Updated Address");

        when(venueRepository.findById(venueId)).thenReturn(Optional.of(existingVenue));
        when(venueRepository.save(any(Venue.class)))
            .thenThrow(new RuntimeException("Database failure"));

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
            venueService.update(venueId, updatedVenue)
        );

        assertEquals("Database failure", exception.getMessage());
    }

    @Test
    void updateVenue_ShouldUpdateAllFields_WhenVenueExists() {
        int venueId = 1;

        Venue existingVenue = new Venue();
        existingVenue.setId(venueId);
        existingVenue.setName("Old Venue");

        Venue updatedVenue = new Venue();
        updatedVenue.setName("Updated Venue");
        updatedVenue.setAvailable(true);
        updatedVenue.setCityAvailable("Sevilla");
        updatedVenue.setServicePricePerGuest(BigDecimal.valueOf(10.50));
        updatedVenue.setServicePricePerHour(BigDecimal.valueOf(20.75));
        updatedVenue.setFixedPrice(BigDecimal.valueOf(100.00));
        updatedVenue.setPicture("venue.jpg");
        updatedVenue.setDescription("New description");
        updatedVenue.setLimitedByPricePerGuest(false);
        updatedVenue.setLimitedByPricePerHour(true);

        updatedVenue.setAddress("Calle Nueva, 123");
        updatedVenue.setPostalCode("41001");
        updatedVenue.setCoordinates("37.3826,-5.9963");
        updatedVenue.setMaxGuests(100);
        updatedVenue.setSurface(200.0);
        updatedVenue.setEarliestTime(LocalTime.of(9, 0));
        updatedVenue.setLatestTime(LocalTime.of(22, 0));

        when(venueRepository.findById(venueId)).thenReturn(Optional.of(existingVenue));
        when(venueRepository.save(any(Venue.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Venue result = venueService.updateVenue(venueId, updatedVenue);

        assertNotNull(result);
        assertEquals("Updated Venue", result.getName());
        assertEquals("Sevilla", result.getCityAvailable());
        assertEquals(BigDecimal.valueOf(10.50), result.getServicePricePerGuest());
        assertEquals("Calle Nueva, 123", result.getAddress());
        assertEquals(200.0, result.getSurface());
        assertEquals(LocalTime.of(9, 0), result.getEarliestTime());
    }

    @Test
    void updateVenue_ShouldThrowException_WhenVenueDoesNotExist() {
        int venueId = 999;
        Venue updatedVenue = new Venue();

        when(venueRepository.findById(venueId)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> venueService.updateVenue(venueId, updatedVenue));
        assertEquals("No se ha encontrado ningun Venue con esa Id", ex.getMessage());
    }

    @Test
    void updateVenue_ShouldThrowException_WhenSaveFails() {
        int venueId = 1;

        Venue existingVenue = new Venue();
        existingVenue.setId(venueId);

        Venue updatedVenue = new Venue();
        updatedVenue.setName("Fallido");

        when(venueRepository.findById(venueId)).thenReturn(Optional.of(existingVenue));
        when(venueRepository.save(any(Venue.class)))
            .thenThrow(new RuntimeException("Error al guardar en base de datos"));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> venueService.updateVenue(venueId, updatedVenue));
        assertEquals("Error al guardar en base de datos", ex.getMessage());
    }

    @Test
    void deleteVenue_ShouldDeleteVenueAndEventProperties_WhenVenueExists() {
        int venueId = 1;
        Venue venue = new Venue();
        venue.setId(venueId);

        when(venueRepository.findById(venueId)).thenReturn(Optional.of(venue));

        venueService.deleteVenue(venueId);

        verify(eventPropertiesRepository).deleteByVenue(venue);
        verify(venueRepository).deleteById(venueId);
    }

    @Test
    void deleteVenue_ShouldThrowException_WhenVenueNotFound() {
        int venueId = 999;
        when(venueRepository.findById(venueId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
            venueService.deleteVenue(venueId)
        );
        assertEquals("Venue not found", exception.getMessage());

        verify(eventPropertiesRepository, never()).deleteByVenue(any());
        verify(venueRepository, never()).deleteById(anyInt());
    }

    @Test
    void deleteVenue_ShouldThrowException_WhenEventPropertiesDeletionFails() {
        int venueId = 2;
        Venue venue = new Venue();
        venue.setId(venueId);

        when(venueRepository.findById(venueId)).thenReturn(Optional.of(venue));
        doThrow(new RuntimeException("Error al eliminar propiedades"))
            .when(eventPropertiesRepository).deleteByVenue(venue);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> venueService.deleteVenue(venueId));
        assertEquals("Error al eliminar propiedades", ex.getMessage());

        verify(venueRepository, never()).deleteById(anyInt());
    }
}
