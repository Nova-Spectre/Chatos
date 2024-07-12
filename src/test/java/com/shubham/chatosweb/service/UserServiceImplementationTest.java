package com.shubham.chatosweb.service;

import com.shubham.chatosweb.config.TokenProvider;
import com.shubham.chatosweb.exception.UserException;
import com.shubham.chatosweb.model.User;
import com.shubham.chatosweb.repository.UserRepository;
import com.shubham.chatosweb.request.UpdateUserRequest;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.BadCredentialsException;

import java.util.Optional;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UserServiceImplementationTest {

    @Autowired
    private UserService userService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private TokenProvider tokenProvider;

    @Test
    public void testFindUserByID_UserExists() throws UserException {
        User user = new User();
        user.setId(1);
        user.setFullname("John Doe");

        Mockito.when(userRepository.findById(1)).thenReturn(Optional.of(user));

        User foundUser = userService.findUserByID(1);
        assertEquals(user.getId(), foundUser.getId());
        assertEquals(user.getFullname(), foundUser.getFullname());
    }

    @Test
    public void testFindUserByID_UserNotFound() {
        Mockito.when(userRepository.findById(1)).thenReturn(Optional.empty());

        UserException exception = assertThrows(UserException.class, () -> userService.findUserByID(1));
        assertEquals("User Not Found with id1", exception.getMessage());
    }

    @Test
    public void testFindUserProfile_ValidToken() throws UserException {
        User user = new User();
        user.setEmail("john.doe@example.com");

        Mockito.when(tokenProvider.getEmailFromToken("valid_token")).thenReturn("john.doe@example.com");
        Mockito.when(userRepository.findByEmail("john.doe@example.com")).thenReturn(user);

        User foundUser = userService.findUserProfile("valid_token");
        assertEquals(user.getEmail(), foundUser.getEmail());
    }

    @Test
    public void testFindUserProfile_InvalidToken() {
        Mockito.when(tokenProvider.getEmailFromToken("invalid_token")).thenReturn(null);

        BadCredentialsException exception = assertThrows(BadCredentialsException.class, () -> userService.findUserProfile("invalid_token"));
        assertEquals("received invalid token ----", exception.getMessage());
    }

    @Test
    public void testFindUserProfile_UserNotFound() {
        Mockito.when(tokenProvider.getEmailFromToken("valid_token")).thenReturn("john.doe@example.com");
        Mockito.when(userRepository.findByEmail("john.doe@example.com")).thenReturn(null);

        UserException exception = assertThrows(UserException.class, () -> userService.findUserProfile("valid_token"));
        assertEquals("User not found with emailjohn.doe@example.com", exception.getMessage());
    }

    @Test
    public void testUpdateUser() throws UserException {
        User user = new User();
        user.setId(1);
        user.setFullname("John Doe");

        UpdateUserRequest req = new UpdateUserRequest();
        req.setFullname("Jane Doe");
        req.setProfile_picture("new_profile_pic_url");

        Mockito.when(userRepository.findById(1)).thenReturn(Optional.of(user));
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenReturn(user);

        User updatedUser = userService.updateUser(1, req);
        assertEquals(req.getFullname(), updatedUser.getFullname());
        assertEquals(req.getProfile_picture(), updatedUser.getProfile_picture());
    }

    @Test
    public void testSearchUser() {
        User user = new User();
        user.setId(1);
        user.setFullname("John Doe");

        List<User> users = Collections.singletonList(user);

        Mockito.when(userRepository.searchUser("John")).thenReturn(users);

        List<User> foundUsers = userService.searchUser("John");
        assertEquals(1, foundUsers.size());
        assertEquals(user.getFullname(), foundUsers.get(0).getFullname());
    }
}
