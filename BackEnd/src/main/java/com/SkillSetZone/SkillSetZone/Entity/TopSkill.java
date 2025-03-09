package com.SkillSetZone.SkillSetZone.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("TOP_SKILLS")
public class TopSkill {
    @Id
    private String id;

    public TopSkill() {
    }

    private String skillName;

    public TopSkill(String id, String skillName) {
        this.id = id;
        this.skillName = skillName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }
}
