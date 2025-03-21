package com.SkillSetZone.SkillSetZone.controller;

import com.SkillSetZone.SkillSetZone.Entity.TopSkill;
import com.SkillSetZone.SkillSetZone.Entity.User;
import com.SkillSetZone.SkillSetZone.Repo.SkillRepository;
import com.SkillSetZone.SkillSetZone.Repo.UserRepository;
import com.SkillSetZone.SkillSetZone.Service.TopSkillService;
import com.SkillSetZone.SkillSetZone.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class TopSkillController {

    private final TopSkillService topSkillService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    @Autowired
    public TopSkillController(TopSkillService topSkillService, UserService userService, UserRepository userRepository, SkillRepository skillRepository) {
        this.topSkillService = topSkillService;
        this.userService = userService;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
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

    @GetMapping("/all-users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @DeleteMapping("/user/delete/{id}")
    public void deleteUser(@PathVariable("id") String id) {
        User user = userService.getUserById(id);
        String email = user.getEmail();
        skillRepository.deleteByEmail(email);
        userRepository.delete(user);
    }

    @GetMapping("/userProfile/{userName}")
    public Map<String, Object> getUserProfile(@PathVariable("userName") String userName) {
        return userService.getUserProfile(userName);
    }

}
