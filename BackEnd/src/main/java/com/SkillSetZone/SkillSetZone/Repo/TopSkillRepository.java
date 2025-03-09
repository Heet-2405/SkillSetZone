package com.SkillSetZone.SkillSetZone.Repo;

import com.SkillSetZone.SkillSetZone.Entity.TopSkill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TopSkillRepository extends MongoRepository<TopSkill, String> {
    TopSkill findBySkillName(String skillName);
}
