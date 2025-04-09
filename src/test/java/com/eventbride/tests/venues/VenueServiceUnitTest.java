package com.eventbride.tests.venues;

import com.eventbride.event_properties.EventPropertiesRepository;
import com.eventbride.otherService.OtherService;
import com.eventbride.otherService.OtherServiceRepository;
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
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VenueServiceUnitTest {

    @Mock
    private VenueRepository venueRepository;

    @Mock
    private EventPropertiesRepository eventPropertiesRepository;

    @Mock
    private OtherServiceRepository otherServiceRepository;

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
    void save_ShouldSaveVenue_WhenUserHasAvailableSlot() {
        User user = new User();
        user.setId(1);
        user.setPlan(User.Plan.BASIC);

        Venue newVenue = new Venue();
        newVenue.setAvailable(true);
        newVenue.setUser(user);

        when(userService.getUserById(user.getId())).thenReturn(Optional.of(user));
        when(otherServiceRepository.findByUserId(user.getId())).thenReturn(List.of());
        when(venueRepository.findByUserId(user.getId())).thenReturn(List.of());

        when(venueRepository.save(any(Venue.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Venue savedVenue = venueService.save(newVenue);

        assertNotNull(savedVenue);
        assertEquals(user, savedVenue.getUser());
    }

    @Test
    void save_ShouldThrowException_WhenBasicUserExceedsLimit() {
        User user = new User();
        user.setId(1);
        user.setPlan(User.Plan.BASIC);

        Venue venue = new Venue();
        venue.setAvailable(true);
        venue.setUser(user);

        Venue existingVenue1 = new Venue(); existingVenue1.setAvailable(true);
        Venue existingVenue2 = new Venue(); existingVenue2.setAvailable(true);
        OtherService otherService = new OtherService(); otherService.setAvailable(true);

        when(userService.getUserById(user.getId())).thenReturn(Optional.of(user));
        when(venueRepository.findByUserId(user.getId())).thenReturn(List.of(existingVenue1, existingVenue2));
        when(otherServiceRepository.findByUserId(user.getId())).thenReturn(List.of(otherService));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> venueService.save(venue));
        assertEquals("Has alcanzado el límite de venues en el plan BASIC.", exception.getMessage());
    }

    @Test
    void save_ShouldThrowException_WhenUserNotFound() {
        User user = new User();
        user.setId(999);

        Venue venue = new Venue();
        venue.setAvailable(true);
        venue.setUser(user);

        when(userService.getUserById(user.getId())).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> venueService.save(venue));
        assertEquals("Usuario no encontrado", exception.getMessage());
    }

    @Test
    void update_ShouldUpdateVenueSuccessfully_WhenVenueExistsAndUserIsValid() {
        int venueId = 1;
        User user = new User();
        user.setId(100);
        
        Venue existingVenue = new Venue();
        existingVenue.setId(venueId);
        existingVenue.setName("Old Name");
        existingVenue.setUser(user);
        
        Venue updatedVenue = new Venue();
        updatedVenue.setName("Updated Name");
        updatedVenue.setDescription("Updated Description");
        updatedVenue.setUser(user);

        when(venueRepository.findById(venueId)).thenReturn(Optional.of(existingVenue));
        when(userService.getUserById(user.getId())).thenReturn(Optional.of(user));
        when(venueRepository.save(any(Venue.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Venue result = venueService.update(venueId, updatedVenue);

        assertNotNull(result);
        assertEquals("Updated Name", result.getName());
        assertEquals("Updated Description", result.getDescription());
        assertEquals(user, result.getUser());
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
        int userId = 100;

        User user = new User();
        user.setId(userId);

        Venue existingVenue = new Venue();
        existingVenue.setId(venueId);
        existingVenue.setUser(user);

        Venue updatedVenue = new Venue();
        updatedVenue.setAddress("Updated Address");
        updatedVenue.setUser(user);

        when(venueRepository.findById(venueId)).thenReturn(Optional.of(existingVenue));
        when(userService.getUserById(userId)).thenReturn(Optional.of(user));
        when(venueRepository.save(any(Venue.class))).thenThrow(new RuntimeException("Database failure"));

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
            venueService.update(venueId, updatedVenue)
        );

        assertEquals("Database failure", exception.getMessage());
    }

    @Test
    void update_ShouldUpdateAllFields_WhenVenueExists() {
        int venueId = 1;
        int userId = 100;

        User user = new User();
        user.setId(userId);

        Venue existingVenue = new Venue();
        existingVenue.setId(venueId);
        existingVenue.setName("Old Venue");
        existingVenue.setUser(user);

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
        updatedVenue.setUser(user);

        when(venueRepository.findById(venueId)).thenReturn(Optional.of(existingVenue));
        when(userService.getUserById(userId)).thenReturn(Optional.of(user));
        when(venueRepository.save(any(Venue.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Venue result = venueService.update(venueId, updatedVenue);

        assertNotNull(result);
        assertEquals("Updated Venue", result.getName());
        assertEquals("Sevilla", result.getCityAvailable());
        assertEquals(BigDecimal.valueOf(10.50), result.getServicePricePerGuest());
        assertEquals(BigDecimal.valueOf(20.75), result.getServicePricePerHour());
        assertEquals(BigDecimal.valueOf(100.00), result.getFixedPrice());
        assertEquals("venue.jpg", result.getPicture());
        assertEquals("New description", result.getDescription());
        assertFalse(result.getLimitedByPricePerGuest());
        assertTrue(result.getLimitedByPricePerHour());
        assertEquals("Calle Nueva, 123", result.getAddress());
        assertEquals("41001", result.getPostalCode());
        assertEquals("37.3826,-5.9963", result.getCoordinates());
        assertEquals(100, result.getMaxGuests());
        assertEquals(200.0, result.getSurface());
        assertEquals(LocalTime.of(9, 0), result.getEarliestTime());
        assertEquals(LocalTime.of(22, 0), result.getLatestTime());
        assertEquals(user, result.getUser());
    }

    @Test
    void updateVenue_ShouldThrowException_WhenSaveFails() {
        int venueId = 1;
        int userId = 100;

        User user = new User();
        user.setId(userId);

        Venue existingVenue = new Venue();
        existingVenue.setId(venueId);
        existingVenue.setUser(user);

        Venue updatedVenue = new Venue();
        updatedVenue.setName("Fallido");
        updatedVenue.setUser(user);

        when(venueRepository.findById(venueId)).thenReturn(Optional.of(existingVenue));
        when(userService.getUserById(userId)).thenReturn(Optional.of(user));
        when(venueRepository.save(any(Venue.class)))
            .thenThrow(new RuntimeException("Error al guardar en base de datos"));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> venueService.update(venueId, updatedVenue));

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