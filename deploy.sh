#!/bin/bash
set -e

echo "=== Deployment Script for Visit Counter App ==="

AWS_REGION="eu-north-1"
PROJECT_NAME="visit-counter"

echo "Step 1: Initialize Terraform..."
cd infrastructure
terraform init

echo "Step 2: Create infrastructure (ECR repositories)..."
terraform apply -target=aws_ecr_repository.client -target=aws_ecr_repository.server -auto-approve

echo "Step 3: Get ECR repository URLs..."
CLIENT_REPO=$(terraform output -raw ecr_repository_client)
SERVER_REPO=$(terraform output -raw ecr_repository_server)

echo "Client ECR: $CLIENT_REPO"
echo "Server ECR: $SERVER_REPO"

echo "Step 4: Login to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $CLIENT_REPO

echo "Step 5: Build and push server image..."
cd ../server
docker build -f Dockerfile.prod -t $SERVER_REPO:latest .
docker push $SERVER_REPO:latest

echo "Step 6: Build and push client image..."
cd ../client2
docker build -f Dockerfile -t $CLIENT_REPO:latest .
docker push $CLIENT_REPO:latest

echo "Step 7: Deploy complete infrastructure..."
cd ../infrastructure
terraform apply -auto-approve

echo "=== Deployment Complete ==="
echo ""
terraform output application_url
echo ""