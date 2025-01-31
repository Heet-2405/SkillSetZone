package com.SkillSetZone.SkillSetZone.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Likes")
public class UserLikesSkill {

    @Id
    private String id;
    private String userEmail;
    private String skillId;

    public UserLikesSkill(String userEmail, String skillId) {
        this.userEmail = userEmail;
        this.skillId = skillId;
    }

    public UserLikesSkill() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getSkillId() {
        return skillId;
    }

    public void setSkillId(String skillId) {
        this.skillId = skillId;
    }
}
