package com.Code.Spring_Boot_Library.service;

import com.Code.Spring_Boot_Library.dao.MessageRepository;
import com.Code.Spring_Boot_Library.entity.Message;
import com.Code.Spring_Boot_Library.requestmodels.AdminQuestionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
@Transactional
public class MessageService {

    private MessageRepository messageRepository;

    @Autowired

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public  void postMessage(Message messageRequest,String userEmail){
        Message message =new Message(messageRequest.getTitle(), messageRequest.getQuestion());
        message.setUserEmail(userEmail);
        messageRepository.save(message);
    }

    public Page<Message> findMessagesByUserEmail(String email, Pageable pageable) {
        return messageRepository.findByUserEmail(email, pageable);
    }

    public void putMessage(AdminQuestionRequest adminQuestionRequest,String userEmail) throws Exception{
        Optional<Message> message=messageRepository.findById(adminQuestionRequest.getId());
        if(!message.isPresent()){
            throw new Exception("Message not found");
        }
        message.get().setAdminEmail(userEmail);
        message.get().setResponse(adminQuestionRequest.getResponse());
        message.get().setClosed(true);
        messageRepository.save(message.get());
    }

}
