package com.shubham.chatosweb.service;

import com.shubham.chatosweb.exception.UserException;
import com.shubham.chatosweb.model.User;
import com.shubham.chatosweb.request.UpdateUserRequest;

import java.util.List;

public interface UserService {

    public User findUserByID(Integer id) throws UserException;
    public User findUserProfile(String jwt) throws UserException;

    public User updateUser(Integer userId, UpdateUserRequest req) throws UserException;


    public List<User> searchUser(String query);

}
