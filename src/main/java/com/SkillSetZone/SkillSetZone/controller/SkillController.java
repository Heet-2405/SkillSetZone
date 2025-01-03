package com.SkillSetZone.SkillSetZone.Controller;

import com.SkillSetZone.SkillSetZone.Entity.Skill;
import com.SkillSetZone.SkillSetZone.Service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;
    private static final String UPLOAD_DIR = "uploads/";

    @Autowired
    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @PostMapping("/{userId}/create")
    public Skill createSkill(
            @PathVariable String userId,
            @RequestPart("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description) throws IOException {

        // Save the uploaded file
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR + fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());

        // Create the skill
        Skill skill = new Skill();
        skill.setTitle(title);
        skill.setDescription(description);
        skill.setImageUrl(filePath.toString());
        skill.setLikes(0);

        return skillService.createSkill(userId, skill);
    }

    @PutMapping("/{userId}/update/{skillId}")
    public Skill updateSkill(
            @PathVariable String userId,
            @PathVariable String skillId,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description) throws IOException {

        // Handle file upload if provided
        String filePath = null;
        if (file != null && !file.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            filePath = Paths.get(UPLOAD_DIR + fileName).toString();
            Files.createDirectories(Paths.get(UPLOAD_DIR));
            Files.write(Paths.get(filePath), file.getBytes());
        }

        // Update the skill
        return skillService.updateSkill(userId, skillId, title, description, filePath);
    }

    @DeleteMapping("/{userId}/delete/{skillId}")
    public void deleteSkill(@PathVariable String userId, @PathVariable String skillId) {
        skillService.deleteSkill(userId, skillId);
    }

    @GetMapping("/{id}")
    public Optional<Skill> getSkillById(@PathVariable String id) {
        return skillService.getSkillById(id);
    }

    @GetMapping("/{userId}/all")
    public List<Skill> getAllSkillsByUser(@PathVariable String userId) {
        return skillService.getAllSkillsByUser(userId);
    }
}
