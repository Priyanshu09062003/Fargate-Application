#!/bin/bash

# Configuration variables (Update these with your actual AWS values)
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="123456789012"
ECR_FRONTEND_REPO="ecommerce-frontend"
ECR_BACKEND_REPO="ecommerce-backend"
IMAGE_TAG="latest"

echo "=================================================="
echo "    Pushing Docker Images to Amazon ECR"
echo "=================================================="

# 1. Authenticate Docker to your Amazon ECR registry
echo "-> Authenticating to Amazon ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

if [ $? -ne 0 ]; then
  echo "Error: AWS CLI authentication failed. Make sure 'aws configure' is set up."
  exit 1
fi

# 2. Build the images for the correct platform (linux/amd64 is standard for Fargate/EC2)
echo "-> Building Frontend image for linux/amd64..."
docker build --platform linux/amd64 -t $ECR_FRONTEND_REPO:$IMAGE_TAG ./frontend

echo "-> Building Backend image for linux/amd64..."
docker build --platform linux/amd64 -t $ECR_BACKEND_REPO:$IMAGE_TAG ./backend

# 3. Tag your images so they can be pushed to the repository
echo "-> Tagging images..."
docker tag $ECR_FRONTEND_REPO:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO:$IMAGE_TAG
docker tag $ECR_BACKEND_REPO:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND_REPO:$IMAGE_TAG

# 4. Push the images
echo "-> Pushing Frontend image to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO:$IMAGE_TAG

echo "-> Pushing Backend image to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND_REPO:$IMAGE_TAG

echo "=================================================="
echo "    Success! Images uploaded to ECR."
echo "=================================================="
echo ""
echo "Next step in AWS ECS / Fargate:"
echo "- In your ECS Task Definition for the Frontend, set the environment variable:"
echo "    BACKEND_URL = http://your-backend-internal-url:8080"
echo "  (Use 'http://localhost:8080' if running frontend & backend in the exact same task)"
