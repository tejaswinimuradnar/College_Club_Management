package com.collegeclub.repository;

import com.collegeclub.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByEventId(Long eventId);
    List<Registration> findByUserId(Long userId);
    Optional<Registration> findByUserIdAndEventId(Long userId, Long eventId);
}
