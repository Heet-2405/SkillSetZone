package com.SkillSetZone.SkillSetZone.Service;

public class PasswordValidator {

    public static boolean isValid(String password) {
        // Relaxed validation: minimum 6 characters, no special requirements for case or digits
        if (password.length() < 6) {
            return false; // Password must be at least 6 characters long
        }

        // You can remove these checks if you want passwords without digits or uppercase
        // Check for at least one digit (optional)
        boolean hasDigit = false;
        for (char c : password.toCharArray()) {
            if (Character.isDigit(c)) {
                hasDigit = true;
                break; // Stop checking once we find a digit
            }
        }

        return hasDigit || password.length() >= 6; // Allow passwords with no digit if length is >= 6
    }
}
