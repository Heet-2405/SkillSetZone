package com.SkillSetZone.SkillSetZone.Repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.SkillSetZone.SkillSetZone.Entity.Community;

@Repository
public interface CommunityRepository extends MongoRepository<Community, String> {
    // Custom queries can be added here if needed
}