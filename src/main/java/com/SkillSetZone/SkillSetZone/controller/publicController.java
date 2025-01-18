package com.SkillSetZone.SkillSetZone.controller;

import com.SkillSetZone.SkillSetZone.Entity.User;
import com.SkillSetZone.SkillSetZone.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/public")
public class publicController {
    @Autowired
    private final UserService userService;

    public publicController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            // Try creating the user
            User savedUser = userService.createUser(user);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED); // 201 Created response
        } catch (IllegalArgumentException e) {
            // Return an error if invalid argument
            return new ResponseEntity<>("Invalid username or password", HttpStatus.BAD_REQUEST);
        } catch (EmailAlreadyInUseException e) {
            // Custom exception for email already in use
            return new ResponseEntity<>("Email is already in use", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Return a generic error message for other exceptions
            return new ResponseEntity<>("Signup failed. Please try again.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleInvalidArguments(IllegalArgumentException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/login")
    public String login(Authentication authentication) {
        if (authentication != null) {
            return "Login successful for user: " + authentication.getName();
        }
        return "Login failed";
    }


}
