package com.collegeclub.controller;

import com.collegeclub.model.Club;
import com.collegeclub.service.ClubService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
public class ClubController {

    private final ClubService clubService;

    @GetMapping
    public ResponseEntity<List<Club>> all() {
        return ResponseEntity.ok(clubService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Club> byId(@PathVariable Long id) {
        return ResponseEntity.ok(clubService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Club> create(@Valid @RequestBody Club club) {
        return ResponseEntity.ok(clubService.create(club));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Club> update(@PathVariable Long id, @Valid @RequestBody Club club) {
        return ResponseEntity.ok(clubService.update(id, club));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        clubService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
