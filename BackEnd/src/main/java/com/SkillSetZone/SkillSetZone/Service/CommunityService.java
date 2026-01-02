package com.SkillSetZone.SkillSetZone.Service;

import com.SkillSetZone.SkillSetZone.Entity.Community;
import com.SkillSetZone.SkillSetZone.Entity.Message;
import com.SkillSetZone.SkillSetZone.Repo.CommunityRepository;
import com.SkillSetZone.SkillSetZone.Repo.MessageRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommunityService {

    @Autowired
    private CommunityRepository communityRepository;

    @Autowired
    private MessageRepository messageRepository;

    public List<Community> getAllCommunities() {
        return communityRepository.findAll();
    }

    public Community createCommunity(Community community) {
        return communityRepository.save(community);
    }

    public Community joinCommunity(String communityId, String userId) {
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        if (communityOpt.isPresent()) {
            Community community = communityOpt.get();
            if (!community.getMembers().contains(userId)) {
                community.getMembers().add(userId);
                return communityRepository.save(community);
            }
        }
        return null;
    }

    public List<Message> getCommunityMessages(String communityId) {
        return messageRepository.findByCommunityIdOrderByTimestampDesc(communityId);
    }

    public Message sendMessage(Message message) {
        return messageRepository.save(message);
    }

    public Optional<Community> getCommunityById(String id) {
        return communityRepository.findById(id);
    }

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    public boolean deleteCommunity(String communityId, String userId) {
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        if (communityOpt.isPresent()) {
            Community community = communityOpt.get();
            if (community.getCreatedBy().equals(userId)) {
                // Delete all messages associated with this community
                messageRepository.deleteByCommunityId(communityId);
                // Delete the community
                communityRepository.deleteById(communityId);
                return true;
            }
        }
        return false;
    }

    public Community leaveCommunity(String communityId, String userId) {
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        if (communityOpt.isPresent()) {
            Community community = communityOpt.get();
            if (community.getMembers().contains(userId)) {
                community.getMembers().remove(userId);
                return communityRepository.save(community);
            }
        }
        return null;
    }

    public boolean isUserMember(String communityId, String userId) {
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        if (communityOpt.isPresent()) {
            Community community = communityOpt.get();
            return community.getMembers().contains(userId);
        }
        return false;
    }
}