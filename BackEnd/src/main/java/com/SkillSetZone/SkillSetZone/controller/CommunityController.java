package com.SkillSetZone.SkillSetZone.controller;

import com.SkillSetZone.SkillSetZone.Entity.Community;
import com.SkillSetZone.SkillSetZone.Entity.Message;
import com.SkillSetZone.SkillSetZone.Service.CommunityService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/community")
@CrossOrigin(origins = "*")
public class CommunityController {
    private static final Logger logger = LoggerFactory.getLogger(CommunityController.class);

    @Autowired
    private CommunityService communityService;

    @GetMapping("/all")
    public ResponseEntity<List<Community>> getAllCommunities() {
        logger.info("Fetching all communities");
        return ResponseEntity.ok(communityService.getAllCommunities());
    }

    @PostMapping("/create")
    public ResponseEntity<Community> createCommunity(@RequestBody Community community) {
        logger.info("Creating new community: {}", community.getName());
        return ResponseEntity.ok(communityService.createCommunity(community));
    }

    @PostMapping("/join/{communityId}")
    public ResponseEntity<Community> joinCommunity(
            @PathVariable String communityId,
            @RequestBody Map<String, String> payload) {
        logger.info("User {} joining community {}", payload.get("userId"), communityId);
        String userId = payload.get("userId");
        Community community = communityService.joinCommunity(communityId, userId);
        if (community != null) {
            return ResponseEntity.ok(community);
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/messages/{communityId}")
    public ResponseEntity<List<Message>> getCommunityMessages(@PathVariable String communityId) {
        logger.info("Fetching messages for community {}", communityId);
        return ResponseEntity.ok(communityService.getCommunityMessages(communityId));
    }

    @PostMapping("/message")
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        logger.info("Sending message in community {} from user {}", message.getCommunityId(), message.getSender());
        String userId = message.getSender();
        String communityId = message.getCommunityId();

        // Check if user is a member of the community
        if (communityService.isUserMember(communityId, userId)) {
            return ResponseEntity.ok(communityService.sendMessage(message));
        }

        return ResponseEntity.status(403).build(); // Forbidden if not a member
    }

    @GetMapping("/{id}")
    public ResponseEntity<Community> getCommunityById(@PathVariable String id) {
        logger.info("Fetching community with id {}", id);
        return communityService.getCommunityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{communityId}")
    public ResponseEntity<Void> deleteCommunity(
            @PathVariable String communityId,
            @RequestParam String userId) {
        logger.info("Attempting to delete community {} by user {}", communityId, userId);
        boolean deleted = communityService.deleteCommunity(communityId, userId);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(403).build(); // Forbidden if not the creator
    }

    @PostMapping("/leave/{communityId}")
    public ResponseEntity<Community> leaveCommunity(
            @PathVariable String communityId,
            @RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        logger.info("User {} leaving community {}", userId, communityId);
        Community community = communityService.leaveCommunity(communityId, userId);
        if (community != null) {
            return ResponseEntity.ok(community);
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/is-member/{communityId}/{userId}")
    public ResponseEntity<Boolean> isUserMember(
            @PathVariable String communityId,
            @PathVariable String userId) {
        boolean isMember = communityService.isUserMember(communityId, userId);
        return ResponseEntity.ok(isMember);
    }
}