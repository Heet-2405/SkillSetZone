package com.SkillSetZone.SkillSetZone.Repo;

import com.SkillSetZone.SkillSetZone.Entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByName(String name);
    List<User> findByNameContainingIgnoreCase(String name);
}
