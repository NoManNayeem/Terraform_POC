# Terraform Infrastructure

This directory contains Terraform configuration files for deploying the FastAPI + Next.js application to AWS ECS.

## File Structure

- `main.tf` - Provider configuration and local values
- `variables.tf` - Input variables
- `outputs.tf` - Output values (ALB DNS, ECR URLs, etc.)
- `terraform.tfvars` - Variable values (customize this file)
- `terraform.tfvars.example` - Example variables file
- `vpc.tf` - VPC, subnets, internet gateway, NAT gateway
- `ecr.tf` - ECR repositories for Docker images
- `ecs.tf` - ECS cluster, task definitions, and services
- `alb.tf` - Application Load Balancer configuration
- `security-groups.tf` - Security group rules
- `iam.tf` - IAM roles and policies
- `cloudwatch.tf` - CloudWatch log groups

## Prerequisites

1. **AWS CLI configured** with appropriate credentials
2. **Terraform installed** (>= 1.0)
3. **AWS Account** with permissions to create:
   - VPC and networking resources
   - ECS resources
   - ECR repositories
   - Application Load Balancer
   - IAM roles
   - CloudWatch logs

## Quick Start

### 1. Configure Variables

Copy the example variables file and customize:

```bash
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your values:

```hcl
aws_region   = "us-east-1"
project_name = "fastapi-nextjs-poc"
environment  = "dev"

backend_env_vars = {
  DATABASE_URL = "sqlite:///./app.db"
  SECRET_KEY   = "your-secret-key-here"
  DEBUG        = "false"
}

frontend_env_vars = {
  NEXT_PUBLIC_API_URL = "http://your-alb-dns-name/api"
}
```

**Important**: The `NEXT_PUBLIC_API_URL` needs to be updated after the ALB is created. You can get the ALB DNS name from Terraform outputs.

### 2. Initialize Terraform

```bash
terraform init
```

This will download the AWS provider and initialize the backend.

### 3. Review the Plan

```bash
terraform plan
```

This shows what resources will be created without actually creating them.

### 4. Apply the Configuration

```bash
terraform apply
```

Type `yes` when prompted to confirm.

### 5. Get Outputs

After applying, get important values:

```bash
terraform output
```

Key outputs:
- `alb_dns_name` - DNS name of the load balancer
- `backend_ecr_repository_url` - ECR repository URL for backend
- `frontend_ecr_repository_url` - ECR repository URL for frontend

### 6. Update Frontend Environment Variable

After getting the ALB DNS name, update `terraform.tfvars`:

```hcl
frontend_env_vars = {
  NEXT_PUBLIC_API_URL = "http://<actual-alb-dns-name>/api"
}
```

Then apply again:

```bash
terraform apply
```

## Common Commands

```bash
# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Format code
terraform fmt

# Review changes
terraform plan

# Apply changes
terraform apply

# Apply without confirmation
terraform apply -auto-approve

# View outputs
terraform output

# View specific output
terraform output alb_dns_name

# Destroy infrastructure
terraform destroy
```

## Resource Overview

### VPC and Networking
- VPC with CIDR 10.0.0.0/16
- 1 public subnet (for ALB)
- 1 private subnet (for ECS tasks)
- Internet Gateway
- NAT Gateway (for private subnet internet access)

### ECR Repositories
- `{project_name}-backend` - Backend Docker images
- `{project_name}-frontend` - Frontend Docker images

### ECS
- Fargate cluster
- Backend service (0.5 vCPU, 1GB memory)
- Frontend service (0.5 vCPU, 1GB memory)
- Task definitions with health checks

### Load Balancer
- Application Load Balancer (HTTP on port 80)
- Target groups for backend and frontend
- Listener rules:
  - `/api/*` → Backend
  - `/*` → Frontend

### Security
- Security groups with least privilege
- IAM roles for ECS task execution
- Private subnets for ECS tasks

### Monitoring
- CloudWatch log groups for both services
- Container Insights enabled on cluster

## Environment Variables

Environment variables are passed to containers via ECS task definitions. Update them in `terraform.tfvars`:

```hcl
backend_env_vars = {
  DATABASE_URL = "sqlite:///./app.db"
  SECRET_KEY   = "your-secret-key"
  # Add more variables as needed
}

frontend_env_vars = {
  NEXT_PUBLIC_API_URL = "http://your-alb-dns/api"
  # Add more variables as needed
}
```

After updating, apply the changes:

```bash
terraform apply
```

## Updating Docker Images

After pushing new Docker images to ECR, update the ECS services:

```bash
# Force new deployment (uses latest image)
aws ecs update-service \
  --cluster fastapi-nextjs-poc-cluster \
  --service fastapi-nextjs-poc-backend-service \
  --force-new-deployment

aws ecs update-service \
  --cluster fastapi-nextjs-poc-cluster \
  --service fastapi-nextjs-poc-frontend-service \
  --force-new-deployment
```

Or use Terraform to trigger a new deployment by updating the task definition.

## Troubleshooting

### View Logs

```bash
# Backend logs
aws logs tail /ecs/fastapi-nextjs-poc/backend --follow

# Frontend logs
aws logs tail /ecs/fastapi-nextjs-poc/frontend --follow
```

### Check Service Status

```bash
aws ecs describe-services \
  --cluster fastapi-nextjs-poc-cluster \
  --services fastapi-nextjs-poc-backend-service \
  --query 'services[0].{Status:status,Running:runningCount,Desired:desiredCount}'
```

### Check Task Status

```bash
aws ecs list-tasks \
  --cluster fastapi-nextjs-poc-cluster \
  --service-name fastapi-nextjs-poc-backend-service
```

### View Task Details

```bash
aws ecs describe-tasks \
  --cluster fastapi-nextjs-poc-cluster \
  --tasks <task-id>
```

## Cost Considerations

This POC setup is optimized for minimal cost:

- Single AZ (reduces NAT Gateway cost)
- Minimal task sizes
- Single task per service
- HTTP only (no SSL costs)

**Estimated monthly cost**: ~$30-50

## Cleanup

To destroy all resources:

```bash
terraform destroy
```

**Warning**: This will permanently delete all infrastructure and data.

## State Management

For this POC, Terraform state is stored locally. For production:

1. Use S3 backend for state storage
2. Enable DynamoDB for state locking
3. Configure versioning on S3 bucket

Example backend configuration:

```hcl
terraform {
  backend "s3" {
    bucket         = "your-terraform-state-bucket"
    key            = "fastapi-nextjs-poc/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}
```

## Security Best Practices

1. **Never commit sensitive data** in `terraform.tfvars`
2. **Use AWS Secrets Manager** for production secrets
3. **Enable encryption** for ECR repositories
4. **Use HTTPS** in production (ACM certificates)
5. **Implement least privilege** IAM policies
6. **Enable VPC Flow Logs** for network monitoring
7. **Use WAF** for application protection

## Support

For issues or questions:
1. Check CloudWatch logs
2. Review ECS service events
3. Verify security group rules
4. Check IAM permissions

