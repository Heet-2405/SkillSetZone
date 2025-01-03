package com.SkillSetZone.SkillSetZone.Service;

import com.SkillSetZone.SkillSetZone.Entity.Skill;
import com.SkillSetZone.SkillSetZone.Entity.User;
import com.SkillSetZone.SkillSetZone.Repo.SkillRepository;
import com.SkillSetZone.SkillSetZone.Repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    private final UserRepository userRepository;

    public SkillService(SkillRepository skillRepository, UserRepository userRepository) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }

    public Skill createSkill(String userId, Skill skill) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Save the skill
        Skill savedSkill = skillRepository.save(skill);

        // Associate the skill with the user
        user.getSkills().add(savedSkill);
        userRepository.save(user);

        return savedSkill;
    }

    public void deleteSkill(String userId, String skillId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the skill belongs to the user
        Skill skillToDelete = skillRepository.findById(skillId).orElseThrow(() -> new RuntimeException("Skill not found"));
        if (!user.getSkills().contains(skillToDelete)) {
            throw new RuntimeException("Skill does not belong to this user");
        }

        // Remove the skill from the user and delete it
        user.getSkills().remove(skillToDelete);
        userRepository.save(user);
        skillRepository.delete(skillToDelete);
    }

    public Optional<Skill> getSkillById(String id) {
        return skillRepository.findById(id);
    }
    public Skill updateSkill(String userId, String skillId, String title, String description, String filePath) {
        // Find the skill by ID
        Optional<Skill> optionalSkill = skillRepository.findById(skillId);

        if (optionalSkill.isEmpty()) {
            throw new IllegalArgumentException("Skill not found with ID: " + skillId);
        }

        // Update skill details
        Skill skill = optionalSkill.get();
        skill.setTitle(title);
        skill.setDescription(description);

        // Update the imageUrl only if a new file path is provided
        if (filePath != null && !filePath.isEmpty()) {
            skill.setImageUrl(filePath);
        }

        // Save updated skill
        return skillRepository.save(skill);
    }

    public List<Skill> getAllSkillsByUser(String userId) {
        // Query the repository to find all skills where the userId matches
        return skillRepository.findAllByUserId(userId);
    }

}

