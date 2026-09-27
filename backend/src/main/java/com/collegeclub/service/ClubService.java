package com.collegeclub.service;

import com.collegeclub.model.Club;
import com.collegeclub.repository.ClubRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClubService {

    private final ClubRepository clubRepository;

    public List<Club> findAll() {
        return clubRepository.findAll();
    }

    public Club findById(Long id) {
        return clubRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Club not found"));
    }

    public Club create(Club club) {
        return clubRepository.save(club);
    }

    public Club update(Long id, Club updated) {
        Club club = findById(id);
        club.setName(updated.getName());
        club.setDescription(updated.getDescription());
        club.setCategory(updated.getCategory());
        club.setCoordinatorId(updated.getCoordinatorId());
        return clubRepository.save(club);
    }

    public void delete(Long id) {
        clubRepository.deleteById(id);
    }
}
