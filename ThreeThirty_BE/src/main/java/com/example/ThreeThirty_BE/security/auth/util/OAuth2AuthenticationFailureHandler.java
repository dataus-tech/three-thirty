package com.example.ThreeThirty_BE.security.auth.util;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.example.ThreeThirty_BE.security.auth.util.CookieAuthorizationRequestRepository.REDIRECT_URI_PARAM_COOKIE_NAME;


// OAuth2 인증 실패 시 실행되는 핸들러 클래스입니다. 실패한 요청을 이전의 리디렉션 URI로 다시 보냅니다.
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

  private final CookieAuthorizationRequestRepository authorizationRequestRepository;

  @Override
  public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
      AuthenticationException exception) throws IOException, ServletException {
    String targetUrl = CookieUtils.getCookie(request, REDIRECT_URI_PARAM_COOKIE_NAME)
        .map(Cookie::getValue)
        .orElse("/");

    targetUrl = UriComponentsBuilder.fromUriString(targetUrl)
        .queryParam("error", exception.getLocalizedMessage())
        .build().toUriString();

    authorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
    getRedirectStrategy().sendRedirect(request, response, targetUrl);
  }
}
