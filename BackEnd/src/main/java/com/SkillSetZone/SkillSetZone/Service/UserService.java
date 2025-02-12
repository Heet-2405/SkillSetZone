package com.SkillSetZone.SkillSetZone.Service;

import com.SkillSetZone.SkillSetZone.DTO.LoginRequest;
import com.SkillSetZone.SkillSetZone.Entity.User;
import com.SkillSetZone.SkillSetZone.Repo.UserRepository;
import com.SkillSetZone.SkillSetZone.controller.AuthenticationFailedException;
import com.SkillSetZone.SkillSetZone.controller.EmailAlreadyInUseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new EmailAlreadyInUseException("Email is already in use.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Image is optional, if null, do nothing
        if (user.getImage() == null) {
            user.setImage(null);
        }

        return userRepository.save(user);
    }

    public User authenticateUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new AuthenticationFailedException("Invalid email or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new AuthenticationFailedException("Invalid email or password");
        }

        return user;
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + id + " not found"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    private String getAuthenticatedEmail() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getUsername();
    }

    public User getUserDetail(){
        String email = getAuthenticatedEmail();
        Optional<User> user = userRepository.findByEmail(email);
        return user.orElseThrow(() -> new IllegalArgumentException("User with email " + email + " not found"));
    }

    public User updateUser(String name, String email, String password, String branch, MultipartFile image) {
        String currentEmail = getAuthenticatedEmail();
        Optional<User> userOptional = userRepository.findByEmail(currentEmail);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Update only provided fields
            if (name != null && !name.isEmpty()) user.setName(name);
            if (email != null && !email.isEmpty()) user.setEmail(email);
            if (password != null && !password.isEmpty()) user.setPassword(passwordEncoder.encode(password)); // Hash password
            if (branch != null && !branch.isEmpty()) user.setCollegeBranch(branch);

            if (image != null && !image.isEmpty()) {
                try {
                    user.setImage(image.getBytes()); // Convert image to byte array
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            return userRepository.save(user);
        }
        return null;
    }
}
