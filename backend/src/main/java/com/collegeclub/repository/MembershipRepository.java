package com.collegeclub.repository;

import com.collegeclub.model.Membership;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
    List<Membership> findByUserId(Long userId);
    List<Membership> findByClubId(Long clubId);
    Optional<Membership> findByUserIdAndClubId(Long userId, Long clubId);
}
