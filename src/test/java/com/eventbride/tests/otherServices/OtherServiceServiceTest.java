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

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
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
    void shouldReturnServicesSortedWithPremiumFirst() {
        when(otherServiceRepo.findAll()).thenReturn(Arrays.asList(service1, service2, service3));

        List<OtherService> result = otherServiceService.getAllOtherServices();

        assertThat(result).containsExactly(service2, service1, service3);
    }

    @Test
    void shouldPlaceServicesWithNullUserAtEnd() {
        service1.setUser(null);
        when(otherServiceRepo.findAll()).thenReturn(Arrays.asList(service2, service1));

        List<OtherService> result = otherServiceService.getAllOtherServices();

        assertThat(result).containsExactly(service2, service1);
    }

    @Test
    void shouldReturnUnorderedWhenAllPlansAreNull() {
        User userA = new User(); userA.setPlan(null);
        User userB = new User(); userB.setPlan(null);

        OtherService os1 = new OtherService(); os1.setUser(userA);
        OtherService os2 = new OtherService(); os2.setUser(userB);

        when(otherServiceRepo.findAll()).thenReturn(Arrays.asList(os1, os2));

        List<OtherService> result = otherServiceService.getAllOtherServices();

        assertThat(result).containsExactly(os1, os2);
    }

    @Test
    void shouldReturnOtherServiceWhenIdExists() {
        OtherService expectedService = new OtherService();
        expectedService.setId(1);

        when(otherServiceRepo.findById(1)).thenReturn(Optional.of(expectedService));

        Optional<OtherService> result = otherServiceService.getOtherServiceById(1);

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(1);
    }

    @Test
    void shouldReturnEmptyWhenIdDoesNotExist() {
        when(otherServiceRepo.findById(999)).thenReturn(Optional.empty());

        Optional<OtherService> result = otherServiceService.getOtherServiceById(999);

        assertThat(result).isEmpty();
    }
    
    @Test
    void shouldThrowExceptionWhenRepositoryFails() {
        when(otherServiceRepo.findById(1)).thenThrow(new RuntimeException("Database error"));

        assertThatThrownBy(() -> otherServiceService.getOtherServiceById(1))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Database error");
    }

    @Test
    void shouldReturnOtherServiceWhenNameExists() {
        OtherService expectedService = new OtherService();
        expectedService.setName("Catering Plus");

        when(otherServiceRepo.findByName("Catering Plus")).thenReturn(Optional.of(expectedService));

        Optional<OtherService> result = otherServiceService.getOtherServiceByServiceName("Catering Plus");

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Catering Plus");
    }

    @Test
    void shouldReturnEmptyWhenServiceNameDoesNotExist() {
        when(otherServiceRepo.findByName("Inexistent Service")).thenReturn(Optional.empty());

        Optional<OtherService> result = otherServiceService.getOtherServiceByServiceName("Inexistent Service");

        assertThat(result).isEmpty();
    }

    @Test
    void shouldThrowExceptionWhenServiceNameIsNull() {
        assertThatThrownBy(() -> otherServiceService.getOtherServiceByServiceName(null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Service name cannot be null");
    }

    @Test
    void shouldReturnServicesForValidUserId() {
        Integer userId = 1;
        OtherService service1 = new OtherService();
        OtherService service2 = new OtherService();
        service1.setId(101);
        service2.setId(102);

        when(otherServiceRepo.findByUserId(userId)).thenReturn(List.of(service1, service2));

        List<OtherService> result = otherServiceService.getOtherServiceByUserId(userId);

        assertThat(result).hasSize(2);
        assertThat(result).containsExactly(service1, service2);
    }

    @Test
    void shouldReturnEmptyListWhenUserHasNoServices() {
        Integer userId = 999;

        when(otherServiceRepo.findByUserId(userId)).thenReturn(List.of());

        List<OtherService> result = otherServiceService.getOtherServiceByUserId(userId);

        assertThat(result).isEmpty();
    }

    @Test
    void shouldThrowExceptionWhenUserIdIsNull() {
        assertThatThrownBy(() -> otherServiceService.getOtherServiceByUserId(null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("User ID cannot be null");
    }

    @Test
    void shouldReturnServicesWhenCityIsValid() {
        String city = "Sevilla";

        OtherService service1 = new OtherService();
        service1.setId(1);
        service1.setName("Catering Sevilla");

        OtherService service2 = new OtherService();
        service2.setId(2);
        service2.setName("Decoración Sevilla");

        when(otherServiceRepo.findByCityAvailable(city)).thenReturn(List.of(service1, service2));

        List<OtherService> result = otherServiceService.getOtherServiceByAvailableCity(city);

        assertThat(result).hasSize(2);
        assertThat(result).containsExactly(service1, service2);
    }

    @Test
    void shouldReturnEmptyListWhenNoServicesInCity() {
        String city = "CiudadFantasma";

        when(otherServiceRepo.findByCityAvailable(city)).thenReturn(List.of());

        List<OtherService> result = otherServiceService.getOtherServiceByAvailableCity(city);

        assertThat(result).isEmpty();
    }

    @Test
    void shouldThrowExceptionWhenCityIsNull() {
        assertThatThrownBy(() -> otherServiceService.getOtherServiceByAvailableCity(null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("City name cannot be null");
    }

    @Test
    void shouldReturnServicesWhenTypeIsValid() {
        OtherServiceType type = OtherServiceType.CATERING;

        OtherService service1 = new OtherService();
        service1.setId(1);
        service1.setOtherServiceType(type);

        OtherService service2 = new OtherService();
        service2.setId(2);
        service2.setOtherServiceType(type);

        when(otherServiceRepo.findByOtherServiceType(type)).thenReturn(List.of(service1, service2));

        List<OtherService> result = otherServiceService.getOtherServiceByOtherServiceType(type);

        assertThat(result).hasSize(2);
        assertThat(result).allMatch(s -> s.getOtherServiceType() == OtherServiceType.CATERING);
    }

    @Test
    void shouldReturnEmptyListWhenNoServicesOfGivenType() {
        OtherServiceType type = OtherServiceType.DECORATION;

        when(otherServiceRepo.findByOtherServiceType(type)).thenReturn(List.of());

        List<OtherService> result = otherServiceService.getOtherServiceByOtherServiceType(type);

        assertThat(result).isEmpty();
    }

    @Test
    void shouldThrowExceptionWhenServiceTypeIsNull() {
        assertThatThrownBy(() -> otherServiceService.getOtherServiceByOtherServiceType(null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Service type cannot be null");
    }

    @Test
    void shouldReturnAvailableServicesWhenAvailableIsTrue() {
        OtherService service1 = new OtherService();
        service1.setId(1);
        service1.setAvailable(true);

        OtherService service2 = new OtherService();
        service2.setId(2);
        service2.setAvailable(true);

        when(otherServiceRepo.findByAvailable(true)).thenReturn(List.of(service1, service2));

        List<OtherService> result = otherServiceService.getOtherServiceByAvailability(true);

        assertThat(result).hasSize(2);
        assertThat(result).allMatch(OtherService::getAvailable);
    }

    @Test
    void shouldReturnEmptyListWhenNoServicesMatchAvailability() {
        when(otherServiceRepo.findByAvailable(false)).thenReturn(List.of());

        List<OtherService> result = otherServiceService.getOtherServiceByAvailability(false);

        assertThat(result).isEmpty();
    }

    @Test
    void shouldThrowExceptionWhenAvailabilityIsNull() {
        assertThatThrownBy(() -> otherServiceService.getOtherServiceByAvailability(null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Availability parameter cannot be null");
    }

    @Test
    void shouldReturnFilteredServicesSortedByPremiumFirst() {
        User premiumUser = new User();
        premiumUser.setPlan(User.Plan.PREMIUM);

        User basicUser = new User();
        basicUser.setPlan(User.Plan.BASIC);

        OtherService s1 = new OtherService();
        s1.setName("Catering Sevilla");
        s1.setUser(basicUser);

        OtherService s2 = new OtherService();
        s2.setName("Catering Sevilla");
        s2.setUser(premiumUser);

        when(otherServiceRepo.findByFilters("Catering", "Sevilla", OtherServiceType.CATERING))
            .thenReturn(List.of(s1, s2)); // sin ordenar

        List<OtherService> result = otherServiceService.getFilteredOtherServices("Catering", "Sevilla", OtherServiceType.CATERING);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getUser().getPlan()).isEqualTo(User.Plan.PREMIUM);
        assertThat(result.get(1).getUser().getPlan()).isEqualTo(User.Plan.BASIC);
    }

    @Test
    void shouldReturnEmptyListWhenNoServicesMatchFilters() {
        when(otherServiceRepo.findByFilters("Inexistente", "Ahorahere", OtherServiceType.ENTERTAINMENT))
            .thenReturn(List.of());

        List<OtherService> result = otherServiceService.getFilteredOtherServices("Inexistente", "Ahorahere", OtherServiceType.ENTERTAINMENT);

        assertThat(result).isEmpty();
    }

    @Test
    void shouldCreateOtherServiceWhenUserIsPremiumAndHasSlots() {
        User user = new User();
        user.setId(1);
        user.setPlan(User.Plan.PREMIUM);

        OtherService newService = new OtherService();
        newService.setUser(user);

        OtherServiceDTO os1 = mock(OtherServiceDTO.class);
        when(os1.getAvailable()).thenReturn(true);

        VenueDTO v1 = mock(VenueDTO.class);
        when(v1.getAvailable()).thenReturn(true);

        ServiceDTO existingServices = mock(ServiceDTO.class);
        when(existingServices.getOtherServices()).thenReturn(List.of(os1));
        when(existingServices.getVenues()).thenReturn(List.of(v1));

        when(userService.getUserById(1)).thenReturn(Optional.of(user));
        when(serviceService.getAllServiceByUserId(1)).thenReturn(existingServices);
        when(otherServiceRepo.save(newService)).thenReturn(newService);

        OtherService result = otherServiceService.createOtherService(newService);

        assertThat(result).isEqualTo(newService);
    }

    @Test
    void shouldThrowExceptionWhenBasicUserExceedsLimit() {
        User user = new User();
        user.setId(2);
        user.setPlan(User.Plan.BASIC);

        OtherService newService = new OtherService();
        newService.setUser(user);

        OtherServiceDTO os1 = mock(OtherServiceDTO.class);
        when(os1.getAvailable()).thenReturn(true);

        OtherServiceDTO os2 = mock(OtherServiceDTO.class);
        when(os2.getAvailable()).thenReturn(true);

        VenueDTO v1 = mock(VenueDTO.class);
        when(v1.getAvailable()).thenReturn(true);

        ServiceDTO existingServices = mock(ServiceDTO.class);
        when(existingServices.getOtherServices()).thenReturn(List.of(os1, os2));
        when(existingServices.getVenues()).thenReturn(List.of(v1));

        when(userService.getUserById(2)).thenReturn(Optional.of(user));
        when(serviceService.getAllServiceByUserId(2)).thenReturn(existingServices);

        assertThatThrownBy(() -> otherServiceService.createOtherService(newService))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Has alcanzado el límite de servicios en el plan BASIC");
    }

    @Test
    void shouldUpdateExistingOtherService() {
        User user = new User();
        user.setId(1);

        OtherService existingService = new OtherService();
        existingService.setId(10);
        existingService.setName("Antiguo nombre");
        existingService.setExtraInformation("Info vieja");
        existingService.setUser(user);

        OtherService updatedInfo = new OtherService();
        updatedInfo.setName("Nuevo nombre");
        updatedInfo.setExtraInformation("Info nueva");

        when(otherServiceRepo.findById(10)).thenReturn(Optional.of(existingService));
        when(otherServiceRepo.save(any(OtherService.class))).thenAnswer(i -> i.getArgument(0));

        OtherService result = otherServiceService.updateOtherService(10, updatedInfo);

        assertThat(result.getName()).isEqualTo("Nuevo nombre");
        assertThat(result.getExtraInformation()).isEqualTo("Info nueva");
        assertThat(result.getUser()).isEqualTo(user);
    }

    @Test
    void shouldThrowExceptionWhenServiceIdDoesNotExist() {
        OtherService input = new OtherService();
        input.setName("Intento de update");

        when(otherServiceRepo.findById(999)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> otherServiceService.updateOtherService(999, input))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("No se ha encontrado ningun servicio con esa Id");
    }

    @Test
    void shouldDeleteOtherServiceWhenItExists() {
        OtherService existingService = new OtherService();
        existingService.setId(1);

        when(otherServiceRepo.findById(1)).thenReturn(Optional.of(existingService));

        otherServiceService.deleteOtherService(1);

        verify(eventPropertiesRepository).deleteByOtherService(existingService);
        verify(otherServiceRepo).delete(existingService);
    }

    @Test
    void shouldThrowExceptionWhenOtherServiceDoesNotExist() {
        when(otherServiceRepo.findById(999)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> otherServiceService.deleteOtherService(999))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("OtherService not found");

        verifyNoInteractions(eventPropertiesRepository);
        verify(otherServiceRepo, never()).delete(any());
    }

    @Test
    void shouldDeleteOtherServiceByIdWhenIdIsValid() {
        Integer id = 1;

        doNothing().when(otherServiceRepo).deleteById(id);

        otherServiceService.deleteUser(id);

        verify(otherServiceRepo).deleteById(id);
    }

    @Test
    void shouldThrowExceptionWhenDeletingNonExistingService() {
        Integer nonExistingId = 999;

        doThrow(new RuntimeException("No se puede eliminar: ID no encontrado"))
            .when(otherServiceRepo).deleteById(nonExistingId);

        assertThatThrownBy(() -> otherServiceService.deleteUser(nonExistingId))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("ID no encontrado");

        verify(otherServiceRepo).deleteById(nonExistingId);
    }

    @Test
    void shouldSaveAllOtherServicesWhenListIsValid() {
        OtherService s1 = new OtherService();
        s1.setName("Catering");
        OtherService s2 = new OtherService();
        s2.setName("Decoración");

        List<OtherService> servicesToSave = List.of(s1, s2);

        when(otherServiceRepo.saveAll(servicesToSave)).thenReturn(servicesToSave);

        otherServiceService.saveAll(servicesToSave);

        verify(otherServiceRepo).saveAll(servicesToSave);
    }

    @Test
    void shouldThrowExceptionWhenServiceListIsNull() {
        assertThatThrownBy(() -> otherServiceService.saveAll(null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("no puede ser null");

        verify(otherServiceRepo, never()).saveAll(any());
    }

    @Test
    void shouldSaveOtherServiceWhenValid() {
        OtherService service = new OtherService();
        service.setName("Catering");
        service.setExtraInformation("Servicio de catering para eventos");

        when(otherServiceRepo.save(service)).thenReturn(service);

        otherServiceService.save(service);

        verify(otherServiceRepo).save(service);
    }

    @Test
    void shouldThrowExceptionWhenServiceIsNull() {
        assertThatThrownBy(() -> otherServiceService.save(null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("no puede ser null");

        verify(otherServiceRepo, never()).save(any());
    }

}