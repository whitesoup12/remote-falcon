package com.remotefalcon.api.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.SQLException;

@Configuration
public class DatabaseConfig {

  private final String JDBC = "jdbc";

  @Bean(name = "dataSource")
  public DataSource dataSource(@Value("${DATABASE_URL}") String url) throws SQLException {
    return DataSourceBuilder.create()
            .url(String.format("%s:%s", JDBC, url))
            .build();
  }
}
