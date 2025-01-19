package com.SkillSetZone.SkillSetZone.controller;

import com.SkillSetZone.SkillSetZone.Entity.Skill;
import com.SkillSetZone.SkillSetZone.Service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    @Autowired
    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    // SKILL CREATION
    @PostMapping("/create")
    public Skill createSkill(
            @RequestPart(value = "file", required = false) MultipartFile image,
            @RequestParam("title") String title,
            @RequestParam("description") String description) throws IOException {

        // The userId is now implicitly handled by the service through authenticated user
        return skillService.addSkill(title, description, image, 0);
    }

    // UPDATE SKILL BY SKILL ID
    @PutMapping("/update/{skillId}")
    public Skill updateSkill(
            @PathVariable String skillId,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "likes", required = false, defaultValue = "0") int likes) throws IOException {

        // The userId is now implicitly handled by the service through authenticated user
        return skillService.updateSkill(skillId, title, description, file, likes);
    }

    // DELETE SKILL BY ID
    @DeleteMapping("/delete/{skillId}")
    public String deleteSkill(@PathVariable String skillId) {
        // The userId is now implicitly handled by the service through authenticated user
        skillService.deleteSkill(skillId);
        return "Skill with ID " + skillId + " has been deleted.";
    }

    // GETTING THE SKILL BY SKILL ID
    @GetMapping("/{id}")
    public Optional<Skill> getSkillById(@PathVariable String id) {
        return skillService.getSkillById(id);
    }

    // GETTING ALL THE SKILLS OF THE AUTHENTICATED USER
    @GetMapping("/all")
    public List<Skill> getAllSkills() {
        // This method now fetches the skills of the authenticated user
        return (List<Skill>) skillService.getAllSkills();
    }
}
