# Etap 1: Budowanie aplikacji za pomocą Maven i JDK 21
FROM maven:3.9-eclipse-temurin-21 AS build

# Ustawienie katalogu roboczego w kontenerze
WORKDIR /app

# Kopiowanie pliku pom.xml w celu pobrania zależności (wykorzystanie cache'owania warstw Docker)
COPY pom.xml .
RUN mvn dependency:go-offline

# Kopiowanie reszty kodu źródłowego
COPY src ./src

# Budowanie aplikacji i tworzenie pliku .jar, z pominięciem testów
RUN mvn clean package -DskipTests

# Etap 2: Tworzenie finalnego, lekkiego obrazu z JRE 21
FROM eclipse-temurin:21-jre-jammy

# Ustawienie katalogu roboczego
WORKDIR /app

# Kopiowanie zbudowanego pliku .jar z etapu 'build'
COPY --from=build /app/target/*.jar app.jar

# Ustalenie portu, na którym aplikacja będzie nasłuchiwać
EXPOSE 8080

# Polecenie uruchamiające aplikację
ENTRYPOINT ["java", "-jar", "app.jar"]
