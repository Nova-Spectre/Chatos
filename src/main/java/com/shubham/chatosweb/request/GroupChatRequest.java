package com.shubham.chatosweb.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GroupChatRequest {

    private List<Integer> userIds;
    private String chat_name;
    private String chat_image;

    //3:11:20


}
