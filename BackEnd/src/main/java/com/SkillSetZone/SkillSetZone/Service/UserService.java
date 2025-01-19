package com.SkillSetZone.SkillSetZone.Service;

import com.SkillSetZone.SkillSetZone.DTO.LoginRequest;
import com.SkillSetZone.SkillSetZone.Entity.User;
import com.SkillSetZone.SkillSetZone.Repo.UserRepository;
import com.SkillSetZone.SkillSetZone.controller.AuthenticationFailedException;
import com.SkillSetZone.SkillSetZone.controller.EmailAlreadyInUseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public UserService(UserRepository userRepository, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
    }

    // Sign-up logic
    public User createUser(User user) {
        // Check if the email is already in use
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new EmailAlreadyInUseException("Email is already in use");
        }

        // Check if the password meets complexity requirements (assuming a PasswordValidator exists)
        if (!PasswordValidator.isValid(user.getPassword())) {
            throw new IllegalArgumentException("Password does not meet complexity requirements");
        }

        // Encrypt the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save the user to the repository and return the saved user
        return userRepository.save(user);
    }

    // Authentication logic for login
    public User authenticateUser(LoginRequest loginRequest) {
        // Find user by email
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new AuthenticationFailedException("Invalid email or password"));

        // Check if the password matches the stored encrypted password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new AuthenticationFailedException("Invalid email or password");
        }

        return user;
    }

    // Fetch user by ID
    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + id + " not found"));
    }

    // Fetch all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Check if email already exists
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    // This method is used to check if the email is already in use
    public boolean isEmailAlreadyInUse(String email) {
        // Use findByEmail and check if the user already exists with the given email
        Optional<User> existingUser = userRepository.findByEmail(email);

        // Return true if the email exists, otherwise false
        return existingUser.isPresent();
    }
}
