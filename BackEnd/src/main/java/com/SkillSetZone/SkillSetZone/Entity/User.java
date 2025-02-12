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
    private byte[] image; // Optional field
    @DBRef
    private List<Skill> skills = new ArrayList<>();

    public User() {}

    public User(String id, String name, String email, String password, String collegeBranch, byte[] image, List<Skill> skills) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.collegeBranch = collegeBranch;
        this.image = image; // Image can be null
        this.skills = skills == null ? new ArrayList<>() : skills;
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
