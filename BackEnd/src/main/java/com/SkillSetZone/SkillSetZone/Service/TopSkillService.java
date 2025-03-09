package com.SkillSetZone.SkillSetZone.Service;

import com.SkillSetZone.SkillSetZone.Entity.TopSkill;
import com.SkillSetZone.SkillSetZone.Repo.TopSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TopSkillService {
    private final TopSkillRepository topSkillRepository;

    @Autowired
    public TopSkillService(TopSkillRepository topSkillRepository) {
        this.topSkillRepository = topSkillRepository;
    }

    public List<TopSkill> getAllTopSkills() {
        return topSkillRepository.findAll();
    }

    public TopSkill createTopSkill(String skillName) {
        TopSkill topSkill = new TopSkill();
        topSkill.setSkillName(skillName);
        return topSkillRepository.save(topSkill);
    }

    public TopSkill deleteTopSkill(String skillName) {
        TopSkill skill = topSkillRepository.findBySkillName(skillName);
        topSkillRepository.delete(skill);
        return skill;
    }

}
