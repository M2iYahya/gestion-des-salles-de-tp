FROM maven:3.9.7-eclipse-temurin-21

WORKDIR /app

COPY auth /app/auth
COPY cdn /app/cdn
COPY local /app/local
COPY reservation /app/reservation
COPY user /app/user

# Create the uploads directory and set permissions
RUN mkdir -p /app/cdn/uploads && chmod -R 777 /app/cdn/uploads

# Build with skipped tests
RUN mvn -f auth/pom.xml clean package -DskipTests
RUN mvn -f cdn/pom.xml clean package -DskipTests
RUN mvn -f local/pom.xml clean package -DskipTests
RUN mvn -f reservation/pom.xml clean package -DskipTests
RUN mvn -f user/pom.xml clean package -DskipTests

# Startup script with corrected ports
RUN echo "#!/bin/bash\n" \
    "java -jar auth/target/*.jar --server.port=8080 &\n" \
    "java -jar cdn/target/*.jar --server.port=8089 &\n" \
    "java -jar local/target/*.jar --server.port=8081 &\n" \
    "java -jar reservation/target/*.jar --server.port=8083 &\n" \
    "java -jar user/target/*.jar --server.port=8082 &\n" \
    "wait" > /app/start-services.sh

RUN chmod +x /app/start-services.sh

EXPOSE 8080 8081 8082 8083 8089

CMD ["/app/start-services.sh"]