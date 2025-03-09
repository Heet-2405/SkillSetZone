package com.SkillSetZone.SkillSetZone.controller;

import com.SkillSetZone.SkillSetZone.Entity.TopSkill;
import com.SkillSetZone.SkillSetZone.Service.TopSkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class TopSkillController {

    private final TopSkillService topSkillService;

    @Autowired
    public TopSkillController(TopSkillService topSkillService) {
        this.topSkillService = topSkillService;
    }

    @PostMapping("/skill/create")
    public TopSkill createSkill(@RequestParam("skillName") String skillName) {
        return topSkillService.createTopSkill(skillName);

    }

    @DeleteMapping("/skill/delete")
    public void deleteSkill(@RequestParam("skillName") String skillName) {
        topSkillService.deleteTopSkill(skillName);

    }

    @GetMapping("/skill/all")
    public List<TopSkill> getAllSkills() {
        return topSkillService.getAllTopSkills();
    }

}
