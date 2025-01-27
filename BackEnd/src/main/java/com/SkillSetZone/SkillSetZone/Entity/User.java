package com.SkillSetZone.SkillSetZone.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String collegeBranch;

    @DBRef
    private List<Skill> skills = new ArrayList<>(); // Optional field, it can be an empty list

    // Constructors, getters, and setters
    public User() {}

    public User(String id, String name, String email, String password, String collegeBranch, List<Skill> skills) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.collegeBranch = collegeBranch;
        this.skills = skills == null ? new ArrayList<>() : skills; // Default to empty list if null
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCollegeBranch() {
        return collegeBranch;
    }

    public void setCollegeBranch(String collegeBranch) {
        this.collegeBranch = collegeBranch;
    }

    public List<Skill> getSkills() {
        return skills;
    }

    public void setSkills(List<Skill> skills) {
        this.skills = skills;
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", collegeBranch='" + collegeBranch + '\'' +
                ", skills=" + skills +
                '}';
    }
}
