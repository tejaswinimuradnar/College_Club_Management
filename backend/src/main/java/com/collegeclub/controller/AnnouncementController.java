package com.collegeclub.controller;

import com.collegeclub.model.Announcement;
import com.collegeclub.service.AnnouncementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @GetMapping
    public ResponseEntity<List<Announcement>> all() {
        return ResponseEntity.ok(announcementService.findAll());
    }

    @PostMapping
    public ResponseEntity<Announcement> create(@Valid @RequestBody Announcement announcement) {
        return ResponseEntity.ok(announcementService.create(announcement));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Announcement> update(@PathVariable Long id, @Valid @RequestBody Announcement announcement) {
        return ResponseEntity.ok(announcementService.update(id, announcement));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        announcementService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
