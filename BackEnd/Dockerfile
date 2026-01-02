FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY . .

RUN chmod +x mvnw \
    && ./mvnw clean package -DskipTests \
    && cp target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
