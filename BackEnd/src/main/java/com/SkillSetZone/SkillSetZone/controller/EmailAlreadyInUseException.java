package com.SkillSetZone.SkillSetZone.controller;

import com.SkillSetZone.SkillSetZone.Entity.Community;
import com.SkillSetZone.SkillSetZone.Entity.Message;
import com.SkillSetZone.SkillSetZone.Service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public class EmailAlreadyInUseException extends RuntimeException {
    public EmailAlreadyInUseException(String message) {
        super(message);
    }

    @RestController
    @RequestMapping("/api/communities")
    @CrossOrigin(origins = "*")
    public static class CommunityController {
        @Autowired
        private CommunityService communityService;

        @GetMapping
        public List<Community> getAllCommunities() {
            return communityService.getAllCommunities();
        }

        @PostMapping
        public Community createCommunity(@RequestBody Community community) {
            return communityService.createCommunity(community);
        }

        @PostMapping("/{communityId}/join")
        public void joinCommunity(@PathVariable Long communityId, @RequestParam String email) {
            communityService.joinCommunity(String.valueOf(communityId), email);
        }

        @GetMapping("/{communityId}/messages")
        public List<Message> getCommunityMessages(@PathVariable Long communityId) {
            return communityService.getCommunityMessages(String.valueOf(communityId));
        }
    }
}

