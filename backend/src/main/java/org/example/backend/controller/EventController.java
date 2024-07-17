package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.Event;
import org.example.backend.model.EventDTO;
import org.example.backend.service.EventService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/calender")
@RequiredArgsConstructor

public class EventController {
    private final EventService eventService;

    @PostMapping("/create")
    public Event createEvent(@RequestBody EventDTO eventDTO) {
        return eventService.saveEvent(eventDTO);
    }
}
