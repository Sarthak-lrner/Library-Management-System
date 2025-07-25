package com.Code.Spring_Boot_Library.Controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin("https://localhost:3000")
public class ProtectedController {

    @GetMapping("/protected")
    public String protectedEndpoint() {
        return "You have accessed a protected resource!";
    }
}

