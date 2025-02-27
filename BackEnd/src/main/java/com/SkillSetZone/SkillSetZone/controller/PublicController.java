package com.SkillSetZone.SkillSetZone.controller;

import com.SkillSetZone.SkillSetZone.DTO.LoginRequest;
import com.SkillSetZone.SkillSetZone.Entity.User;
import com.SkillSetZone.SkillSetZone.Repo.UserRepository;
import com.SkillSetZone.SkillSetZone.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173/")
@RequestMapping("/public")
public class PublicController {

    private final UserService userService;
    private final UserRepository userRepository;

    @Autowired
    public PublicController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    // Signup endpoint
    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("collegeBranch") String collegeBranch,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            // Convert image to byte array (if provided)
            byte[] imageData = null;
            if (image != null && !image.isEmpty()) {
                imageData = image.getBytes();
            }

            // Create User object
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(password); // Hash password before saving
            user.setCollegeBranch(collegeBranch);
            user.setImage(imageData); // Save image as byte array

            // Save user to the database
            User newUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);

        } catch (EmailAlreadyInUseException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing image");
        }
    }


    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.authenticateUser(loginRequest);
            return ResponseEntity.ok("Login successful for user: " + user.getName());
        } catch (AuthenticationFailedException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public List<User> getAllUsers() {
        List<User> users= new ArrayList<>(userRepository.findAll());
        return users;
    }
}
