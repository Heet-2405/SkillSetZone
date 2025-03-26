package com.SkillSetZone.SkillSetZone.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
//    @Pattern(regexp = "^\\d{2}[a-z]{2,5}[a-z]{2}\\d{3}@ddu\\.ac\\.in$",
//            message = "Email must be in the format like '22itubs029@ddu.ac.in")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private String collegeBranch;
    private String bio;
    private byte[] image; // Optional field

    @DBRef
    private List<Skill> skills = new ArrayList<>();

    private String role = "USER"; // Default role

    // Constructors and other methods remain the same
    public User() {}

    public User(String id, String name, String email, String password, String collegeBranch, byte[] image, List<Skill> skills, String bio) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.collegeBranch = collegeBranch;
        this.image = image; // Image can be null
        this.skills = skills == null ? new ArrayList<>() : skills;
        this.bio = bio;
    }

    // All getters and setters remain the same
    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getCollegeBranch() { return collegeBranch; }
    public void setCollegeBranch(String collegeBranch) { this.collegeBranch = collegeBranch; }
    public byte[] getImage() { return image; }
    public void setImage(byte[] image) { this.image = image; }
    public List<Skill> getSkills() { return skills; }
    public void setSkills(List<Skill> skills) { this.skills = skills; }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", collegeBranch='" + collegeBranch + '\'' +
                ", skills=" + skills +
                '}';
    }
}