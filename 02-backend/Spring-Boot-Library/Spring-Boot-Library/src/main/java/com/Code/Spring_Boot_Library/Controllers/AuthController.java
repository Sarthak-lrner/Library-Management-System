package com.Code.Spring_Boot_Library.Controllers;

import com.Code.Spring_Boot_Library.dao.UserRepository;
import com.Code.Spring_Boot_Library.entity.User;
import com.Code.Spring_Boot_Library.util.JwtUtil;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin("https://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Account already exists"));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        UserDto userDto = new UserDto(user.getEmail(), user.getRole());
        AuthResponse authResponse = new AuthResponse(accessToken, refreshToken, userDto);

        return ResponseEntity.ok(authResponse);
    }


    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken == null || !jwtUtil.validateRefreshToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }

        String email = jwtUtil.extractEmail(refreshToken);

        // Optional: check if refresh token is revoked/blacklisted here (see Token Revocation below)

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        String newAccessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getRole());
        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    }
}

@Data
class AuthRequest {
    private String email;
    private String password;
}
@Data
@AllArgsConstructor
@NoArgsConstructor
class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private UserDto user;

    // constructors, getters, setters
}
@Data
@AllArgsConstructor
@NoArgsConstructor
class UserDto {
    private String email;
    private String role;

    // constructors, getters, setters
}


