package com.SkillSetZone.SkillSetZone.Service;

import com.SkillSetZone.SkillSetZone.Entity.Skill;
import com.SkillSetZone.SkillSetZone.Entity.User;
import com.SkillSetZone.SkillSetZone.Repo.SkillRepository;
import com.SkillSetZone.SkillSetZone.Repo.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public SkillService(SkillRepository skillRepository, UserRepository userRepository) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }

    // Helper method to fetch the authenticated user
    private User getAuthenticatedUser() {
        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
    }

    // Save a new skill with an image and associate it with the authenticated user
    public Skill addSkill(String title, String description, MultipartFile image, int likes) throws IOException {
        User authenticatedUser = getAuthenticatedUser();

        // Create a new Skill object
        Skill skill = new Skill();
        skill.setTitle(title);
        skill.setDescription(description);
        skill.setLikes(likes);
        skill.setUserId(authenticatedUser.getId());

        // Check if the image file is provided and non-empty
        if (image != null && !image.isEmpty()) {
            byte[] imageBytes = image.getBytes();
            skill.setImage(imageBytes);
        }

        // Save the skill in the repository
        Skill savedSkill = skillRepository.save(skill);

        // Add the skill to the authenticated user's collection
        authenticatedUser.getSkills().add(savedSkill);
        userRepository.save(authenticatedUser);

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

    // Delete a skill by ID and remove it from the authenticated user's collection
    @Transactional
    public void deleteSkill(String skillId) {
        User authenticatedUser = getAuthenticatedUser();

        Optional<Skill> skillOptional = skillRepository.findById(skillId);

        if (skillOptional.isPresent()) {
            Skill skill = skillOptional.get();

            // Remove the skill from the user's skill list
            authenticatedUser.getSkills().removeIf(s -> s.getId().equals(skillId));

            // Save the updated user to persist the changes to their skill list
            userRepository.save(authenticatedUser);

            // Delete the skill from the Skill repository
            skillRepository.delete(skill);
        } else {
            throw new IllegalArgumentException("Skill not found with ID: " + skillId);
        }
    }

    // Update a skill (including the image if provided)
    public Skill updateSkill(String id, String title, String description, MultipartFile imageFile, int likes) throws IOException {
        User authenticatedUser = getAuthenticatedUser();

        Optional<Skill> existingSkillOptional = skillRepository.findById(id);
        if (existingSkillOptional.isPresent()) {
            Skill existingSkill = existingSkillOptional.get();

            // Ensure the skill belongs to the authenticated user
            if (!existingSkill.getUserId().equals(authenticatedUser.getId())) {
                throw new IllegalArgumentException("You are not authorized to update this skill");
            }

            existingSkill.setTitle(title);
            existingSkill.setDescription(description);
            existingSkill.setLikes(likes);

            if (imageFile != null && !imageFile.isEmpty()) {
                existingSkill.setImage(imageFile.getBytes());
            }

            return skillRepository.save(existingSkill);
        } else {
            throw new IllegalArgumentException("Skill not found with ID: " + id);
        }
    }
}
