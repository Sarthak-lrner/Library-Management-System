package com.Code.Spring_Boot_Library.service;

import com.Code.Spring_Boot_Library.dao.UserRepository;
import com.Code.Spring_Boot_Library.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Add ROLE_ prefix as Spring Security expects roles in the format ROLE_*
        String roleWithPrefix = "ROLE_" + user.getRole().toUpperCase();

        List<SimpleGrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority(roleWithPrefix)
        );

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
}
