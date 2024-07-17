package org.example.backend.service;

import org.example.backend.model.Event;
import org.example.backend.model.EventDTO;
import org.example.backend.repository.EventRepository;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EventServiceTest {
    private final EventRepository mockEventRepository = mock(EventRepository.class);
    private final IdService mockIdService = mock(IdService.class);
    EventService eventService = new EventService(mockIdService, mockEventRepository);

    @Test
    void createEvent_shouldReturnEvent_whenCalledWithEventDTO() {
        //GIVEN
        EventDTO eventDTO = new EventDTO("TestEvent", Instant.parse("2024-07-17T10:00:00Z"), Instant.parse("2024-07-17T11:00:00Z"));
        Event expected = new Event("Test ID", eventDTO.description(), eventDTO.startTime(), eventDTO.endTime());

        //WHEN
        when(mockEventRepository.save(expected)).thenReturn(expected);
        when(mockIdService.generateId()).thenReturn(expected.id());
        Event actual = eventService.createEvent(eventDTO);

        //THEN
        assertEquals(expected, actual);
        verify(mockEventRepository).save(expected);
        verify(mockIdService).generateId();
    }
}