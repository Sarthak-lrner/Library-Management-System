# ☕ Library Management System - Backend REST API

This is the backend REST API service for the **Library Management System**, powered by **Spring Boot**, **Spring Security**, and **MySQL**.

## 🛠️ Core Tech Stack & Dependencies
*   **Java Version:** 21
*   **Framework:** Spring Boot `2.7.18`
*   **Data Layer:** Spring Data JPA (Hibernate)
*   **Endpoints:** Spring Data REST & custom Spring MVC Controllers
*   **Security:** Spring Security & JWT (`io.jsonwebtoken`)
*   **Payment Services:** Stripe Java SDK `22.0.0`
*   **Utilities:** Project Lombok & JSR-380 Validation

## ⚙️ Application Configuration

The application profile properties are loaded from `src/main/resources/application.properties`. Update these values locally to match your database configuration and private keys.

```properties
# Database Connectivity
spring.datasource.url=jdbc:mysql://localhost:3306/reactlibrarydatabase?useSSL=false&useUnicode=yes&characterEncoding=UTF-8&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Security Secrets
jwt.secret=YOUR_JWT_SECRET

# Stripe Payment Keys
stripe.key.secret=YOUR_STRIPE_SECRET_KEY

# HTTPS keystore settings
server.port=8443
server.ssl.enabled=true
server.ssl.key-alias=YOUR_KEY_ALIAS
server.ssl.key-store=classpath:Code.p12
server.ssl.key-store-password=YOUR_KEY_PASSWORD
server.ssl.key-store-type=PKCS12
```

## 🚀 Running the API Server

### Prerequisites
*   **Java JDK 21** installed and configured in your environment variables.
*   **MySQL Server** up and running with databases set up using the SQL scripts in `01-starter-files/Scripts/`.

### Run Commands
From this directory, run the application using the Maven wrapper:

```bash
# On Unix/macOS:
./mvnw spring-boot:run

# On Windows:
mvnw.cmd spring-boot:run
```

The secure server will start up on port `8443`. You can verify it by checking the endpoint metadata at `https://localhost:8443/api`.

---

For comprehensive details on frontend implementation, database restoration, and user interfaces, please refer to the main **[Project README](../../../README.md)**.
