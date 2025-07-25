package com.Code.Spring_Boot_Library.Controllers;

import com.Code.Spring_Boot_Library.dao.HistoryRepository;
import com.Code.Spring_Boot_Library.entity.History;
import com.Code.Spring_Boot_Library.service.HistoryService;
import com.Code.Spring_Boot_Library.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/histories")
@CrossOrigin("https://localhost:3000")
public class HistoryController {

    @Autowired
    private HistoryService historyService;

    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/secure/user")
    public ResponseEntity<Page<History>> getUserHistory(
            @RequestHeader(value = "Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        String userEmail = jwtUtil.extractEmail(token.substring(7));
        Pageable pageable = PageRequest.of(page, size);
        Page<History> historyPage = historyRepository.findBooksByUserEmail(userEmail, pageable);
        return ResponseEntity.ok(historyPage);
    }

}
