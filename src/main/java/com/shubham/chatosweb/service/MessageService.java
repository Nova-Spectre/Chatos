package com.shubham.chatosweb.service;

import com.shubham.chatosweb.exception.ChatException;
import com.shubham.chatosweb.exception.MessageException;
import com.shubham.chatosweb.exception.UserException;
import com.shubham.chatosweb.model.Message;
import com.shubham.chatosweb.model.User;
import com.shubham.chatosweb.request.SendmessageRequest;

import java.util.List;

public interface MessageService {

    public Message sendMessage(SendmessageRequest req) throws UserException, ChatException;

    public List<Message> getChatsMessages(Integer chatId, User reqUser) throws ChatException, UserException;

    public Message findMessageById(Integer messageId) throws MessageException;

    public void deleteMessage(Integer messageId,User reqUser) throws MessageException, UserException;
}
