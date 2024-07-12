package com.shubham.chatosweb.repository;

import com.shubham.chatosweb.model.Chat;
import com.shubham.chatosweb.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat,Integer> {

    @Query("select c from Chat c join c.users u where u.id=:userId")
    public List<Chat> findChatByUserid(@Param("userId") Integer UserId);


    @Query("SELECT c FROM Chat c WHERE c.isGroup=false AND :user member of c.users AND :reqUser member of c.users")
    public Chat findSingleChatByUserIds(@Param("user")User user, @Param("reqUser")User reqUser);
}
