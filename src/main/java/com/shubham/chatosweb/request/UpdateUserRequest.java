package com.shubham.chatosweb.request;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
@Setter
@NoArgsConstructor
public class UpdateUserRequest {

    private String fullname;
    private String profile_picture;
}
