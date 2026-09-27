package com.collegeclub.service;

import com.collegeclub.model.Announcement;
import com.collegeclub.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    public List<Announcement> findAll() {
        return announcementRepository.findAll();
    }

    public Announcement create(Announcement announcement) {
        return announcementRepository.save(announcement);
    }

    public Announcement update(Long id, Announcement updated) {
        Announcement a = announcementRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Announcement not found"));
        a.setTitle(updated.getTitle());
        a.setContent(updated.getContent());
        a.setClubId(updated.getClubId());
        return announcementRepository.save(a);
    }

    public void delete(Long id) {
        announcementRepository.deleteById(id);
    }
}
