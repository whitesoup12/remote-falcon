package com.remotefalcon.controlpanel.util;

import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class RandomUtil {
  private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
  private static final String NUMBERS = "0123456789";
  private static final String ALL = UPPERCASE + LOWERCASE + NUMBERS;

  private static final SecureRandom random = new SecureRandom();

  public static String generateToken(int maxLength) {
    return shuffle(selectRandomTokens(maxLength));
  }

  private static String shuffle(String s) {
    List<String> tokens = Arrays.asList(s.split(""));
    Collections.shuffle(tokens);
    return String.join("", tokens);
  }

  private static String selectRandomTokens(int maxLength) {
    StringBuilder randomTokens = new StringBuilder();
    for (int i = 0; i < maxLength; i++) {
      randomTokens.append(ALL.charAt(random.nextInt(ALL.length())));
    }
    return randomTokens.toString();
  }
}
