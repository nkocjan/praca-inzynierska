# Etap 1: Budowanie aplikacji za pomocą Mavena
FROM maven:3.9-eclipse-temurin-21 AS builder

# Ustawienie katalogu roboczego w kontenerze
WORKDIR /app

# Kopiowanie pliku pom.xml i pobieranie zależności (wykorzystuje cache warstw Docker)
COPY pom.xml .
RUN mvn dependency:go-offline

# Kopiowanie reszty kodu źródłowego
COPY src ./src

# Budowanie aplikacji, pomijając testy
RUN mvn clean package -DskipTests

# Etap 2: Tworzenie finalnego, lekkiego obrazu
FROM eclipse-temurin:21-jre-jammy

# Ustawienie katalogu roboczego
WORKDIR /app

# Kopiowanie zbudowanego pliku .jar z etapu "builder"
# Zmienia nazwę pliku na app.jar dla uproszczenia
COPY --from=builder /app/target/*.jar app.jar

# Ustalenie portu, na którym działa aplikacja (z logów wynika, że to 8081)
EXPOSE 8081

# Polecenie uruchamiające aplikację przy starcie kontenera
ENTRYPOINT ["java", "-jar", "app.jar"]
