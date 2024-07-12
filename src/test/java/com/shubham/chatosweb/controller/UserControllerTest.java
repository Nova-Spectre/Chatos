package com.shubham.chatosweb.controller;

import com.shubham.chatosweb.model.User;
import com.shubham.chatosweb.request.UpdateUserRequest;
import com.shubham.chatosweb.response.ApiResponse;
import com.shubham.chatosweb.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Collections;
import java.util.List;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.hamcrest.Matchers.is;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    public void testGetUserProfile() throws Exception {
        User user = new User();
        user.setId(1);
        user.setFullname("John Doe");
        user.setEmail("john.doe@example.com");
        user.setProfile_picture("profile_pic_url");
        user.setPassword("password");

        Mockito.when(userService.findUserProfile(Mockito.anyString())).thenReturn(user);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/profile")
                        .header("Authorization", "Bearer token"))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.fullname", is("John Doe")))
                .andExpect(jsonPath("$.email", is("john.doe@example.com")))
                .andExpect(jsonPath("$.profile_picture", is("profile_pic_url")));
    }

    @Test
    public void testSearchUser() throws Exception {
        User user = new User();
        user.setId(1);
        user.setFullname("John Doe");
        user.setEmail("john.doe@example.com");
        user.setProfile_picture("profile_pic_url");
        user.setPassword("password");

        List<User> users = Collections.singletonList(user);

        Mockito.when(userService.searchUser(Mockito.anyString())).thenReturn(users);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/John"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].fullname", is("John Doe")))
                .andExpect(jsonPath("$[0].email", is("john.doe@example.com")))
                .andExpect(jsonPath("$[0].profile_picture", is("profile_pic_url")));
    }

    @Test
    public void testUpdateUser() throws Exception {
        ApiResponse response = new ApiResponse("User Updated Successfully", true);
        User user = new User();
        user.setId(1);

        Mockito.when(userService.findUserProfile(Mockito.anyString())).thenReturn(user);
        Mockito.doNothing().when(userService).updateUser(Mockito.anyInt(), Mockito.any(UpdateUserRequest.class));

        UpdateUserRequest req = new UpdateUserRequest();
        req.setFullname("John Doe");

        mockMvc.perform(MockMvcRequestBuilders.put("/api/users/update")
                        .header("Authorization", "Bearer token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullname\": \"John Doe\"}"))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.message", is("User Updated Successfully")))
                .andExpect(jsonPath("$.success", is(true)));
    }
}
