package com.collegeclub.service;

import com.collegeclub.model.Event;
import com.collegeclub.model.Registration;
import com.collegeclub.repository.EventRepository;
import com.collegeclub.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    public List<Event> findAll() {
        return eventRepository.findAll();
    }

    public Event findById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));
    }

    public Event create(Event event) {
        return eventRepository.save(event);
    }

    public Event update(Long id, Event updated) {
        Event event = findById(id);
        event.setTitle(updated.getTitle());
        event.setDescription(updated.getDescription());
        event.setEventDate(updated.getEventDate());
        event.setVenue(updated.getVenue());
        event.setClubId(updated.getClubId());
        return eventRepository.save(event);
    }

    public void delete(Long id) {
        eventRepository.deleteById(id);
    }

    public Registration registerForEvent(Long eventId, Long userId) {
        findById(eventId);
        if (registrationRepository.findByUserIdAndEventId(userId, eventId).isPresent()) {
            throw new IllegalArgumentException("Already registered for this event");
        }
        Registration reg = new Registration();
        reg.setEventId(eventId);
        reg.setUserId(userId);
        return registrationRepository.save(reg);
    }

    public List<Registration> registrationsForEvent(Long eventId) {
        return registrationRepository.findByEventId(eventId);
    }
}
