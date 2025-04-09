package com.eventbride.tests.services;

import com.eventbride.dto.ServiceDTO;
import com.eventbride.otherService.OtherService;
import com.eventbride.otherService.OtherServiceRepository;
import com.eventbride.service.ServiceService;
import com.eventbride.venue.Venue;
import com.eventbride.venue.VenueRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ServiceServiceTest {

    @Mock
    private OtherServiceRepository otherServiceRepository;

    @Mock
    private VenueRepository venueRepository;

    @InjectMocks
    private ServiceService serviceService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllServiceByUserId() {
        Integer userId = 1;

        OtherService otherService1 = new OtherService();
        otherService1.setId(101);

        OtherService otherService2 = new OtherService();
        otherService2.setId(102);

        List<OtherService> otherServices = Arrays.asList(otherService1, otherService2);

        Venue venue1 = new Venue();
        venue1.setId(201);

        List<Venue> venues = List.of(venue1);

        when(otherServiceRepository.findByUserId(userId)).thenReturn(otherServices);
        when(venueRepository.findByUserId(userId)).thenReturn(venues);

        ServiceDTO result = serviceService.getAllServiceByUserId(userId);

        assertNotNull(result);
        assertEquals(2, result.getOtherServices().size());
        assertEquals(1, result.getVenues().size());
        assertEquals(101, result.getOtherServices().get(0).getId());
        assertEquals(201, result.getVenues().get(0).getId());

        verify(otherServiceRepository).findByUserId(userId);
        verify(venueRepository).findByUserId(userId);
    }

    @Test
    void testGetAllServiceByUserId_NoServicesOrVenues() {
        Integer userId = 2;
        when(otherServiceRepository.findByUserId(userId)).thenReturn(List.of());
        when(venueRepository.findByUserId(userId)).thenReturn(List.of());

        ServiceDTO result = serviceService.getAllServiceByUserId(userId);

        assertNotNull(result);
        assertTrue(result.getOtherServices().isEmpty());
        assertTrue(result.getVenues().isEmpty());

        verify(otherServiceRepository).findByUserId(userId);
        verify(venueRepository).findByUserId(userId);
    }

    @Test
    void testGetAllServiceByUserId_RepositoryThrowsException() {
        Integer userId = 3;
        when(otherServiceRepository.findByUserId(userId))
            .thenThrow(new RuntimeException("Database error"));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            serviceService.getAllServiceByUserId(userId);
        });

        assertEquals("Database error", exception.getMessage());

        verify(otherServiceRepository).findByUserId(userId);
        verifyNoInteractions(venueRepository);
    }
}