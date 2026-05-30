# 📚 Library Management System

A premium, full-stack, enterprise-grade **Library Management System** built using **Spring Boot** (Java 21) on the backend and **React** (TypeScript) on the frontend. The project features advanced search capabilities, checkout & loan tracking, user reviews, support ticket communication, role-based access control, secure Stripe payment processing for late fees, and end-to-end HTTPS security.

---

## 🚀 Key Features

*   **🔐 Secure Authentication & Authorization**
    *   Custom JWT-based authentication mechanism.
    *   Role-based access control (RBAC) distinguishing between **Users** and **Administrators**.
    *   Secure endpoints using Spring Security.

*   **📖 Comprehensive Catalog & Search**
    *   Advanced searching and filtering of books by title, author, and category.
    *   Paginated list views for efficient resource navigation.

*   **🔄 Book Loans & Checkout Flow**
    *   Interactive book checking out, automatic due-date calculations, and renewals.
    *   Safe limits on maximum checkouts per user.
    *   Interactive return flow with real-time checkout history logging.

*   **⭐ Ratings & Reviews**
    *   User-submitted book reviews and ratings.
    *   Dynamic displaying of average book ratings and review feedback.

*   **💳 Stripe Payment Integration**
    *   Secure payment processing using the Stripe API.
    *   Payment tracking for outstanding library late fees/fines before allowing further checkouts.

*   **💬 Support Ticket System**
    *   Support inquiry submission for users.
    *   Dedicated Admin dashboard to review, response, and close support tickets.

*   **🛠️ Admin Inventory Panel**
    *   Admin capabilities to add new books, increase book quantities, and delete items from the catalog.

---

## 🛠️ Technology Stack

### Backend
*   **Language & Version:** Java 21
*   **Framework:** Spring Boot `2.7.18`
*   **Database Access:** Spring Data JPA (Hibernate)
*   **API Exposure:** Spring Data REST & Custom Controllers
*   **Database:** MySQL
*   **Security:** Spring Security & JWT (`io.jsonwebtoken`)
*   **Payment Gateway:** Stripe Java SDK (`22.0.0`)
*   **Utilities:** Project Lombok, Spring Boot Validation

### Frontend
*   **Core Library:** React `18.2.0`
*   **Language:** TypeScript
*   **Routing:** React Router DOM `5.3.4`
*   **HTTP Client:** Axios
*   **Payments Component:** Stripe React JS (`@stripe/react-stripe-js`)
*   **Styles & Layout:** Modern CSS with custom responsive layouts

---

## 📂 Project Structure

```text
Library-Management-System/
├── 01-starter-files/          # Contains database scripts and static resources
│   ├── Scripts/               # MySQL database schema and mock data scripts
│   └── Images/                # Static book images
├── 02-backend/                # Spring Boot REST API application
│   └── Spring-Boot-Library/
│       └── Spring-Boot-Library/
│           ├── src/
│           ├── pom.xml        # Backend dependencies and build config
│           └── ...
└── 03-frontend/               # React client application
    └── react-library/
        ├── public/
        ├── src/
        ├── package.json       # Frontend dependencies and npm scripts
        └── ...
```

---

## ⚙️ Getting Started & Installation

### 1. Database Setup
The project requires a MySQL database.
1. Start your local MySQL server.
2. Locate the database initialization scripts in `01-starter-files/Scripts/`.
3. Run the scripts sequentially in your MySQL client to create the tables and insert mock data:
   *   `React-Springboot-Add-Tables-Script-1.sql` (Creates base database structure)
   *   `React-SpringBoot-Add-Books-Script-2.sql` to `React-SpringBoot-Add-Books-Script-5.sql` (Inserts catalog books and initial records)

### 2. Backend Configuration
Navigate to `02-backend/Spring-Boot-Library/Spring-Boot-Library/src/main/resources/application.properties` and customize the configuration properties:

```properties
# MySQL Connection Settings
spring.datasource.url=jdbc:mysql://localhost:3306/reactlibrarydatabase?useSSL=false&useUnicode=yes&characterEncoding=UTF-8&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Security & JWT Setup
jwt.secret=YOUR_LONG_JWT_SECRET_KEY

# Stripe Payment Keys
stripe.key.secret=YOUR_STRIPE_SECRET_KEY

# HTTPS configuration (Running on Port 8443)
server.port=8443
server.ssl.enabled=true
server.ssl.key-alias=YOUR_KEY_ALIAS
server.ssl.key-store=classpath:Code.p12
server.ssl.key-store-password=YOUR_KEYSTORE_PASSWORD
server.ssl.key-store-type=PKCS12
```

> [!WARNING]
> Keep your production environment secrets secure. Never commit active private API keys or database passwords to public version control systems. Always use environment variables or specialized configuration profiles.

### 3. Frontend Configuration
Navigate to `03-frontend/react-library/` and verify the `.env` file settings:

```env
# SSL / HTTPS Configuration
SSL_CRT_FILE=ssl-localhost/localhost.crt
SSL_KEY_FILE=ssl-localhost/localhost.key

# Backend API Endpoint
REACT_APP_API_URL="https://localhost:8443"
```

---

## 🏃 Run the Application

### Running the Backend
Ensure you have **Java 21** installed. Navigate to the maven project root directory and execute:

```bash
cd 02-backend/Spring-Boot-Library/Spring-Boot-Library
./mvnw spring-boot:run
```
The backend server will launch and listen securely at `https://localhost:8443/api`.

### Running the Frontend
Ensure you have **Node.js** installed. Navigate to the React app folder, install dependencies, and run:

```bash
cd 03-frontend/react-library
npm install
npm start
```
The client app will launch and open in your default browser at `https://localhost:3000` over secure HTTPS.
