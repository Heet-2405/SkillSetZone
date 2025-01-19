package com.SkillSetZone.SkillSetZone.controller;

import com.SkillSetZone.SkillSetZone.DTO.LoginRequest;
import com.SkillSetZone.SkillSetZone.Entity.User;
import com.SkillSetZone.SkillSetZone.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173/")
@RequestMapping("/public")
public class PublicController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public PublicController(UserService userService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userService.isEmailAlreadyInUse(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already in use.");
        }
        User newUser = userService.createUser(user);
        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        return ResponseEntity.ok("Login successful!");
    }
}
