package com.SkillSetZone.SkillSetZone.Repo;

import com.SkillSetZone.SkillSetZone.Entity.Skill;
import com.SkillSetZone.SkillSetZone.Entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends MongoRepository<Skill, String> {
    List<Skill> findAllByEmail(String email);
    List<Skill> findAll();
    List<Skill>findByTitleContainingIgnoreCase(String title);
    List<Skill> findByToolContainingIgnoreCase(String tool);


    void deleteByEmail(String email);
}




