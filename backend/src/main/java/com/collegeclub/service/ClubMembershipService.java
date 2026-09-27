package com.collegeclub.service;

import com.collegeclub.model.Membership;
import com.collegeclub.repository.MembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClubMembershipService {

    private final MembershipRepository membershipRepository;

    public Membership join(Long userId, Long clubId) {
        if (membershipRepository.findByUserIdAndClubId(userId, clubId).isPresent()) {
            throw new IllegalArgumentException("Already a member of this club");
        }
        Membership m = new Membership();
        m.setUserId(userId);
        m.setClubId(clubId);
        return membershipRepository.save(m);
    }

    public List<Membership> membersOfClub(Long clubId) {
        return membershipRepository.findByClubId(clubId);
    }

    public List<Membership> clubsOfUser(Long userId) {
        return membershipRepository.findByUserId(userId);
    }
}
