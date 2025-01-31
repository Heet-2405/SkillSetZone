package com.SkillSetZone.SkillSetZone.Repo;

import com.SkillSetZone.SkillSetZone.Entity.UserLikesSkill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserLikesSkillRepository extends MongoRepository<UserLikesSkill, String> {
    // MongoDB repository methods
    Optional<UserLikesSkill> findByUserEmailAndSkillId(String userEmail, String skillId);
}


