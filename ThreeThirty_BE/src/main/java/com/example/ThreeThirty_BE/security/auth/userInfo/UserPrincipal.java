package com.example.ThreeThirty_BE.security.auth.userInfo;

import com.example.ThreeThirty_BE.domain.ProviderType;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

// OAuth2또는 OpenID Connect(OIDC)로 인증된 사용자 정보 저장 클래스. Spring Security의 'OAuth2User'및 'OidcUser' 인터페이스를 구현하며, 사용자 정보와 권한 포함.
@Slf4j
@Getter
@Setter
@RequiredArgsConstructor
public class UserPrincipal implements OAuth2User, OidcUser {

  private final Long userId;
  private final String email;
  private final String username;
  private final ProviderType providerType;
  private final Collection<GrantedAuthority> authorities;
  private Map<String, Object> attributes;

  @Override
  public Map<String, Object> getAttributes() {
    return attributes;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }

  public String getName() {
    return username;
  }

  @Override
  public Map<String, Object> getClaims() {
    return null;
  }

  @Override
  public OidcUserInfo getUserInfo() {
    return null;
  }

  @Override
  public OidcIdToken getIdToken() {
    return null;
  }
}
