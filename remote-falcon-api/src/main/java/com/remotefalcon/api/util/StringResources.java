package com.remotefalcon.api.util;

import io.micrometer.core.instrument.util.IOUtils;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;

public class StringResources {
  private Class<?> cls;
  private Map<String, String> resources;

  public StringResources(Class<?> cls) {
    this.cls = cls;
    resources = new HashMap<>();
  }

  public StringResources load(String path) {
    try {
      resources.put(path, IOUtils.toString(new ClassPathResource(path, cls).getInputStream(), Charset.defaultCharset()));
    } catch (IOException ex) {

    }
    return this;
  }

  public String get(String path) {
    return resources.get(path);
  }
}
