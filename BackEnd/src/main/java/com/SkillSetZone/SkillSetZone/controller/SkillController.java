package com.SkillSetZone.SkillSetZone.controller;

import com.SkillSetZone.SkillSetZone.Entity.Skill;
import com.SkillSetZone.SkillSetZone.Service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/skills")

public class SkillController {

    private final SkillService skillService;

    @Autowired
    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @RequestMapping(value = "/api/skills/all", method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> handleOptions() {
        return ResponseEntity.ok().build(); // Respond with HTTP 200 OK
    }
    @PostMapping("/create")
    public Skill createSkill(
            @RequestPart(value = "file", required = false) MultipartFile image,
            @RequestParam("title") String title,
            @RequestParam("description") String description) throws IOException {
        return skillService.addSkill(title, description, image, 0);
    }

    @PutMapping("/update/{id}")
    public Skill updateSkill(
            @PathVariable String id,
            @RequestPart(value = "file", required = false) MultipartFile image,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("likes") int likes) throws IOException {
        return skillService.updateSkill(id, title, description, image, likes);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteSkill(@PathVariable String id) {
        skillService.deleteSkill(id);
        return "Skill deleted successfully.";
    }

    @GetMapping("/{id}")
    public Optional<Skill> getSkillById(@PathVariable String id) {
        return skillService.getSkillById(id);
    }

    @GetMapping("/all")
    public List<Skill> getAllSkillsForUser() {
        return skillService.getAllSkillsForUser();
    }

    @GetMapping("/all-skills")
    public List<Map<String, Object>> getAllSkills() {
        return skillService.getAllSkills();
    }



}
