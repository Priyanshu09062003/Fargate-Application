# E-Commerce Application Deployment Guide

This repository contains the backend (Spring Boot) and frontend (React) code for the e-commerce application. It is containerized using Docker and orchestrated with Docker Compose.

## Prerequisites
- **Git** (to clone the code)
- **Docker** and **Docker Compose** installed on your machine or EC2 instance.

## EC2 Deployment Steps

1. **Provision an EC2 Instance:**
   - Launch an Ubuntu Server instance.
   - Configure the Security Group to allow incoming traffic on ports `80` (HTTP), `443` (HTTPS - optional), and `22` (SSH). Port `8080` and `5432` are only needed if you want external access to the API or DB directly (not recommended for production).

2. **Connect to the Instance:**
   ```bash
   ssh -i /path/to/your-key.pem ubuntu@<your-ec2-ip-address>
   ```

3. **Install Docker and Docker Compose (Ubuntu):**
   ```bash
   sudo apt-get update
   sudo apt-get install -y docker.io docker-compose
   sudo usermod -aG docker $USER
   # You might need to log out and log back in for the usermod to take effect
   ```

4. **Clone the Repository:**
   ```bash
   # Assuming you push this code to a Git repository like GitHub
   git clone <your-repo-url> e-commerce-app
   cd e-commerce-app
   ```

5. **Build and Run the Containers:**
   ```bash
   # Run the application in detached mode
   docker-compose up -d --build
   ```

6. **Verify Deployment:**
   - Open your browser and navigate to `http://<your-ec2-ip-address>`
   - The React application should load.
   - It will automatically fetch the sample products from the Spring Boot API!

## Notes for Production
- **CORS:** In `backend/src/main/java/com/ecommerce/backend/config/CorsConfig.java`, update the `allowedOrigins` to exactly match your domain name instead of `*`.
- **Database Passwords:** Change the default PostgreSQL password in `docker-compose.yml` and use an `.env` file instead of committing secrets to the repository.
- **Frontend API URL:** Currently, the React frontend (`ProductList.jsx`) is hardcoded to fetch from `http://localhost:8080/api/products`. For production, you should use environment variables in Vite to point to your actual backend domain, or use an NGINX reverse proxy rule to route `/api` to the backend container.
