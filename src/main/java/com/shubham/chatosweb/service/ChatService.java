package com.shubham.chatosweb.service;

import com.shubham.chatosweb.exception.ChatException;
import com.shubham.chatosweb.exception.UserException;
import com.shubham.chatosweb.model.Chat;
import com.shubham.chatosweb.model.User;
import com.shubham.chatosweb.request.GroupChatRequest;

import java.util.List;


public interface ChatService {

    public Chat createChat(User reqUser, Integer userId2) throws UserException;

    public Chat findChatByUserId(Integer chatId) throws ChatException;

    public List<Chat> findAllChatByUserId(Integer userId) throws UserException;


    public Chat createGroup(GroupChatRequest req,User reqUser) throws UserException;

    public Chat addUserToGroup(Integer userId, Integer chatId,User reqUser) throws UserException,ChatException;

    public Chat renameGroup(Integer chatId,String groupName,User reqUser) throws ChatException,UserException;

    public Chat removeFromGroup(Integer chatId,Integer userId,User reqUser) throws ChatException,UserException;

    public Chat deleteChat(Integer chatId, Integer userId) throws ChatException,UserException;



}
