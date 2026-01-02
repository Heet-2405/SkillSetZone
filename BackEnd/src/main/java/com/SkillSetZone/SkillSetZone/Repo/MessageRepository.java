package com.SkillSetZone.SkillSetZone.Repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.SkillSetZone.SkillSetZone.Entity.Message;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByCommunityIdOrderByTimestampDesc(String communityId);

    void deleteByCommunityId(String communityId);
}