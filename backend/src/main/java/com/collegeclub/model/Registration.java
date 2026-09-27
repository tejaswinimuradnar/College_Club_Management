package com.collegeclub.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "registrations", uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "eventId"}))
@Data
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long eventId;
}
