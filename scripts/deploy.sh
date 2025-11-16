#!/bin/bash

# Script to deploy infrastructure using Terraform
# Usage: ./scripts/deploy.sh [plan|apply|destroy]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

TERRAFORM_DIR="./terraform"
ACTION=${1:-apply}

# Check if terraform directory exists
if [ ! -d "$TERRAFORM_DIR" ]; then
    echo -e "${RED}Error: Terraform directory not found${NC}"
    exit 1
fi

cd "$TERRAFORM_DIR"

# Initialize Terraform if needed
if [ ! -d ".terraform" ]; then
    echo -e "${YELLOW}Initializing Terraform...${NC}"
    terraform init
fi

# Validate configuration
echo -e "${YELLOW}Validating Terraform configuration...${NC}"
terraform validate

case "$ACTION" in
    plan)
        echo -e "${GREEN}Running Terraform plan...${NC}"
        terraform plan
        ;;
    apply)
        echo -e "${GREEN}Applying Terraform configuration...${NC}"
        terraform apply
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}Terraform apply completed successfully!${NC}"
            echo -e "${YELLOW}Getting outputs...${NC}"
            terraform output
        else
            echo -e "${RED}Terraform apply failed${NC}"
            exit 1
        fi
        ;;
    destroy)
        echo -e "${RED}WARNING: This will destroy all infrastructure!${NC}"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            terraform destroy
        else
            echo -e "${YELLOW}Destroy cancelled${NC}"
        fi
        ;;
    *)
        echo -e "${RED}Error: Invalid action. Use 'plan', 'apply', or 'destroy'${NC}"
        exit 1
        ;;
esac

