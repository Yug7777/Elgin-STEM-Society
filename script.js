package com.elginstem.society;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allows requests from your HTML/JS frontend
public class SignupController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/signup")
    public String handleSignup(@RequestBody SignupRequest request) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom("mahadikkrishivs@gmail.com");
            
            // Sends the submission notification to BOTH email addresses
            mailMessage.setTo("mahadikkrishivs@gmail.com", "shankarnoone@gmail.com");
            
            mailMessage.setSubject("New Elgin STEM Society Sign-Up: " + request.getName());
            
            String body = String.format(
                "You have received a new registration for Elgin STEM Society!\n\n" +
                "Name: %s\n" +
                "Email: %s\n" +
                "Role Interest: %s\n" +
                "Additional Message: %s\n",
                request.getName(),
                request.getEmail(),
                request.getRole(),
                (request.getMessage() != null && !request.getMessage().trim().isEmpty()) 
                    ? request.getMessage() 
                    : "None"
            );

            mailMessage.setText(body);
            mailSender.send(mailMessage);

            return "Registration successful!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to send registration email: " + e.getMessage();
        }
    }
}