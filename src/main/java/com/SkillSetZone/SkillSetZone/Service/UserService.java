package com.SkillSetZone.SkillSetZone.Service;

import com.SkillSetZone.SkillSetZone.Entity.User;
import com.SkillSetZone.SkillSetZone.Repo.UserRepository;
import com.SkillSetZone.SkillSetZone.controller.EmailAlreadyInUseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    public static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public UserService(UserRepository userRepository, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
    }

    // Sign-up logic
    public User createUser(User user) {
        // Check if the email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new EmailAlreadyInUseException("Email is already in use");
        }

        // Hash the password before saving
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword); // Set the hashed password to user

        // Save user if email doesn't exist and password is hashed
        return userRepository.save(user);
    }

    // Authentication logic for login
    public Authentication authenticateUser(String email, String password) {
        return authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
