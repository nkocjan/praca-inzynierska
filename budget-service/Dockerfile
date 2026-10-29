# Etap 1: Budowanie aplikacji za pomocą Maven i JDK 21
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Kopiowanie pliku pom.xml i pobieranie zależności (cache warstw Docker)
COPY pom.xml .
RUN mvn dependency:go-offline

# Kopiowanie kodu źródłowego
COPY src ./src

# Budowanie aplikacji, pomijając testy
RUN mvn clean package -DskipTests

# Etap 2: Finalny, lekki obraz z JRE 21
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 28082

ENTRYPOINT ["java", "-jar", "app.jar"]
