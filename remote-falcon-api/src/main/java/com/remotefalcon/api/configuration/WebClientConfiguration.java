package com.remotefalcon.api.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfiguration {

  @Value("${GITHUB_PAT}")
  String gitHubPat;

  @Bean
  public WebClient gitHubWebClient() {
    return WebClient.builder()
            .baseUrl("https://api.github.com")
            .defaultHeader("Authorization", "Bearer " + gitHubPat)
            .defaultHeader("Content-Type", "application/vnd.github+json")
            .build();
  }
}
