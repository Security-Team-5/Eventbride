package com.eventbride.event_properties;

import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.eventbride.event.Event;
import com.eventbride.event_properties.EventProperties;
import com.eventbride.event_properties.EventPropertiesRepository;
import com.eventbride.event_properties.EventPropertiesService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class EventPropertiesServiceTest {

    @Mock
    private EventPropertiesRepository eventPropertiesRepository;

    @InjectMocks
    private EventPropertiesService eventPropertiesService;

    @Test
    void testFindAll_PositiveCase() {
        EventProperties event1 = new EventProperties();
        event1.setId(1);
        event1.setBookDateTime(LocalDateTime.now());
        event1.setPricePerService(BigDecimal.valueOf(100.00));

        EventProperties event2 = new EventProperties();
        event2.setId(2);
        event2.setBookDateTime(LocalDateTime.now().plusDays(1));
        event2.setPricePerService(BigDecimal.valueOf(200.00));

        List<EventProperties> expectedList = List.of(event1, event2);

        when(eventPropertiesRepository.findAll()).thenReturn(expectedList);

        List<EventProperties> result = eventPropertiesService.findAll();

        assertEquals(2, result.size());
        assertEquals(1, result.get(0).getId());
        assertEquals(2, result.get(1).getId());
        assertEquals(BigDecimal.valueOf(100.00), result.get(0).getPricePerService());
        assertEquals(BigDecimal.valueOf(200.00), result.get(1).getPricePerService());
    }

    @Test
    void testFindAll_ReturnsEmptyList() {
        when(eventPropertiesRepository.findAll()).thenReturn(List.of());

        List<EventProperties> result = eventPropertiesService.findAll();

        assertEquals(0, result.size(), "La lista debería estar vacía");
    }

    @Test
    void testFindAll_ThrowsRuntimeException() {
        when(eventPropertiesRepository.findAll()).thenThrow(new RuntimeException("Database error"));

        assertThrows(RuntimeException.class, () -> {
            eventPropertiesService.findAll();
        });
    }

    @Test
    void testFindById_PositiveCase() {
        EventProperties event = new EventProperties();
        event.setId(1);
        event.setBookDateTime(LocalDateTime.now());
        event.setPricePerService(BigDecimal.valueOf(150.00));

        when(eventPropertiesRepository.findById(1)).thenReturn(Optional.of(event));

        EventProperties result = eventPropertiesService.findById(1);

        assertEquals(1, result.getId());
        assertEquals(BigDecimal.valueOf(150.00), result.getPricePerService());
    }

    @Test
    void testFindById_NotFound_ShouldThrowException() {
        when(eventPropertiesRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> {
            eventPropertiesService.findById(99);
        });
    }

    @Test
    void testSave_PositiveCase() {
        EventProperties event = new EventProperties();
        event.setBookDateTime(LocalDateTime.now());
        event.setPricePerService(BigDecimal.valueOf(120.00));

        EventProperties savedEvent = new EventProperties();
        savedEvent.setId(1);
        savedEvent.setBookDateTime(event.getBookDateTime());
        savedEvent.setPricePerService(event.getPricePerService());

        when(eventPropertiesRepository.save(event)).thenReturn(savedEvent);

        EventProperties result = eventPropertiesService.save(event);

        assertEquals(1, result.getId());
        assertEquals(event.getBookDateTime(), result.getBookDateTime());
        assertEquals(event.getPricePerService(), result.getPricePerService());
    }

    @Test
    void testSave_NegativeCase_ThrowsDataAccessException() {
        EventProperties event = new EventProperties();
        event.setBookDateTime(LocalDateTime.now());
        event.setPricePerService(BigDecimal.valueOf(120.00));

        when(eventPropertiesRepository.save(event))
                .thenThrow(new DataAccessException("Database write error") {});

        assertThrows(DataAccessException.class, () -> {
            eventPropertiesService.save(event);
        });
    }

    @Test
    void testUpdateEventProperties_PositiveCase() {
        int id = 1;

        EventProperties existingEvent = new EventProperties();
        existingEvent.setId(id);
        existingEvent.setBookDateTime(LocalDateTime.of(2025, 1, 1, 10, 0));
        existingEvent.setPricePerService(BigDecimal.valueOf(100.00));

        EventProperties updatedData = new EventProperties();
        updatedData.setBookDateTime(LocalDateTime.of(2025, 2, 1, 12, 0));
        updatedData.setPricePerService(BigDecimal.valueOf(150.00));

        EventProperties savedEvent = new EventProperties();
        savedEvent.setId(id);
        savedEvent.setBookDateTime(updatedData.getBookDateTime());
        savedEvent.setPricePerService(updatedData.getPricePerService());

        when(eventPropertiesRepository.findById(id)).thenReturn(Optional.of(existingEvent));
        when(eventPropertiesRepository.save(existingEvent)).thenReturn(savedEvent);

        EventProperties result = eventPropertiesService.updateEventProperties(updatedData, id);

        assertEquals(id, result.getId());
        assertEquals(updatedData.getBookDateTime(), result.getBookDateTime());
        assertEquals(updatedData.getPricePerService(), result.getPricePerService());
    }

    @Test
    void testUpdateEventProperties_NotFound_ShouldThrowException() {
        int id = 99;

        EventProperties updatedData = new EventProperties();
        updatedData.setBookDateTime(LocalDateTime.of(2025, 3, 1, 10, 0));
        updatedData.setPricePerService(BigDecimal.valueOf(180.00));

        when(eventPropertiesRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> {
            eventPropertiesService.updateEventProperties(updatedData, id);
        });
    }
}