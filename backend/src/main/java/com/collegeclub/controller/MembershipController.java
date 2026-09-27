package com.collegeclub.controller;

import com.collegeclub.model.Membership;
import com.collegeclub.service.ClubMembershipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/memberships")
@RequiredArgsConstructor
public class MembershipController {

    private final ClubMembershipService membershipService;

    @PostMapping("/join")
    public ResponseEntity<Membership> join(@RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(membershipService.join(body.get("userId"), body.get("clubId")));
    }

    @GetMapping("/club/{clubId}")
    public ResponseEntity<List<Membership>> membersOfClub(@PathVariable Long clubId) {
        return ResponseEntity.ok(membershipService.membersOfClub(clubId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Membership>> clubsOfUser(@PathVariable Long userId) {
        return ResponseEntity.ok(membershipService.clubsOfUser(userId));
    }
}
