package com.shubham.chatosweb.controller;

import com.shubham.chatosweb.exception.ChatException;
import com.shubham.chatosweb.exception.MessageException;
import com.shubham.chatosweb.exception.UserException;
import com.shubham.chatosweb.model.Message;
import com.shubham.chatosweb.model.User;
import com.shubham.chatosweb.request.SendmessageRequest;
import com.shubham.chatosweb.response.ApiResponse;
import com.shubham.chatosweb.service.MessageService;
import com.shubham.chatosweb.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("/api/messages")
public class MessageController {

    private MessageService messageService;
    private UserService userService;

    public MessageController(MessageService messageService, UserService userService) {
        this.messageService = messageService;
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<Message> sendMessageHandler(@RequestBody SendmessageRequest req, @RequestHeader("Authorization") String jwt) throws UserException, ChatException {
        User user=userService.findUserProfile(jwt);
        req.setUserId(user.getId());

        Message message=messageService.sendMessage(req);

        return new ResponseEntity<Message>(message, HttpStatus.OK);
    }

    @GetMapping("/chat/{chatID}")
    public ResponseEntity<List<Message>> getChatsMessageHandler(@PathVariable Integer chatId, @RequestHeader("Authorization") String jwt) throws UserException, ChatException {
        User user=userService.findUserProfile(jwt);


        List<Message> messages=messageService.getChatsMessages(chatId,user);

        return new ResponseEntity<List<Message>>(messages, HttpStatus.OK);
    }


    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResponse> deleteMessageHandler(@PathVariable Integer messageId, @RequestHeader("Authorization") String jwt) throws UserException, MessageException {
        User user=userService.findUserProfile(jwt);

        messageService.deleteMessage(messageId,user);
        ApiResponse res=new ApiResponse("Message Deleted Successfully",true);



        return new ResponseEntity<>(res, HttpStatus.OK);
    }


}
