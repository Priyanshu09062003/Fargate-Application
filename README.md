# E-Commerce Application: AWS Deployment Guide

This repository contains a full-stack e-commerce application built with Spring Boot (Backend), React (Frontend), and PostgreSQL (Database). It is fully containerized and production-ready for deployment on AWS.

This guide covers two deployment methods: a straightforward EC2 deployment using Docker Compose, and a highly scalable deployment using AWS ECS (Fargate).

---

## Method 1: Simple EC2 Deployment (Docker Compose)

The fastest way to get the application running is by deploying the entire stack on a single AWS EC2 instance.

### 1. Provision the EC2 Instance
1. Launch an **Ubuntu Server** EC2 instance in the AWS Console.
2. **CRITICAL:** Configure the **Security Group** attached to your instance. 
   - Add an Inbound Rule for **HTTP** (Port 80) with source `0.0.0.0/0` (Anywhere). 
   - If you don't do this, you will not be able to view the frontend in your browser!

### 2. Connect and Install Docker
SSH into your instance and install Docker:
```bash
ssh -i /path/to/your-key.pem ubuntu@<your-ec2-ip-address>

# Install Docker and Docker Compose
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo usermod -aG docker $USER
```
*(You may need to log out and log back in for the usermod to take effect).*

### 3. Clone and Run
```bash
# Clone your repository (or copy the files over)
git clone <your-repo-url> e-commerce-app
cd e-commerce-app

# Build and start all containers in detached mode
docker-compose up -d --build
```
You can now open your browser and navigate to `http://<your-ec2-ip-address>`. The NGINX reverse proxy will automatically serve the React frontend and route API calls to the Spring Boot backend!

---

## Method 2: Enterprise Deployment (AWS ECS / Fargate)

For high availability and auto-scaling, deploy the containers independently using Amazon Elastic Container Service (ECS) with Fargate.

### 1. Push Images to Amazon ECR
We have provided a helper script to build and upload your Docker images to Amazon Elastic Container Registry (ECR).
1. Open `push-to-ecr.sh` and update the variables at the top (`AWS_REGION`, `AWS_ACCOUNT_ID`, etc.) to match your AWS account.
2. Ensure you have the AWS CLI installed and configured (`aws configure`).
3. Run the script:
   ```bash
   chmod +x push-to-ecr.sh
   ./push-to-ecr.sh
   ```
*(Note: The script explicitly builds the images for `linux/amd64` architecture, ensuring they will run correctly on standard Fargate servers without 'exec format error' crashes).*

### 2. Configure the Backend Task
1. Create an ECS Task Definition for the Backend using your new ECR image URI.
2. Connect it to an external PostgreSQL database (like AWS RDS). Set the following environment variables in the container definition:
   - `DB_HOST` = `<your-rds-endpoint>`
   - `DB_USER` = `<your-db-username>`
   - `DB_PASSWORD` = `<your-db-password>`
   - `DB_NAME` = `<your-db-name>`

### 3. Configure the Frontend Task
1. Create an ECS Task Definition for the Frontend using your new ECR image URI.
2. The frontend uses NGINX to dynamically reverse proxy API requests to the backend. You must tell NGINX where the backend is located by setting the `BACKEND_URL` environment variable:
   - **If Frontend & Backend share the same Fargate Task:** Set `BACKEND_URL = http://localhost:8080`.
   - **If they are separate Fargate Tasks:** Set `BACKEND_URL = http://<your-backend-internal-dns>:8080` (requires AWS Cloud Map / Service Discovery).

---

## Architecture Notes

- **Frontend Connectivity:** The React code strictly uses relative paths (e.g., `fetch('/api/products')`). All routing logic is handled securely by NGINX inside the Docker container.
- **Health Checks:** The frontend includes a live connectivity indicator. It pings the backend's `/api/health` endpoint every 30 seconds to ensure the connection is active.
