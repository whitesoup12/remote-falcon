FROM maven:3-openjdk-17-slim AS build
COPY src /usr/src/app/src
COPY pom.xml /usr/src/app
RUN mvn -f /usr/src/app/pom.xml clean package

FROM openjdk:17-oracle
COPY --from=build /usr/src/app/target/remote-falcon-api.jar /usr/app/remote-falcon-api.jar
COPY --from=build /usr/src/app/target/dd-java-agent/dd-java-agent.jar /usr/app/dd-java-agent.jar
EXPOSE 8080

ENTRYPOINT exec java $JAVA_OPTS -javaagent:/usr/app/dd-java-agent.jar -Ddd.logs.injection=true \
  -Ddd.service=remote-falcon-api -Ddd.profiling.enabled=true -XX:FlightRecorderOptions=stackdepth=256 \
  -jar /usr/app/remote-falcon-api.jar