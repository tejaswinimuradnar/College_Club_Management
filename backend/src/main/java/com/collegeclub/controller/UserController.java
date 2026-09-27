package com.collegeclub.controller;

import com.collegeclub.model.User;
import com.collegeclub.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody User user) {
        return ResponseEntity.ok(userService.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody Map<String, String> body) {
        User user = userService.login(body.get("email"), body.get("password"));
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> all() {
        return ResponseEntity.ok(userService.findAll());
    }
}
