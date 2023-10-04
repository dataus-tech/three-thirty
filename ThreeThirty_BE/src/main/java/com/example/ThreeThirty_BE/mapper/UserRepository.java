package com.example.ThreeThirty_BE.mapper;

import com.example.ThreeThirty_BE.domain.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserRepository {

  void saveUser(User user);

  User findByEmail(String email);

  User findById(Long userId);

  void updateUser(@Param("userId") Long userId, @Param("username") String username);

  void updateUserPassword(@Param("userId") Long userId, @Param("password") String password);
}
