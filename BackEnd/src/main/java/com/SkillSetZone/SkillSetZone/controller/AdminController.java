package com.SkillSetZone.SkillSetZone.controller;

import com.SkillSetZone.SkillSetZone.Entity.TopSkill;
import com.SkillSetZone.SkillSetZone.Entity.User;
import com.SkillSetZone.SkillSetZone.Service.SkillService;
import com.SkillSetZone.SkillSetZone.Service.TopSkillService;
import com.SkillSetZone.SkillSetZone.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final TopSkillService topSkillService;
    private final UserService userService;
    private final SkillService skillService;

    @Autowired
    public AdminController(TopSkillService topSkillService, UserService userService, SkillService skillService) {
        this.topSkillService = topSkillService;
        this.userService = userService;
        this.skillService = skillService;
    }

    //Top Skill Management
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

    // Users Management

    @GetMapping("/all-users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @DeleteMapping("/user/delete/{id}")
    public User deleteUser(@PathVariable String id) {
        return userService.deleteUserById(id);
    }

    @GetMapping("/userProfile/{name}")
    public Map<String, Object> getUserDetails(@PathVariable String name) {
        return userService.getUserProfile(name);
    }


}