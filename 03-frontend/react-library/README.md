# 🎨 Library Management System - Frontend Client

This is the React frontend application for the **Library Management System**, built with **React 18**, **TypeScript**, and styled using modern CSS.

## 🛠️ Tech Stack & Key Libraries
*   **Framework/Library:** React `18.2.0` (bootstrapped with Create React App)
*   **Language:** TypeScript
*   **Routing:** React Router DOM `5.3.4`
*   **HTTP Requests:** Axios
*   **Payment Integration:** `@stripe/react-stripe-js` & `@stripe/stripe-js`

## ⚙️ Configuration
The frontend application requires local SSL certificates to serve assets over HTTPS, matching the secure API server environment.

### Environment Setup (`.env`)
Create or verify the `.env` file in the root of this module:
```env
SSL_CRT_FILE=ssl-localhost/localhost.crt
SSL_KEY_FILE=ssl-localhost/localhost.key
REACT_APP_API_URL="https://localhost:8443"
```

## 🚀 Available Scripts

In this directory, you can run the following standard scripts:

### `npm install`
Installs all standard and development dependencies specified in `package.json`.

### `npm start`
Runs the application in development mode over HTTPS.\
Open **[https://localhost:3000](https://localhost:3000)** to view it in your browser.

The page will reload automatically upon edits, and any lint errors or compilation warnings will be displayed in the console.

### `npm run build`
Builds the production-ready package to the `build` directory, bundling React in production mode and optimizing the build files for optimal performance and minification.

---

For comprehensive details on how to set up the database, backend APIs, Stripe integrations, and system-wide flows, please refer to the main **[Project README](../../README.md)**.
