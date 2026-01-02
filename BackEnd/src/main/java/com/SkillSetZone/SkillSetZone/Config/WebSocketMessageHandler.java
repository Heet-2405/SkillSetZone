package com.SkillSetZone.SkillSetZone.Config;

import com.SkillSetZone.SkillSetZone.Entity.Message;
import com.SkillSetZone.SkillSetZone.Service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Controller
public class WebSocketMessageHandler {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketMessageHandler.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private CommunityService communityService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload Message message) {
        logger.info("Received message: {} from user: {} in community: {}",
                message.getContent(), message.getSender(), message.getCommunityId());

        // Save the message using the service
        Message savedMessage = communityService.saveMessage(message);

        // Broadcast the message to all subscribers of the community
        messagingTemplate.convertAndSend(
                "/topic/community." + message.getCommunityId(),
                savedMessage);
    }

    @MessageMapping("/chat.addUser")
    public void addUser(@Payload Message message, SimpMessageHeaderAccessor headerAccessor) {
        logger.info("User {} joining community {}", message.getSender(), message.getCommunityId());

        // Add username in web socket session
        headerAccessor.getSessionAttributes().put("username", message.getSender());

        // Notify all users in the community about the new member
        messagingTemplate.convertAndSend(
                "/topic/community." + message.getCommunityId() + ".members",
                message.getSender() + " joined the community");
    }
}