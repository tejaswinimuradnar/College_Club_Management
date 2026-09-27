package com.collegeclub.controller;

import com.collegeclub.model.Event;
import com.collegeclub.model.Registration;
import com.collegeclub.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<Event>> all() {
        return ResponseEntity.ok(eventService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> byId(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Event> create(@Valid @RequestBody Event event) {
        return ResponseEntity.ok(eventService.create(event));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> update(@PathVariable Long id, @Valid @RequestBody Event event) {
        return ResponseEntity.ok(eventService.update(id, event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        eventService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<Registration> registerForEvent(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(eventService.registerForEvent(id, body.get("userId")));
    }

    @GetMapping("/{id}/registrations")
    public ResponseEntity<List<Registration>> registrations(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.registrationsForEvent(id));
    }
}
