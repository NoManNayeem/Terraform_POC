#!/bin/bash

# Script to build and push Docker images to AWS ECR
# Usage: ./scripts/build-and-push.sh [backend|frontend|all]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get AWS account ID and region from Terraform outputs or variables
AWS_REGION=${AWS_REGION:-us-east-1}
PROJECT_NAME=${PROJECT_NAME:-fastapi-nextjs-poc}

# Function to get ECR repository URL
get_ecr_url() {
    local service=$1
    aws ecr describe-repositories \
        --repository-names "${PROJECT_NAME}-${service}" \
        --region "${AWS_REGION}" \
        --query 'repositories[0].repositoryUri' \
        --output text 2>/dev/null || echo ""
}

# Function to build and push a service
build_and_push() {
    local service=$1
    local service_dir="./${service}"
    
    if [ ! -d "$service_dir" ]; then
        echo -e "${RED}Error: Directory $service_dir not found${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Building and pushing $service...${NC}"
    
    # Get ECR repository URL
    ECR_URL=$(get_ecr_url "$service")
    
    if [ -z "$ECR_URL" ]; then
        echo -e "${YELLOW}Warning: ECR repository not found. Please run 'terraform apply' first.${NC}"
        echo -e "${YELLOW}Attempting to create repository...${NC}"
        
        # Try to create the repository
        aws ecr create-repository \
            --repository-name "${PROJECT_NAME}-${service}" \
            --region "${AWS_REGION}" \
            --image-scanning-configuration scanOnPush=true \
            --image-tag-mutability MUTABLE 2>/dev/null || true
        
        ECR_URL=$(get_ecr_url "$service")
        
        if [ -z "$ECR_URL" ]; then
            echo -e "${RED}Error: Could not create or find ECR repository${NC}"
            exit 1
        fi
    fi
    
    echo -e "${GREEN}ECR Repository: $ECR_URL${NC}"
    
    # Authenticate Docker to ECR
    echo -e "${YELLOW}Authenticating Docker to ECR...${NC}"
    aws ecr get-login-password --region "${AWS_REGION}" | \
        docker login --username AWS --password-stdin "${ECR_URL%%/*}"
    
    # Build the Docker image
    echo -e "${YELLOW}Building Docker image for $service...${NC}"
    docker build -t "${service}:latest" -f "${service_dir}/Dockerfile" "${service_dir}"
    
    # Tag the image
    echo -e "${YELLOW}Tagging image...${NC}"
    docker tag "${service}:latest" "${ECR_URL}:latest"
    
    # Push the image
    echo -e "${YELLOW}Pushing image to ECR...${NC}"
    docker push "${ECR_URL}:latest"
    
    echo -e "${GREEN}Successfully pushed $service to ECR${NC}"
    echo -e "${GREEN}Image URI: ${ECR_URL}:latest${NC}"
}

# Main script logic
SERVICE=${1:-all}

if [ "$SERVICE" = "backend" ]; then
    build_and_push "backend"
elif [ "$SERVICE" = "frontend" ]; then
    build_and_push "frontend"
elif [ "$SERVICE" = "all" ]; then
    build_and_push "backend"
    build_and_push "frontend"
    echo -e "${GREEN}All images built and pushed successfully!${NC}"
else
    echo -e "${RED}Error: Invalid service. Use 'backend', 'frontend', or 'all'${NC}"
    exit 1
fi

