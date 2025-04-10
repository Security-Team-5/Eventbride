package com.eventbride.tests.otherServices;

import com.eventbride.dto.OtherServiceDTO;
import com.eventbride.dto.ServiceDTO;
import com.eventbride.dto.VenueDTO;
import com.eventbride.event_properties.EventPropertiesRepository;
import com.eventbride.otherService.OtherService;
import com.eventbride.otherService.OtherService.OtherServiceType;
import com.eventbride.otherService.OtherServiceRepository;
import com.eventbride.otherService.OtherServiceService;
import com.eventbride.service.ServiceService;
import com.eventbride.user.User;
import com.eventbride.user.User.Plan;
import com.eventbride.user.UserService;
import com.eventbride.venue.Venue;
import com.eventbride.venue.VenueRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.EmptyResultDataAccessException;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class OtherServiceServiceTest {

    @Mock
    private OtherServiceRepository otherServiceRepo;

    @Mock
    private UserService userService;

    @Mock
    private ServiceService serviceService;

    @Mock
    private EventPropertiesRepository eventPropertiesRepository;

    @Mock
    private VenueRepository venueRepository;

    @InjectMocks
    private OtherServiceService otherServiceService;

    private User premiumUser;
    private User basicUser;
    private User nullUser;

    private OtherService service1;
    private OtherService service2;
    private OtherService service3;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        premiumUser = new User();
        premiumUser.setPlan(Plan.PREMIUM);

        basicUser = new User();
        basicUser.setPlan(Plan.BASIC);

        nullUser = new User();
        nullUser.setPlan(null);

        service1 = new OtherService();
        service1.setUser(basicUser);

        service2 = new OtherService();
        service2.setUser(premiumUser);

        service3 = new OtherService();
        service3.setUser(null);
    }

    @Test
    void testGetAllOtherServices_PremiumFirst() {
        List<OtherService> services = List.of(service1, service2, service3);
        when(otherServiceRepo.findAll()).thenReturn(services);

        List<OtherService> result = otherServiceService.getAllOtherServices();

        assertEquals(3, result.size());
        assertEquals(service2, result.get(0));
        assertTrue(result.contains(service1));
        assertTrue(result.contains(service3));
    }

    @Test
    void testGetAllOtherServices_AllNullUsers() {
        OtherService nullUserService1 = new OtherService();
        nullUserService1.setUser(null);

        OtherService nullUserService2 = new OtherService();
        User userWithNullPlan = new User();
        userWithNullPlan.setPlan(null);
        nullUserService2.setUser(userWithNullPlan);

        List<OtherService> services = List.of(nullUserService1, nullUserService2);
        when(otherServiceRepo.findAll()).thenReturn(services);

        List<OtherService> result = otherServiceService.getAllOtherServices();

        assertEquals(2, result.size());
        assertTrue(result.contains(nullUserService1));
        assertTrue(result.contains(nullUserService2));
    }

    @Test
    void testGetAllOtherServices_EmptyList() {
        when(otherServiceRepo.findAll()).thenReturn(Collections.emptyList());

        List<OtherService> result = otherServiceService.getAllOtherServices();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetOtherServiceById_Found() {
        int serviceId = 1;
        service1.setId(serviceId);
        when(otherServiceRepo.findById(serviceId)).thenReturn(Optional.of(service1));

        Optional<OtherService> result = otherServiceService.getOtherServiceById(serviceId);

        assertTrue(result.isPresent());
        assertEquals(service1, result.get());
    }

    @Test
    void testGetOtherServiceById_NotFound() {
        int nonexistentId = 999;
        when(otherServiceRepo.findById(nonexistentId)).thenReturn(Optional.empty());

        Optional<OtherService> result = otherServiceService.getOtherServiceById(nonexistentId);

        assertFalse(result.isPresent());
    }

    @Test
    void testGetOtherServiceById_NullId_ReturnsEmpty() {
        when(otherServiceRepo.findById(null)).thenReturn(Optional.empty());

        Optional<OtherService> result = otherServiceService.getOtherServiceById(null);

        assertFalse(result.isPresent());
    }

    @Test
    void testGetOtherServiceByServiceName_Found() {
        String name = "Fotografía";
        service1.setName(name);
        when(otherServiceRepo.findByName(name)).thenReturn(Optional.of(service1));

        Optional<OtherService> result = otherServiceService.getOtherServiceByServiceName(name);

        assertTrue(result.isPresent());
        assertEquals(service1, result.get());
    }

    @Test
    void testGetOtherServiceByServiceName_NotFound() {
        String nonexistentName = "Catering";
        when(otherServiceRepo.findByName(nonexistentName)).thenReturn(Optional.empty());

        Optional<OtherService> result = otherServiceService.getOtherServiceByServiceName(nonexistentName);

        assertFalse(result.isPresent());
    }

    @Test
    void testGetOtherServiceByServiceName_NullName() {
        when(otherServiceRepo.findByName(null)).thenReturn(Optional.empty());

        Optional<OtherService> result = otherServiceService.getOtherServiceByServiceName(null);

        assertFalse(result.isPresent());
    }

    @Test
    void testGetOtherServiceByUserId_Found() {
        int userId = 1;
        basicUser.setId(userId);
        service1.setUser(basicUser);
        List<OtherService> expectedServices = List.of(service1);

        when(otherServiceRepo.findByUserId(userId)).thenReturn(expectedServices);

        List<OtherService> result = otherServiceService.getOtherServiceByUserId(userId);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(service1, result.get(0));
    }

    @Test
    void testGetOtherServiceByUserId_NotFound() {
        int nonexistentUserId = 999;
        when(otherServiceRepo.findByUserId(nonexistentUserId)).thenReturn(Collections.emptyList());

        List<OtherService> result = otherServiceService.getOtherServiceByUserId(nonexistentUserId);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetOtherServiceByUserId_NullId() {
        when(otherServiceRepo.findByUserId(null)).thenReturn(Collections.emptyList());

        List<OtherService> result = otherServiceService.getOtherServiceByUserId(null);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetOtherServiceByAvailableCity_Found() {
        String city = "Sevilla";
        service1.setCityAvailable(city);
        service2.setCityAvailable(city);
        List<OtherService> expectedServices = List.of(service1, service2);

        when(otherServiceRepo.findByCityAvailable(city)).thenReturn(expectedServices);

        List<OtherService> result = otherServiceService.getOtherServiceByAvailableCity(city);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.contains(service1));
        assertTrue(result.contains(service2));
    }

    @Test
    void testGetOtherServiceByAvailableCity_NotFound() {
        String nonexistentCity = "Tokio";
        when(otherServiceRepo.findByCityAvailable(nonexistentCity)).thenReturn(Collections.emptyList());

        List<OtherService> result = otherServiceService.getOtherServiceByAvailableCity(nonexistentCity);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetOtherServiceByAvailableCity_NullCity() {
        when(otherServiceRepo.findByCityAvailable(null)).thenReturn(Collections.emptyList());

        List<OtherService> result = otherServiceService.getOtherServiceByAvailableCity(null);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetOtherServiceByOtherServiceType_Found() {
        OtherServiceType type = OtherServiceType.CATERING;
        service1.setOtherServiceType(type);
        service2.setOtherServiceType(type);
        List<OtherService> expectedServices = List.of(service1, service2);

        when(otherServiceRepo.findByOtherServiceType(type)).thenReturn(expectedServices);

        List<OtherService> result = otherServiceService.getOtherServiceByOtherServiceType(type);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.contains(service1));
        assertTrue(result.contains(service2));
    }

    @Test
    void testGetOtherServiceByOtherServiceType_NotFound() {
        OtherServiceType nonexistentType = OtherServiceType.DECORATION;
        when(otherServiceRepo.findByOtherServiceType(nonexistentType)).thenReturn(Collections.emptyList());

        List<OtherService> result = otherServiceService.getOtherServiceByOtherServiceType(nonexistentType);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetOtherServiceByOtherServiceType_NullType() {
        when(otherServiceRepo.findByOtherServiceType(null)).thenReturn(Collections.emptyList());

        List<OtherService> result = otherServiceService.getOtherServiceByOtherServiceType(null);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetOtherServiceByAvailability_True() {
        service1.setAvailable(true);
        service2.setAvailable(true);
        List<OtherService> availableServices = List.of(service1, service2);

        when(otherServiceRepo.findByAvailable(true)).thenReturn(availableServices);

        List<OtherService> result = otherServiceService.getOtherServiceByAvailability(true);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.contains(service1));
        assertTrue(result.contains(service2));
    }

    @Test
    void testGetOtherServiceByAvailability_FalseButNoneFound() {
        when(otherServiceRepo.findByAvailable(false)).thenReturn(Collections.emptyList());

        List<OtherService> result = otherServiceService.getOtherServiceByAvailability(false);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetOtherServiceByAvailability_NullInput() {
        when(otherServiceRepo.findByAvailable(null)).thenReturn(Collections.emptyList());

        List<OtherService> result = otherServiceService.getOtherServiceByAvailability(null);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetFilteredOtherServices_ResultsFoundAndSorted() {
        String name = "Foto";
        String city = "Sevilla";
        OtherServiceType type = OtherServiceType.CATERING;

        service1.setName("Foto 1");
        service1.setCityAvailable("Sevilla");
        service1.setOtherServiceType(OtherServiceType.CATERING);
        service1.setUser(basicUser);

        service2.setName("Foto Premium");
        service2.setCityAvailable("Sevilla");
        service2.setOtherServiceType(OtherServiceType.CATERING);
        service2.setUser(premiumUser);

        List<OtherService> unordered = List.of(service1, service2);
        when(otherServiceRepo.findByFilters(name, city, type)).thenReturn(unordered);

        List<OtherService> result = otherServiceService.getFilteredOtherServices(name, city, type);

        assertEquals(2, result.size());
        assertEquals(service2, result.get(0));
        assertEquals(service1, result.get(1));
    }

    @Test
    void testGetFilteredOtherServices_NoMatches() {
        String name = "Inexistente";
        String city = "Tokio";
        OtherServiceType type = OtherServiceType.CATERING;

        when(otherServiceRepo.findByFilters(name, city, type)).thenReturn(Collections.emptyList());

        List<OtherService> result = otherServiceService.getFilteredOtherServices(name, city, type);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetFilteredOtherServices_NullValues() {
        when(otherServiceRepo.findByFilters(null, null, null)).thenReturn(Collections.emptyList());

        List<OtherService> result = otherServiceService.getFilteredOtherServices(null, null, null);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testCreateOtherService_SuccessfullyCreated() {
        premiumUser.setId(1);
        service1.setAvailable(true);
        service1.setUser(premiumUser);

        when(userService.getUserById(1)).thenReturn(Optional.of(premiumUser));
        when(otherServiceRepo.findByUserId(1)).thenReturn(List.of());
        when(venueRepository.findByUserId(1)).thenReturn(List.of());
        when(otherServiceRepo.save(service1)).thenReturn(service1);

        OtherService result = otherServiceService.createOtherService(service1);

        assertNotNull(result);
        assertEquals(service1, result);
    }

    @Test
    void testCreateOtherService_UserNotFound() {
        nullUser.setId(99);
        service3.setAvailable(true);
        service3.setUser(nullUser);

        when(userService.getUserById(99)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            otherServiceService.createOtherService(service3);
        });

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void testCreateOtherService_BasicPlanLimitExceeded() {
        basicUser.setId(2);
        service1.setAvailable(true);
        service1.setUser(basicUser);

        List<OtherService> existingServices = List.of(new OtherService(), new OtherService());
        List<Venue> existingVenues = List.of(new Venue());

        existingServices.forEach(s -> s.setAvailable(true));
        existingVenues.forEach(v -> v.setAvailable(true));

        when(userService.getUserById(2)).thenReturn(Optional.of(basicUser));
        when(otherServiceRepo.findByUserId(2)).thenReturn(existingServices);
        when(venueRepository.findByUserId(2)).thenReturn(existingVenues);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            otherServiceService.createOtherService(service1);
        });

        assertEquals("Has alcanzado el límite de servicios en el plan BASIC.", exception.getMessage());
    }

    @Test
    void testUpdateOtherService_Success() {
        premiumUser.setId(1);
        service1.setId(100);
        service1.setUser(premiumUser);

        OtherService updatedService = new OtherService();
        updatedService.setName("Nuevo nombre");
        updatedService.setAvailable(true);
        updatedService.setUser(premiumUser);

        when(otherServiceRepo.findById(100)).thenReturn(Optional.of(service1));
        when(userService.getUserById(1)).thenReturn(Optional.of(premiumUser));
        when(otherServiceRepo.save(any(OtherService.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OtherService result = otherServiceService.updateOtherService(100, updatedService);

        assertNotNull(result);
        assertEquals("Nuevo nombre", result.getName());
        assertEquals(premiumUser, result.getUser());
    }

    @Test
    void testUpdateOtherService_NotFound() {
        when(otherServiceRepo.findById(999)).thenReturn(Optional.empty());

        OtherService updateAttempt = new OtherService();
        updateAttempt.setUser(premiumUser);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            otherServiceService.updateOtherService(999, updateAttempt);
        });

        assertEquals("No se ha encontrado ningún servicio con esa Id", exception.getMessage());
    }

    @Test
    void testUpdateOtherService_NullUserId() {
        premiumUser.setId(null);
        service1.setId(101);
        service1.setUser(premiumUser);

        OtherService updateAttempt = new OtherService();
        updateAttempt.setUser(premiumUser);

        when(otherServiceRepo.findById(101)).thenReturn(Optional.of(service1));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            otherServiceService.updateOtherService(101, updateAttempt);
        });

        assertEquals("Falta el usuario al actualizar el servicio.", exception.getMessage());
    }

    @Test
    void testDeleteOtherService_Success() {
        service1.setId(1);
        when(otherServiceRepo.findById(1)).thenReturn(Optional.of(service1));

        assertDoesNotThrow(() -> otherServiceService.deleteOtherService(1));

        verify(eventPropertiesRepository, times(1)).deleteByOtherService(service1);
        verify(otherServiceRepo, times(1)).delete(service1);
    }

    @Test
    void testDeleteOtherService_NotFound() {
        when(otherServiceRepo.findById(99)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            otherServiceService.deleteOtherService(99);
        });

        assertEquals("OtherService not found", exception.getMessage());
        verify(eventPropertiesRepository, never()).deleteByOtherService(any());
        verify(otherServiceRepo, never()).delete(any());
    }

    @Test
    void testDeleteOtherService_NullId() {
        when(otherServiceRepo.findById(null)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            otherServiceService.deleteOtherService(null);
        });

        assertEquals("OtherService not found", exception.getMessage());
        verify(eventPropertiesRepository, never()).deleteByOtherService(any());
        verify(otherServiceRepo, never()).delete(any());
    }

    @Test
    void testDeleteUser_Success() {
        int serviceId = 1;
        doNothing().when(otherServiceRepo).deleteById(serviceId);

        assertDoesNotThrow(() -> otherServiceService.deleteUser(serviceId));

        verify(otherServiceRepo, times(1)).deleteById(serviceId);
    }

    @Test
    void testDeleteUser_NonexistentId() {
        int nonexistentId = 999;
        doThrow(new EmptyResultDataAccessException(1)).when(otherServiceRepo).deleteById(nonexistentId);

        assertThrows(EmptyResultDataAccessException.class, () -> {
            otherServiceService.deleteUser(nonexistentId);
        });

        verify(otherServiceRepo, times(1)).deleteById(nonexistentId);
    }

    @Test
    void testDeleteUser_NullId() {
        doThrow(new IllegalArgumentException("ID must not be null")).when(otherServiceRepo).deleteById(null);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            otherServiceService.deleteUser(null);
        });

        assertEquals("ID must not be null", exception.getMessage());
        verify(otherServiceRepo, times(1)).deleteById(null);
    }

    @Test
    void testSaveAll_Success() {
        List<OtherService> servicesToSave = List.of(service1, service2);

        when(otherServiceRepo.saveAll(servicesToSave)).thenReturn(servicesToSave);

        assertDoesNotThrow(() -> otherServiceService.saveAll(servicesToSave));

        verify(otherServiceRepo, times(1)).saveAll(servicesToSave);
    }

    @Test
    void testSaveAll_NullList() {
        doThrow(new IllegalArgumentException("List must not be null")).when(otherServiceRepo).saveAll(null);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            otherServiceService.saveAll(null);
        });

        assertEquals("List must not be null", exception.getMessage());
        verify(otherServiceRepo, times(1)).saveAll(null);
    }

    @Test
    void testSaveAll_EmptyList() {
        List<OtherService> emptyList = Collections.emptyList();
        when(otherServiceRepo.saveAll(emptyList)).thenReturn(emptyList);
    
        otherServiceService.saveAll(emptyList);
    
        verify(otherServiceRepo, times(1)).saveAll(emptyList);
    }

    @Test
    void testSave_OkForPremiumUser() {
        premiumUser.setId(1);
        service1.setAvailable(true);
        service1.setUser(premiumUser);

        when(userService.getUserById(1)).thenReturn(Optional.of(premiumUser));
        when(otherServiceRepo.findByUserId(1)).thenReturn(List.of());
        when(venueRepository.findByUserId(1)).thenReturn(List.of());
        when(otherServiceRepo.save(service1)).thenReturn(service1);

        OtherService result = otherServiceService.save(service1);

        assertNotNull(result);
        assertEquals(service1, result);
    }

    @Test
    void testSave_BasicPlanLimitExceeded() {
        basicUser.setId(2);
        service1.setAvailable(true);
        service1.setUser(basicUser);

        List<OtherService> otherServices = List.of(new OtherService(), new OtherService());
        List<Venue> venues = List.of(new Venue());

        otherServices.forEach(s -> s.setAvailable(true));
        venues.forEach(v -> v.setAvailable(true));

        when(userService.getUserById(2)).thenReturn(Optional.of(basicUser));
        when(otherServiceRepo.findByUserId(2)).thenReturn(otherServices);
        when(venueRepository.findByUserId(2)).thenReturn(venues);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            otherServiceService.save(service1);
        });

        assertEquals("Has alcanzado el límite de servicios en el plan BASIC.", exception.getMessage());
    }

    @Test
    void testSave_UserNotFound() {
        nullUser.setId(99);
        service3.setAvailable(true);
        service3.setUser(nullUser);

        when(userService.getUserById(99)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            otherServiceService.save(service3);
        });

        assertEquals("User not found", exception.getMessage());
    }
}
