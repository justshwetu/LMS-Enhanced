package com.example.demo.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.User;
import com.example.demo.service.UserService;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {


    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping("/add")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            // Check if user already exists
            User existingUser = userService.getUserByEmail(user.getEmail());
            if (existingUser != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Collections.singletonMap("message", "User with this email already exists"));
            }

            // Create new user
            User newUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(Collections.singletonMap("message", "User registered successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "Registration failed. Please try again."));
        }
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userService.updateUser(id, updatedUser);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
    @GetMapping("/details")
    public User getUserByEmail(@RequestParam String email) {
        return userService.getUserByEmail(email);
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        User user = userService.authenticateUser(email, password);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        String token = generateToken(user);

        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }

    private String generateToken(User user) {
        return ("userId=" + user.getId() + ", email=" + user.getEmail());
    }

}