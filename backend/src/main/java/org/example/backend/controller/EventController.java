package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.Event;
import org.example.backend.model.EventDTO;
import org.example.backend.service.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/calender")
@RequiredArgsConstructor

public class EventController {
    private final EventService eventService;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/create")
    public Event createEvent(@RequestBody EventDTO eventDTO) {
        return eventService.createEvent(eventDTO);
    }
}
