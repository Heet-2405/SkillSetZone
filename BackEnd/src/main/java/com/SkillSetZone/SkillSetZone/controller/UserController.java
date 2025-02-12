package com.SkillSetZone.SkillSetZone.controller;

import com.SkillSetZone.SkillSetZone.Entity.User;
import com.SkillSetZone.SkillSetZone.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    @PostMapping("/logout")
    public String logout() {
        return "User logged out successfully!";
    }

    @GetMapping("/profile")
    public User getUserProfile() {
        return userService.getUserDetail();
    }


    @PostMapping(value = "/updateUser", consumes = {"multipart/form-data"})
    public ResponseEntity<String> updateUser(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "branch", required = false) String branch,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        userService.updateUser(name, email, password, branch, image);
        return ResponseEntity.ok("User updated successfully!");
    }
}
