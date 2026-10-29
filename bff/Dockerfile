# Etap 1: Budowanie aplikacji przy użyciu Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Ustawienie katalogu roboczego w kontenerze
WORKDIR /app

# Kopiowanie pliku pom.xml w celu pobrania zależności
COPY pom.xml .

# Pobranie zależności Mavena. Dzięki temu warstwa z zależnościami zostanie zbuforowana.
RUN mvn dependency:go-offline

# Kopiowanie kodu źródłowego aplikacji
COPY src ./src

# Zbudowanie aplikacji i spakowanie jej do pliku JAR
RUN mvn clean package -DskipTests

# Etap 2: Uruchomienie aplikacji
FROM eclipse-temurin:21-jre-jammy

# Ustawienie katalogu roboczego w kontenerze
WORKDIR /app

# Kopiowanie pliku JAR z etapu budowania
COPY --from=build /app/target/*.jar app.jar

# Ustalenie portu, na którym aplikacja będzie nasłuchiwać
EXPOSE 8080

# Polecenie uruchamiające aplikację
ENTRYPOINT ["java", "-jar", "app.jar"]
