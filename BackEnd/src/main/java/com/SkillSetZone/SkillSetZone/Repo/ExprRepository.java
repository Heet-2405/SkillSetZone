package com.SkillSetZone.SkillSetZone.Repo;

import com.SkillSetZone.SkillSetZone.Entity.Expr;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExprRepository extends MongoRepository<Expr, String> {
    List<Expr> findAllByEmail(String email);
}
