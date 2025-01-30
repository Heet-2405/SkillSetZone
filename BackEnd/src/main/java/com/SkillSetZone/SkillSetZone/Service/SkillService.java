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
import java.util.*;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public SkillService(SkillRepository skillRepository, UserRepository userRepository) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }

    private String getAuthenticatedEmail() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getUsername();
    }

    public Skill addSkill(String title, String description, MultipartFile image, int likes) throws IOException {
        String email = getAuthenticatedEmail();
        Skill skill = new Skill();
        skill.setTitle(title);
        skill.setDescription(description);
        skill.setLikes(likes);
        skill.setEmail(email);

        if (image != null && !image.isEmpty()) {
            skill.setImage(image.getBytes());
        }

        return skillRepository.save(skill);
    }

    public Optional<Skill> getSkillById(String id) {
        return skillRepository.findById(id);
    }

    public List<Skill> getAllSkillsForUser() {
        String email = getAuthenticatedEmail();
        return skillRepository.findAllByEmail(email);
    }

    @Transactional
    public void deleteSkill(String skillId) {
        String email = getAuthenticatedEmail();
        Optional<Skill> skill = skillRepository.findById(skillId);

        if (skill.isPresent() && skill.get().getEmail().equals(email)) {
            skillRepository.delete(skill.get());
        } else {
            throw new IllegalArgumentException("Skill not found or you are not authorized to delete it.");
        }
    }

    public Skill updateSkill(String id, String title, String description, MultipartFile image, int likes) throws IOException {
        String email = getAuthenticatedEmail();
        Optional<Skill> skillOptional = skillRepository.findById(id);

        if (skillOptional.isPresent()) {
            Skill skill = skillOptional.get();
            if (!skill.getEmail().equals(email)) {
                throw new IllegalArgumentException("Unauthorized to update this skill.");
            }

            skill.setTitle(title);
            skill.setDescription(description);
            skill.setLikes(likes);

            if (image != null && !image.isEmpty()) {
                skill.setImage(image.getBytes());
            }

            return skillRepository.save(skill);
        } else {
            throw new IllegalArgumentException("Skill not found.");
        }
    }
    public List<Map<String, Object>> getAllSkills() {
        List<Skill> skills = skillRepository.findAll();
        List<Map<String, Object>> response = new ArrayList<>();

        for (Skill skill : skills) {
            Optional<User> user = userRepository.findByEmail(skill.getEmail()); // Fetch user by email
            String username = (user.isPresent()) ? user.get().getName() : "Unknown"; // Get username

            Map<String, Object> skillData = new HashMap<>();
            skillData.put("id", skill.getId());
            skillData.put("title", skill.getTitle());
            skillData.put("description", skill.getDescription());
            skillData.put("likes", skill.getLikes());
            skillData.put("username", username); // Replace email with username
            skillData.put("image", skill.getImage()); // Ensure image is handled properly

            response.add(skillData);
        }

        return response;
    }




}
