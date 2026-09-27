package com.collegeclub.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "memberships", uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "clubId"}))
@Data
public class Membership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long clubId;
}
