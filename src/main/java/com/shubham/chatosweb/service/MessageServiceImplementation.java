package com.shubham.chatosweb.service;

import com.shubham.chatosweb.exception.ChatException;
import com.shubham.chatosweb.exception.MessageException;
import com.shubham.chatosweb.exception.UserException;
import com.shubham.chatosweb.model.Chat;
import com.shubham.chatosweb.model.Message;
import com.shubham.chatosweb.model.User;
import com.shubham.chatosweb.repository.MessageRepository;
import com.shubham.chatosweb.request.SendmessageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MessageServiceImplementation implements MessageService{

    private MessageRepository messageRepository;
    private UserService userService;
    private ChatService chatService;

    public MessageServiceImplementation(MessageRepository messageRepository, UserService userService, ChatService chatService) {
        this.messageRepository = messageRepository;
        this.userService = userService;
        this.chatService = chatService;
    }

    @Override
    public Message sendMessage(SendmessageRequest req) throws UserException, ChatException {

        User user=userService.findUserByID(req.getUserId());
        Chat chat=chatService.findChatByUserId(req.getChatId());

        Message message=new Message();
        message.setChat(chat);
        message.setUser(user);
        message.setContent(req.getContent());
        message.setTimestamp(LocalDateTime.now());
        return message;
    }

    @Override
    public List<Message> getChatsMessages(Integer chatId,User reqUser) throws ChatException, UserException {
        Chat chat=chatService.findChatByUserId(chatId);

        if(!chat.getUsers().contains(reqUser)){
            throw new UserException("You are not related to this chat"+chat.getId());
        };


        List<Message> messages=messageRepository.findByChatId(chatId);
        return messages;
    }

    @Override
    public Message findMessageById(Integer messageId) throws MessageException {

        Optional<Message> opt=messageRepository.findById(messageId);

        if(opt.isPresent()){
            return opt.get();
        }
        throw new MessageException("Message not found"+messageId);
    }

    @Override
    public void deleteMessage(Integer messageId,User reqUser) throws MessageException, UserException {



        Message message=findMessageById(messageId);

        if(message.getUser().getId().equals(reqUser.getId())){
            messageRepository.deleteById(messageId);
        }

        throw new UserException("You can't delete another User's Message"+reqUser.getFullname());



        }
}
