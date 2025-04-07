package com.eventbride.tests.services;

import com.eventbride.dto.ServiceDTO;
import com.eventbride.otherService.OtherService;
import com.eventbride.otherService.OtherServiceRepository;
import com.eventbride.service.ServiceService;
import com.eventbride.venue.Venue;
import com.eventbride.venue.VenueRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ServiceServiceUnitTest {

    @Mock
    private OtherServiceRepository otherServiceRepository;

    @Mock
    private VenueRepository venueRepository;

    @InjectMocks
    private ServiceService serviceService;

    public ServiceServiceUnitTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllServiceByUserId_Positive() {
        int userId = 1;
        OtherService otherService = new OtherService();
        Venue venue = new Venue();

        when(otherServiceRepository.findByUserId(userId)).thenReturn(List.of(otherService));
        when(venueRepository.findByUserId(userId)).thenReturn(List.of(venue));

        ServiceDTO result = serviceService.getAllServiceByUserId(userId);

        assertNotNull(result);
        assertEquals(1, result.getOtherServices().size());
        assertEquals(1, result.getVenues().size());
    }

    @Test
    void testGetAllServiceByUserId_Negative_NoServicesOrVenues() {
        int userId = 999;
        when(otherServiceRepository.findByUserId(userId)).thenReturn(List.of());
        when(venueRepository.findByUserId(userId)).thenReturn(List.of());

        ServiceDTO result = serviceService.getAllServiceByUserId(userId);

        assertNotNull(result);
        assertTrue(result.getOtherServices().isEmpty());
        assertTrue(result.getVenues().isEmpty());
    }
}
