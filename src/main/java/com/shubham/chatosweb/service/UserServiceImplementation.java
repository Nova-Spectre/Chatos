package com.shubham.chatosweb.service;

import com.shubham.chatosweb.config.TokenProvider;
import com.shubham.chatosweb.exception.UserException;
import com.shubham.chatosweb.model.User;
import com.shubham.chatosweb.repository.UserRepository;
import com.shubham.chatosweb.request.UpdateUserRequest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImplementation implements  UserService{

    private UserRepository userRepository;
    private TokenProvider tokenProvider;

    public UserServiceImplementation(UserRepository userRepository,TokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public User findUserByID(Integer id) throws UserException {
        Optional<User> opt=userRepository.findById(id);
        if(opt.isPresent()){
            return opt.get();
        }
        throw new UserException("User Not Found with id"+id);
    }

    @Override
    public User findUserProfile(String jwt) throws UserException {
        String email=tokenProvider.getEmailFromToken(jwt);
        User user=userRepository.findByEmail(email);

        if(email==null){
            throw new BadCredentialsException("received invalid token ----");
        }
        if(user==null){
            throw new UserException("User not found with email"+email);
        }
        return user;

    }

    @Override
    public User updateUser(Integer userId, UpdateUserRequest req) throws UserException {
        User user=findUserByID(userId);
        if(req.getFullname()!=null){
            user.setFullname(req.getFullname());
        }
        if(req.getProfile_picture()!=null){
            user.setProfile_picture(req.getProfile_picture());
        }
        return userRepository.save(user);
    }

    @Override
    public List<User> searchUser(String query) {
        List<User> users=userRepository.searchUser(query);
        return users;
    }
}
