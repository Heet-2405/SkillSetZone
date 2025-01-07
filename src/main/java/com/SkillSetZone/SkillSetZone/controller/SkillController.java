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
    @PostMapping("/{userId}/create")
    public Skill createSkill(
            @PathVariable String userId,
            @RequestPart(value = "file", required = false) MultipartFile image,
            @RequestParam("title") String title,
            @RequestParam("description") String description) throws IOException {

        if (image == null || image.isEmpty()) {
            return skillService.addSkill(title, description, null, 0, userId); // Pass null for image if no file is uploaded
        }
        return skillService.addSkill(title, description, image, 0, userId);
    }


    // UPDATE SKILL BY SKILL ID
    @PutMapping("/{userId}/update/{skillId}")
    public Skill updateSkill(
            @PathVariable String userId,
            @PathVariable String skillId,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "likes", required = false, defaultValue = "0") int likes) throws IOException {

        return skillService.updateSkill(skillId, title, description, file, likes, userId);
    }

    // DELETE SKILL BY ID
    @DeleteMapping("/{userId}/delete/{skillId}")
    public String deleteSkill(@PathVariable String userId, @PathVariable String skillId) {
        skillService.deleteSkill(skillId,userId);
        return "Skill with ID " + skillId + " has been deleted.";
    }

    // GETTING THE SKILL BY SKILL ID
    @GetMapping("/{id}")
    public Optional<Skill> getSkillById(@PathVariable String id) {
        return skillService.getSkillById(id);
    }

    // GETTING ALL THE SKILLS OF A USER
    @GetMapping("/{userId}/all")
    public List<Skill> getAllSkillsByUser(@PathVariable String userId) {
        return (List<Skill>) skillService.getAllSkills(); // Modify as needed if user-specific logic is required
    }
}
