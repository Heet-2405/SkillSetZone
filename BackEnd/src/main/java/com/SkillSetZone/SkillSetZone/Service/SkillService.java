package com.SkillSetZone.SkillSetZone.Service;

import com.SkillSetZone.SkillSetZone.Entity.Skill;
import com.SkillSetZone.SkillSetZone.Entity.User;
import com.SkillSetZone.SkillSetZone.Entity.UserLikesSkill;
import com.SkillSetZone.SkillSetZone.Repo.SkillRepository;
import com.SkillSetZone.SkillSetZone.Repo.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.SkillSetZone.SkillSetZone.Repo.UserLikesSkillRepository;
import java.io.IOException;
import java.util.*;



@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final UserLikesSkillRepository userLikesSkillRepository;
    public SkillService(SkillRepository skillRepository, UserRepository userRepository, UserLikesSkillRepository userLikesSkillRepository) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.userLikesSkillRepository = userLikesSkillRepository;
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
            String username = user.map(User::getName).orElse("Unknown"); // Get username
            byte[] profileImage = user.map(User::getImage).orElse(null); // Get profile image

            Map<String, Object> skillData = new HashMap<>();
            skillData.put("id", skill.getId());
            skillData.put("title", skill.getTitle());
            skillData.put("description", skill.getDescription());
            skillData.put("likes", skill.getLikes());
            skillData.put("username", username); // Replace email with username
            skillData.put("image", skill.getImage() != null ? Base64.getEncoder().encodeToString(skill.getImage()) : null);
            skillData.put("profileImage", profileImage != null ? Base64.getEncoder().encodeToString(profileImage) : null); // Convert profile image
            skillData.put("email",user.get().getEmail());
            response.add(skillData);
        }

        return response;
    }


    @Transactional
    public Map<String, Object> toggleLikeStatus(String skillId, String email) {
        Optional<Skill> skillOptional = skillRepository.findById(skillId);
        if (!skillOptional.isPresent()) {
            throw new RuntimeException("Skill not found");
        }

        Skill skill = skillOptional.get();
        Optional<UserLikesSkill> userLike = userLikesSkillRepository.findByUserEmailAndSkillId(email, skillId);

        Map<String, Object> response = new HashMap<>();
        if (userLike.isPresent()) {
            // User has already liked, so decrease like count and remove the like entry
            skill.setLikes(skill.getLikes() - 1);
            userLikesSkillRepository.delete(userLike.get());
            response.put("hasLiked", false);
        } else {
            // User has not liked yet, so increase like count and save the like entry
            skill.setLikes(skill.getLikes() + 1);
            userLikesSkillRepository.save(new UserLikesSkill(email, skillId));
            response.put("hasLiked", true);
        }

        skillRepository.save(skill);
        response.put("likes", skill.getLikes());
        return response;
    }

    public List<Map<String, Object>> searchSkillsByTitle(String title) {
        List<Skill> skills = skillRepository.findByTitleContainingIgnoreCase(title);
        List<Map<String, Object>> response = new ArrayList<>();

        for (Skill skill : skills) {
            Optional<User> user = userRepository.findByEmail(skill.getEmail());
            String username = user.map(User::getName).orElse("Unknown");
            byte[] profileImage = user.map(User::getImage).orElse(null);

            Map<String, Object> skillData = new HashMap<>();
            skillData.put("id", skill.getId());
            skillData.put("title", skill.getTitle());
            skillData.put("description", skill.getDescription());
            skillData.put("likes", skill.getLikes());
            skillData.put("username", username);
            skillData.put("image", skill.getImage() != null ? Base64.getEncoder().encodeToString(skill.getImage()) : null);
            skillData.put("profileImage", profileImage != null ? Base64.getEncoder().encodeToString(profileImage) : null);
            skillData.put("email", user.get().getEmail());
            response.add(skillData);
        }
        return response;
    }






}
