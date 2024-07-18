package com.shubham.chatosweb.controller;

import com.shubham.chatosweb.exception.ChatException;
import com.shubham.chatosweb.exception.UserException;
import com.shubham.chatosweb.model.User;
import com.shubham.chatosweb.model.Chat;
import com.shubham.chatosweb.request.GroupChatRequest;
import com.shubham.chatosweb.request.SingleChatRequest;
import com.shubham.chatosweb.response.ApiResponse;
import com.shubham.chatosweb.service.ChatService;
import com.shubham.chatosweb.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    private ChatService chatService;
    private UserService userService;


    public ChatController(ChatService chatService, UserService userService) {
        this.chatService = chatService;
        this.userService = userService;
    }


    @PostMapping("/single")
    public ResponseEntity<Chat> createChatHandler(@RequestBody SingleChatRequest singleChatRequest, @RequestHeader("Authorization") String jwt) throws UserException {
        User reqUser=userService.findUserProfile(jwt);

        Chat chat=chatService.createChat(reqUser, singleChatRequest.getUserId());

        return new ResponseEntity<Chat>(chat, HttpStatus.OK);
    }

    @PostMapping("/group")
    public ResponseEntity<Chat> createGroupHandler(@RequestBody GroupChatRequest req, @RequestHeader("Authorization") String jwt) throws UserException {
        User reqUser=userService.findUserProfile(jwt);

        Chat chat=chatService.createGroup(req,reqUser);

        return new ResponseEntity<Chat>(chat, HttpStatus.OK);
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<Chat> findChatByIdHandler(@PathVariable Integer chatId,@RequestHeader("Authorization") String jwt) throws UserException, ChatException {


        Chat chat=chatService.findChatByUserId(chatId);

        return new ResponseEntity<Chat>(chat, HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Chat>> findAllChatByIdHandler(@RequestHeader("Authorization") String jwt) throws UserException, ChatException {

        User reqUser=userService.findUserProfile(jwt);
        List<Chat> chats=chatService.findAllChatByUserId(reqUser.getId());

        return new ResponseEntity<List<Chat>>(chats, HttpStatus.OK);
    }

    @PutMapping("/{chatId}/add/{userId}")
    public ResponseEntity<Chat> addUsertoGroup(@PathVariable Integer chatId,@PathVariable Integer userId,@RequestHeader("Authorization") String jwt) throws UserException, ChatException {

        User reqUser=userService.findUserProfile(jwt);
        Chat chat=chatService.addUserToGroup(userId,chatId,reqUser);

        return new ResponseEntity<Chat>(chat, HttpStatus.OK);
    }

    @PutMapping("/{chatId}/remove/{userId}")
    public ResponseEntity<Chat> RemoveUsertoGroup(@PathVariable Integer chatId,@PathVariable Integer userId,@RequestHeader("Authorization") String jwt) throws UserException, ChatException {

        User reqUser=userService.findUserProfile(jwt);
        Chat chat=chatService.removeFromGroup(chatId,userId,reqUser);

        return new ResponseEntity<Chat>(chat, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{chatId}")
    public ResponseEntity<ApiResponse> deleteChatHandler(@PathVariable Integer chatId, @RequestHeader("Authorization") String jwt) throws UserException, ChatException {

        User reqUser=userService.findUserProfile(jwt);
        Chat chat=chatService.deleteChat(chatId, reqUser.getId());

        ApiResponse res=new ApiResponse("Chat is deleted successfully",true);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }




}
