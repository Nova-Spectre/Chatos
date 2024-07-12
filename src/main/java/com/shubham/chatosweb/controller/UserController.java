package com.shubham.chatosweb.controller;

import com.shubham.chatosweb.exception.UserException;
import com.shubham.chatosweb.model.User;
import com.shubham.chatosweb.request.UpdateUserRequest;
import com.shubham.chatosweb.response.ApiResponse;
import com.shubham.chatosweb.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/users")
public class UserController {


    private UserService userService;

    public UserController(UserService userService) {
        this.userService=userService;
    }

    @GetMapping("profile")
    public ResponseEntity<User> getUserProfileHandler(@RequestHeader("Authorization") String token) throws UserException {
        User user=userService.findUserProfile(token);
        return new ResponseEntity<User>(user, HttpStatus.ACCEPTED);
    }

    @GetMapping("/{query}")
    public ResponseEntity<List<User>> searchUserHandler(@PathVariable("query") String q){

        List<User> users=userService.searchUser(q);

        return new ResponseEntity<List<User>>(users, HttpStatus.OK);

    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse>updateUserHandler(@RequestBody UpdateUserRequest req, @RequestHeader("Authorization") String token) throws UserException {
        User user=userService.findUserProfile(token);
        userService.updateUser(user.getId(),req);

        ApiResponse res=new ApiResponse("User Updated Successfully",true);

        return new ResponseEntity<ApiResponse>(res,HttpStatus.ACCEPTED);
    }
}
