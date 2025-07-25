package com.Code.Spring_Boot_Library.Controllers;

import com.Code.Spring_Boot_Library.dao.MessageRepository;
import com.Code.Spring_Boot_Library.entity.Message;
import com.Code.Spring_Boot_Library.requestmodels.AdminQuestionRequest;
import com.Code.Spring_Boot_Library.service.MessageService;
import com.Code.Spring_Boot_Library.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private MessageService messageService;
    private JwtUtil jwtUtil;
    private MessageRepository messageRepository;

    @Autowired
    public MessageController(MessageService messageService, JwtUtil jwtUtil, MessageRepository messageRepository) {
        this.messageService = messageService;
        this.jwtUtil = jwtUtil;
        this.messageRepository = messageRepository;
    }





    @PostMapping("/secure/add/message")
    public void postMessage(@RequestHeader(value="Authorization") String token,
                            @RequestBody Message messageRequest){
        String userEmail= jwtUtil.extractEmail(token.substring(7));
        messageService.postMessage(messageRequest,userEmail);
    }
    @GetMapping("/secure/user/messages")
    public Page<Message> getUserMessages(
            @RequestHeader(value = "Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        String userEmail = jwtUtil.extractEmail(token.substring(7));
        return messageService.findMessagesByUserEmail(userEmail, PageRequest.of(page, size));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/secure/messages/closed")
    public ResponseEntity<Page<Message>> getClosedMessages(
            @RequestParam boolean closed,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messagesPage = messageRepository.findByClosed(closed, pageable);
        return ResponseEntity.ok(messagesPage);
    }

    @PutMapping("secure/admin/message")
    public void putMessage(@RequestHeader(value="Authorization") String token,
                           @RequestBody AdminQuestionRequest adminQuestionRequest)throws Exception{
        String userEmail= jwtUtil.extractEmail(token.substring(7));
        String admin = jwtUtil.extractRole(token.substring(7));

        messageService.putMessage(adminQuestionRequest,userEmail);
    }


}
