package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.Event;
import org.example.backend.model.EventDTO;
import org.example.backend.repository.EventRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor


public class EventService {
    private final IdService idService;
    private final EventRepository eventRepository;

    public Event createEvent(EventDTO eventDTO) {
        Event newEvent = new Event(idService.generateId(), eventDTO.description(),eventDTO.startTime(),eventDTO.endTime());
        return eventRepository.save(newEvent);
    }
}
