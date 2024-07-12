package com.shubham.chatosweb.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String chat_name;
    private String chat_image;

    @ManyToMany
    private Set<User> admins=new HashSet<User>();

    @Column(name="is_group")
    private boolean isGroup;

    @JoinColumn(name="created_by")
    @ManyToOne
    private User createdBy;

    @ManyToMany
    private Set<User> users=new HashSet<User>();

    @OneToMany
    private List<Message> messages=new ArrayList();
}
