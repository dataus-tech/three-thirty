package com.example.ThreeThirty_BE.controller;

import com.example.ThreeThirty_BE.domain.EmailMessage;
import com.example.ThreeThirty_BE.dto.login.EmailPostDto;
import com.example.ThreeThirty_BE.dto.login.EmailResponseDto;
import com.example.ThreeThirty_BE.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class MailController {

    private final EmailService emailService;


    // 임시 비밀번호 발급
    @PostMapping("/password")
    public ResponseEntity sendPasswordMail(@RequestBody EmailPostDto emailPostDto) {
        EmailMessage emailMessage = EmailMessage.builder()
                .to(emailPostDto.getEmail())
                .subject("[SAVIEW] 임시 비밀번호 발급")
                .build();

        emailService.sendMail(emailMessage, "password");

        return ResponseEntity.ok().build();
    }

    // 회원가입 이메일 인증 - 요청 시 body로 인증번호 반환하도록 작성하였음
    @PostMapping("/email")
    public ResponseEntity sendJoinMail(@RequestBody EmailPostDto emailPostDto) {
        EmailMessage emailMessage = EmailMessage.builder()
                .to(emailPostDto.getEmail())
                .subject("[SAVIEW] 이메일 인증을 위한 인증 코드 발송")
                .build();

        String code = emailService.sendMail(emailMessage, "email");

        EmailResponseDto emailResponseDto = new EmailResponseDto();
        emailResponseDto.setCode(code);

        return ResponseEntity.ok(emailResponseDto);
    }
}
