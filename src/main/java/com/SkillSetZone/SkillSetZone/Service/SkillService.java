package com.SkillSetZone.SkillSetZone.Service;

import com.SkillSetZone.SkillSetZone.Entity.Skill;
import com.SkillSetZone.SkillSetZone.Repo.SkillRepository;
import com.SkillSetZone.SkillSetZone.Repo.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository; // Repository for the users collection

    public SkillService(SkillRepository skillRepository, UserRepository userRepository) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }

    // Save a new skill with an image and add it to the user's collection
    public Skill addSkill(String title, String description, MultipartFile image, int likes, String userId) throws IOException {
        // Create a new Skill object
        Skill skill = new Skill();
        skill.setTitle(title);
        skill.setDescription(description);
        skill.setLikes(likes);
        skill.setUserId(userId);

        // Check if the image file is provided and non-empty
        if (image!= null && !image.isEmpty()) {
            // Save the image as a byte array
            byte[] imageBytes = image.getBytes();
            skill.setImage(imageBytes);
            System.out.println("Image size: " + imageBytes.length);  // Debug: print image size
        } else {
            System.out.println("No image file provided.");
        }

        // Save the skill in the repository
        Skill savedSkill = skillRepository.save(skill);

        // Add the skill to the user's collection
        userRepository.findById(userId).ifPresent(user -> {
            user.getSkills().add(savedSkill);  // Add the new skill to the user's skill list
            userRepository.save(user);         // Save the updated user
        });

        return savedSkill;
    }


    // Retrieve a skill by ID
    public Optional<Skill> getSkillById(String id) {
        return skillRepository.findById(id);
    }

    // Retrieve all skills
    public Iterable<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    // Delete a skill by ID and remove it from the user's collection
    public void deleteSkill(String skillId, String userId) {
        // First, find the skill by ID
        Optional<Skill> skillOptional = skillRepository.findById(skillId);

        if (skillOptional.isPresent()) {
            Skill skill = skillOptional.get();

            // Remove the skill from the user's skill list
            userRepository.findById(userId).ifPresent(user -> {
                user.getSkills().removeIf(s -> s.getId().equals(skillId));  // Remove skill by its ID from the user's skill list
                userRepository.save(user);  // Save the updated user
                System.out.println("Skill removed from user's skill list.");
            });

            // Now, delete the skill from the Skill repository
            skillRepository.delete(skill);
            System.out.println("Skill deleted from repository.");
        } else {
            System.out.println("Skill not found with ID: " + skillId);
        }
    }



    // Update a skill (including the image if provided)
    public Skill updateSkill(String id, String title, String description, MultipartFile imageFile, int likes, String userId) throws IOException {
        Optional<Skill> existingSkillOptional = skillRepository.findById(id);
        if (existingSkillOptional.isPresent()) {
            Skill existingSkill = existingSkillOptional.get();
            existingSkill.setTitle(title);
            existingSkill.setDescription(description);
            existingSkill.setLikes(likes);
            existingSkill.setUserId(userId);

            if (imageFile != null && !imageFile.isEmpty()) {
                existingSkill.setImage(imageFile.getBytes());
            }

            return skillRepository.save(existingSkill);
        } else {
            throw new IllegalArgumentException("Skill not found with ID: " + id);
        }
    }
}
