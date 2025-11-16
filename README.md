# 🚀 FastAPI + Next.js AWS ECS Deployment POC

<div align="center">

![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**A comprehensive Proof of Concept demonstrating Infrastructure as Code (IaC) deployment of a modern full-stack application to AWS ECS Fargate using Terraform**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=flat&logo=github)](https://github.com/NoManNayeem/Terraform_POC)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [System Architecture Diagram](#-system-architecture-diagram)
- [Deployment Flow](#-deployment-flow)
- [Project Structure](#-project-structure)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start Guide](#-quick-start-guide)
- [Local Development](#-local-development)
- [AWS Infrastructure Details](#-aws-infrastructure-details)
- [Deployment Workflow](#-deployment-workflow)
- [Monitoring & Logging](#-monitoring--logging)
- [Cost Analysis](#-cost-analysis)
- [Troubleshooting](#-troubleshooting)
- [Security Considerations](#-security-considerations)
- [Best Practices](#-best-practices)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

This project is a **Proof of Concept (POC)** that demonstrates a complete, production-ready infrastructure setup for deploying a modern full-stack application to AWS. It showcases:

- **Infrastructure as Code (IaC)** using Terraform
- **Containerized applications** with Docker
- **Serverless container orchestration** with AWS ECS Fargate
- **Modern web stack**: FastAPI (Python) backend + Next.js (React) frontend
- **Best practices** for cloud infrastructure deployment

### Key Features

✅ **Complete Infrastructure Automation** - All AWS resources defined in Terraform  
✅ **Containerized Applications** - Docker-based deployment  
✅ **Load Balancing** - Application Load Balancer for traffic distribution  
✅ **Network Isolation** - VPC with public/private subnets  
✅ **Monitoring** - CloudWatch integration for logs and metrics  
✅ **Security** - Security groups, IAM roles with least privilege  
✅ **Cost Optimized** - Minimal setup for POC (~$30-50/month)  
✅ **Scalable Architecture** - Ready for production enhancements  

---

## 🏗️ Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Internet"
        User[👤 Users]
    end
    
    subgraph "AWS Cloud"
        subgraph "Public Subnet"
            ALB[Application Load Balancer<br/>Port 80]
        end
        
        subgraph "Private Subnet"
            subgraph "ECS Fargate Cluster"
                FE[Frontend Service<br/>Next.js<br/>Port 3000]
                BE[Backend Service<br/>FastAPI<br/>Port 8000]
            end
        end
        
        subgraph "Storage & Registry"
            ECR[ECR Repositories<br/>Docker Images]
            CW[CloudWatch Logs]
        end
        
        subgraph "Networking"
            VPC[VPC 10.0.0.0/16]
            IGW[Internet Gateway]
            NAT[NAT Gateway]
        end
    end
    
    User -->|HTTP Requests| ALB
    ALB -->|/api/*| BE
    ALB -->|/*| FE
    FE -->|REST API Calls| BE
    BE -->|SQLite DB| BE
    FE -->|Pull Images| ECR
    BE -->|Pull Images| ECR
    FE -->|Logs| CW
    BE -->|Logs| CW
    ALB -.->|Public Access| IGW
    FE -.->|Internet Access| NAT
    BE -.->|Internet Access| NAT
    NAT -.->|Internet| IGW
```

### Component Interaction Flow

```mermaid
sequenceDiagram
    participant User
    participant ALB as Application Load Balancer
    participant FE as Frontend Service
    participant BE as Backend Service
    participant DB as SQLite Database
    participant CW as CloudWatch
    
    User->>ALB: HTTP Request (GET /)
    ALB->>FE: Route to Frontend
    FE->>ALB: HTML/JS Response
    ALB->>User: Serve Frontend
    
    User->>ALB: API Request (GET /api/items)
    ALB->>BE: Route to Backend
    BE->>DB: Query Database
    DB->>BE: Return Data
    BE->>ALB: JSON Response
    ALB->>User: Return API Data
    
    FE->>BE: REST API Call
    BE->>DB: Database Operation
    DB->>BE: Result
    BE->>FE: JSON Response
    
    BE->>CW: Log Events
    FE->>CW: Log Events
```

---

## 🗺️ System Architecture Diagram

### Detailed Infrastructure Components

```mermaid
mindmap
  root((AWS ECS POC))
    Networking
      VPC
        CIDR: 10.0.0.0/16
        DNS Enabled
      Public Subnet
        ALB Placement
        Internet Gateway
      Private Subnet
        ECS Tasks
        NAT Gateway
      Route Tables
        Public Routes
        Private Routes
    Compute
      ECS Fargate
        Cluster
        Backend Service
          0.5 vCPU
          1GB Memory
          Port 8000
        Frontend Service
          0.5 vCPU
          1GB Memory
          Port 3000
      Task Definitions
        Container Images
        Environment Variables
        Health Checks
    Storage & Registry
      ECR
        Backend Repository
        Frontend Repository
        Image Scanning
        Lifecycle Policies
    Load Balancing
      Application Load Balancer
        HTTP Listener
        Target Groups
        Health Checks
        Routing Rules
    Security
      Security Groups
        ALB SG
        ECS SG
      IAM Roles
        Task Execution Role
        Task Role
    Monitoring
      CloudWatch
        Log Groups
        Container Insights
        Metrics
```

---

## 📊 Deployment Flow

### Complete Deployment Process

```mermaid
flowchart TD
    Start([Start Deployment]) --> CheckPrereq{Check Prerequisites}
    CheckPrereq -->|Missing| Install[Install Tools]
    CheckPrereq -->|Ready| ConfigAWS[Configure AWS CLI]
    Install --> ConfigAWS
    
    ConfigAWS --> InitTerraform[Initialize Terraform]
    InitTerraform --> PlanTerraform[Terraform Plan]
    PlanTerraform --> ReviewPlan{Review Plan}
    ReviewPlan -->|Reject| ModifyConfig[Modify Configuration]
    ReviewPlan -->|Approve| ApplyTerraform[Terraform Apply]
    ModifyConfig --> PlanTerraform
    
    ApplyTerraform --> CreateInfra[Create Infrastructure]
    CreateInfra --> VPC[Create VPC & Subnets]
    VPC --> ECR[Create ECR Repositories]
    ECR --> ECS[Create ECS Cluster]
    ECS --> ALB[Create Load Balancer]
    ALB --> GetALBDNS[Get ALB DNS Name]
    
    GetALBDNS --> UpdateEnv[Update Frontend Env Vars]
    UpdateEnv --> BuildBackend[Build Backend Image]
    BuildBackend --> PushBackend[Push to ECR]
    PushBackend --> BuildFrontend[Build Frontend Image]
    BuildFrontend --> PushFrontend[Push to ECR]
    
    PushFrontend --> DeployServices[Deploy ECS Services]
    DeployServices --> HealthCheck{Health Checks Pass?}
    HealthCheck -->|No| Troubleshoot[Troubleshoot]
    HealthCheck -->|Yes| Verify[Verify Deployment]
    Troubleshoot --> HealthCheck
    
    Verify --> Success([Deployment Successful!])
    Success --> AccessApp[Access Application]
    
    style Start fill:#90EE90
    style Success fill:#90EE90
    style HealthCheck fill:#FFD700
    style Troubleshoot fill:#FF6B6B
```

### Deployment States

```mermaid
stateDiagram-v2
    [*] --> Planning: Initialize Project
    Planning --> Configuring: Set Variables
    Configuring --> Provisioning: Terraform Apply
    Provisioning --> Building: Build Docker Images
    Building --> Pushing: Push to ECR
    Pushing --> Deploying: Deploy to ECS
    Deploying --> Healthy: Health Checks Pass
    Deploying --> Unhealthy: Health Checks Fail
    Unhealthy --> Troubleshooting: Debug Issues
    Troubleshooting --> Deploying: Fix & Redeploy
    Healthy --> Running: Application Live
    Running --> Updating: Code Changes
    Updating --> Building: Rebuild Images
    Running --> [*]: Destroy Infrastructure
```

---

## 📁 Project Structure

```
Terraform_POC/
│
├── 📂 backend/                          # FastAPI Backend Application
│   ├── 📂 app/
│   │   ├── 📂 api/
│   │   │   ├── __init__.py
│   │   │   └── routes.py               # API endpoints
│   │   ├── 📂 core/
│   │   │   ├── __init__.py
│   │   │   └── config.py               # Configuration management
│   │   ├── 📂 models/
│   │   │   ├── __init__.py
│   │   │   └── database.py             # Database setup
│   │   ├── __init__.py
│   │   └── main.py                     # FastAPI app entry point
│   ├── Dockerfile                      # Backend container definition
│   ├── requirements.txt                # Python dependencies
│   ├── .env.example                    # Environment variables template
│   └── .dockerignore
│
├── 📂 frontend/                        # Next.js Frontend Application
│   ├── 📂 src/
│   │   ├── 📂 app/
│   │   │   ├── layout.tsx              # Root layout
│   │   │   ├── page.tsx                # Home page
│   │   │   └── globals.css             # Global styles
│   │   └── 📂 lib/
│   │       └── api.ts                  # API client
│   ├── Dockerfile                      # Frontend container definition
│   ├── package.json                    # Node.js dependencies
│   ├── next.config.js                  # Next.js configuration
│   ├── tsconfig.json                   # TypeScript configuration
│   ├── .env.example                    # Environment variables template
│   ├── .dockerignore
│   └── .gitignore
│
├── 📂 terraform/                       # Infrastructure as Code
│   ├── main.tf                         # Provider & locals
│   ├── variables.tf                    # Input variables
│   ├── outputs.tf                      # Output values
│   ├── terraform.tfvars                # Variable values (gitignored)
│   ├── terraform.tfvars.example        # Example variables
│   ├── vpc.tf                          # VPC & networking
│   ├── ecr.tf                          # Container registry
│   ├── ecs.tf                          # ECS cluster & services
│   ├── alb.tf                          # Load balancer
│   ├── security-groups.tf             # Security rules
│   ├── iam.tf                          # IAM roles & policies
│   ├── cloudwatch.tf                   # Logging
│   └── README.md                       # Terraform documentation
│
├── 📂 scripts/                         # Deployment Scripts
│   ├── build-and-push.sh              # Build & push Docker images
│   └── deploy.sh                       # Terraform deployment
│
├── docker-compose.yml                  # Local development setup
├── .gitignore                          # Git ignore rules
└── README.md                           # This file
```

---

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Python 3.11** - Programming language
- **SQLite3** - Lightweight database (POC)
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **python-dotenv** - Environment variable management

### Frontend
- **Next.js 14** - React framework with SSR
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI library
- **Standalone Mode** - Optimized Docker builds

### Infrastructure
- **Terraform** - Infrastructure as Code
- **AWS ECS Fargate** - Serverless container orchestration
- **AWS ECR** - Container registry
- **AWS VPC** - Virtual private cloud
- **AWS ALB** - Application Load Balancer
- **AWS CloudWatch** - Monitoring & logging
- **Docker** - Containerization

---

## 📋 Prerequisites

### Required Software

| Tool | Version | Purpose | Installation |
|------|---------|---------|--------------|
| **AWS CLI** | Latest | AWS service management | [Install Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) |
| **Terraform** | >= 1.0 | Infrastructure provisioning | [Install Guide](https://developer.hashicorp.com/terraform/downloads) |
| **Docker** | Latest | Container builds | [Install Guide](https://docs.docker.com/get-docker/) |
| **Node.js** | >= 18 | Frontend development | [Install Guide](https://nodejs.org/) |
| **Python** | >= 3.11 | Backend development | [Install Guide](https://www.python.org/downloads/) |
| **Git** | Latest | Version control | [Install Guide](https://git-scm.com/downloads) |

### AWS Account Setup

1. **Create AWS Account** (if you don't have one)
   - Sign up at [aws.amazon.com](https://aws.amazon.com)

2. **Configure AWS CLI**
   ```bash
   aws configure
   # Enter your Access Key ID
   # Enter your Secret Access Key
   # Enter default region (e.g., us-east-1)
   # Enter default output format (json)
   ```

3. **Required IAM Permissions**
   Your AWS user/role needs permissions for:
   - VPC (create, modify, delete)
   - ECS (full access)
   - ECR (full access)
   - ALB (full access)
   - IAM (create roles)
   - CloudWatch (create log groups)
   - EC2 (for networking components)

   **Quick Setup**: Use `AdministratorAccess` policy for POC (not recommended for production)

---

## 🚀 Quick Start Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/NoManNayeem/Terraform_POC.git
cd Terraform_POC
```

### Step 2: Configure Environment Variables

#### Backend Configuration

```bash
cd backend
cp .env.example .env
# Edit .env with your values
```

#### Frontend Configuration

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your values
```

### Step 3: Configure Terraform

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

```hcl
aws_region   = "us-east-1"  # Change to your preferred region
project_name = "fastapi-nextjs-poc"
environment  = "dev"

backend_env_vars = {
  DATABASE_URL = "sqlite:///./app.db"
  SECRET_KEY   = "your-secret-key-here"
  DEBUG        = "false"
}

frontend_env_vars = {
  NEXT_PUBLIC_API_URL = "http://your-alb-dns-name/api"
  # Note: Update this after ALB is created
}
```

### Step 4: Deploy Infrastructure

```bash
cd terraform

# Initialize Terraform
terraform init

# Review what will be created
terraform plan

# Apply configuration (creates all AWS resources)
terraform apply
```

**Expected Output:**
```
Apply complete! Resources: 25 added, 0 changed, 0 destroyed.

Outputs:
alb_dns_name = "fastapi-nextjs-poc-alb-1234567890.us-east-1.elb.amazonaws.com"
backend_ecr_repository_url = "123456789012.dkr.ecr.us-east-1.amazonaws.com/fastapi-nextjs-poc-backend"
frontend_ecr_repository_url = "123456789012.dkr.ecr.us-east-1.amazonaws.com/fastapi-nextjs-poc-frontend"
```

### Step 5: Update Frontend Environment Variable

After getting the ALB DNS name, update `terraform.tfvars`:

```hcl
frontend_env_vars = {
  NEXT_PUBLIC_API_URL = "http://fastapi-nextjs-poc-alb-1234567890.us-east-1.elb.amazonaws.com/api"
}
```

Then reapply:

```bash
terraform apply
```

### Step 6: Build and Push Docker Images

```bash
# From project root
./scripts/build-and-push.sh all
```

This will:
1. Authenticate Docker to ECR
2. Build backend image
3. Push backend to ECR
4. Build frontend image
5. Push frontend to ECR

### Step 7: Access Your Application

```bash
cd terraform
terraform output alb_dns_name
```

Access URLs:
- **Frontend**: `http://<alb-dns-name>/`
- **Backend API**: `http://<alb-dns-name>/api/`
- **API Documentation**: `http://<alb-dns-name>/docs`
- **Health Check**: `http://<alb-dns-name>/health`

---

## 📋 Complete Deployment Guide

This section provides a comprehensive, step-by-step guide to deploy the entire project to AWS, including all secrets, credentials, and commands needed.

### Prerequisites Checklist

Before starting, ensure you have:

- [ ] AWS Account created and active
- [ ] AWS CLI installed and configured
- [ ] Terraform installed (>= 1.0)
- [ ] Docker installed and running
- [ ] Git installed
- [ ] Terminal/Command line access

### Step-by-Step Deployment Instructions

#### Step 1: Clone the Repository

```bash
git clone https://github.com/NoManNayeem/Terraform_POC.git
cd Terraform_POC
```

#### Step 2: Configure AWS Credentials

**Option A: Using AWS CLI (Recommended)**

```bash
aws configure
```

You'll be prompted to enter:
- **AWS Access Key ID**: `AKIAIOSFODNN7EXAMPLE` (your actual access key)
- **AWS Secret Access Key**: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` (your actual secret key)
- **Default region name**: `us-east-1` (or your preferred region)
- **Default output format**: `json`

**Option B: Using Environment Variables**

```bash
export AWS_ACCESS_KEY_ID="your-access-key-id"
export AWS_SECRET_ACCESS_KEY="your-secret-access-key"
export AWS_DEFAULT_REGION="us-east-1"
```

**Option C: Using AWS Profiles**

```bash
aws configure --profile terraform-poc
# Enter credentials when prompted
export AWS_PROFILE=terraform-poc
```

**Verify AWS Configuration:**

```bash
aws sts get-caller-identity
```

Expected output:
```json
{
    "UserId": "AIDAIOSFODNN7EXAMPLE",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/your-username"
}
```

#### Step 3: Configure Backend Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `.env` file with your preferred editor:

```bash
# Using nano
nano .env

# Or using vim
vim .env

# Or using VS Code
code .env
```

**Required values in `.env`:**

```env
# Database Configuration
DATABASE_URL=sqlite:///./app.db

# Security - IMPORTANT: Change this to a secure random string
SECRET_KEY=your-super-secret-key-change-this-in-production-min-32-chars

# Debug Mode (set to false for production)
DEBUG=false

# Server Configuration
HOST=0.0.0.0
PORT=8000
```

**Generate a secure SECRET_KEY:**

```bash
# Using Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Using OpenSSL
openssl rand -hex 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Step 4: Configure Frontend Environment Variables

```bash
cd ../frontend
cp .env.example .env.local
```

Edit `.env.local` file:

```env
# Backend API URL
# For local development, use: http://localhost:8000/api
# For production, this will be updated after ALB is created
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Note:** We'll update this with the actual ALB DNS name after infrastructure is deployed.

#### Step 5: Configure Terraform Variables

```bash
cd ../terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your values:

```hcl
# AWS Configuration
aws_region   = "us-east-1"  # Change to your preferred region
project_name = "fastapi-nextjs-poc"
environment  = "dev"

# Backend Environment Variables
# These will be passed to the ECS task
backend_env_vars = {
  DATABASE_URL = "sqlite:///./app.db"
  SECRET_KEY   = "your-super-secret-key-change-this-min-32-chars"
  DEBUG        = "false"
  HOST         = "0.0.0.0"
  PORT         = "8000"
}

# Frontend Environment Variables
# Note: NEXT_PUBLIC_API_URL will be updated after ALB is created
frontend_env_vars = {
  NEXT_PUBLIC_API_URL = "http://placeholder-will-update-after-alb-creation/api"
}
```

**Important:** 
- Replace `SECRET_KEY` with the same secure key you used in backend `.env`
- The `NEXT_PUBLIC_API_URL` is a placeholder - we'll update it in Step 8

#### Step 6: Initialize Terraform

```bash
cd terraform
terraform init
```

Expected output:
```
Initializing the backend...

Initializing provider plugins...
- Finding hashicorp/aws versions matching "~> 5.0"...
- Installing hashicorp/aws v5.x.x...
...

Terraform has been successfully initialized!
```

#### Step 7: Review Terraform Plan

```bash
terraform plan
```

This shows what resources will be created. Review carefully:

- **Expected resources:** ~25 resources
- **Estimated cost:** ~$66/month
- **Resources include:** VPC, Subnets, NAT Gateway, ALB, ECS Cluster, ECR Repositories, etc.

**Common issues and fixes:**

```bash
# If you get authentication errors
aws configure list
aws sts get-caller-identity

# If you get region errors
export AWS_DEFAULT_REGION="us-east-1"

# If you get permission errors
# Ensure your IAM user has AdministratorAccess or required permissions
```

#### Step 8: Deploy Infrastructure

```bash
terraform apply
```

You'll be prompted to confirm:
```
Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes
```

**Type `yes` and press Enter.**

**Expected output:**
```
Apply complete! Resources: 25 added, 0 changed, 0 destroyed.

Outputs:

alb_dns_name = "fastapi-nextjs-poc-alb-1234567890.us-east-1.elb.amazonaws.com"
alb_zone_id = "Z1D633PJN98FT9"
backend_ecr_repository_url = "123456789012.dkr.ecr.us-east-1.amazonaws.com/fastapi-nextjs-poc-backend"
frontend_ecr_repository_url = "123456789012.dkr.ecr.us-east-1.amazonaws.com/fastapi-nextjs-poc-frontend"
backend_service_name = "fastapi-nextjs-poc-backend-service"
frontend_service_name = "fastapi-nextjs-poc-frontend-service"
vpc_id = "vpc-0123456789abcdef0"
application_url = "http://fastapi-nextjs-poc-alb-1234567890.us-east-1.elb.amazonaws.com"
backend_api_url = "http://fastapi-nextjs-poc-alb-1234567890.us-east-1.elb.amazonaws.com/api"
```

**Save the ALB DNS name** - you'll need it in the next step!

#### Step 9: Update Frontend Environment Variable

Get the ALB DNS name:

```bash
terraform output alb_dns_name
```

Update `terraform.tfvars`:

```bash
# Edit terraform.tfvars
nano terraform.tfvars
# or
vim terraform.tfvars
```

Update the `frontend_env_vars` section:

```hcl
frontend_env_vars = {
  NEXT_PUBLIC_API_URL = "http://fastapi-nextjs-poc-alb-1234567890.us-east-1.elb.amazonaws.com/api"
  # Replace with your actual ALB DNS name from terraform output
}
```

**Reapply Terraform:**

```bash
terraform apply
```

Type `yes` when prompted.

#### Step 10: Build and Push Docker Images

**Option A: Using the provided script (Recommended)**

```bash
# From project root directory
cd ..
./scripts/build-and-push.sh all
```

**Option B: Manual build and push**

**Backend:**

```bash
# Get AWS account ID and region
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=$(aws configure get region)

# Get ECR login token
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Get ECR repository URL
ECR_REPO=$(cd terraform && terraform output -raw backend_ecr_repository_url)

# Build backend image
cd backend
docker build -t backend:latest .

# Tag image
docker tag backend:latest $ECR_REPO:latest

# Push image
docker push $ECR_REPO:latest
```

**Frontend:**

```bash
# Get ECR repository URL
ECR_REPO=$(cd terraform && terraform output -raw frontend_ecr_repository_url)

# Build frontend image
cd frontend
docker build -t frontend:latest .

# Tag image
docker tag frontend:latest $ECR_REPO:latest

# Push image
docker push $ECR_REPO:latest
```

**Verify images are pushed:**

```bash
# List backend images
aws ecr list-images --repository-name fastapi-nextjs-poc-backend

# List frontend images
aws ecr list-images --repository-name fastapi-nextjs-poc-frontend
```

#### Step 11: Verify ECS Services are Running

**Check service status:**

```bash
# Get cluster name
CLUSTER_NAME=$(cd terraform && terraform output -raw project_name)-cluster

# Check backend service
aws ecs describe-services \
  --cluster $CLUSTER_NAME \
  --services fastapi-nextjs-poc-backend-service \
  --query 'services[0].{Status:status,Running:runningCount,Desired:desiredCount,Events:events[0:3]}'

# Check frontend service
aws ecs describe-services \
  --cluster $CLUSTER_NAME \
  --services fastapi-nextjs-poc-frontend-service \
  --query 'services[0].{Status:status,Running:runningCount,Desired:desiredCount,Events:events[0:3]}'
```

**Check task status:**

```bash
# List running tasks
aws ecs list-tasks --cluster $CLUSTER_NAME

# Get task details
TASK_ARN=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name fastapi-nextjs-poc-backend-service --query 'taskArns[0]' --output text)
aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $TASK_ARN
```

**View logs:**

```bash
# Backend logs
aws logs tail /ecs/fastapi-nextjs-poc/backend --follow

# Frontend logs
aws logs tail /ecs/fastapi-nextjs-poc/frontend --follow
```

#### Step 12: Verify Application is Accessible

Get the ALB DNS name:

```bash
cd terraform
ALB_DNS=$(terraform output -raw alb_dns_name)
echo "Application URL: http://$ALB_DNS"
```

**Test endpoints:**

```bash
# Health check
curl http://$ALB_DNS/health

# Backend API health
curl http://$ALB_DNS/api/health

# Frontend (should return HTML)
curl http://$ALB_DNS/

# API endpoint
curl http://$ALB_DNS/api/items
```

**Expected responses:**

- Health check: `{"status":"healthy","service":"backend"}`
- API items: `[]` (empty array initially)
- Frontend: HTML content

#### Step 13: Access Your Application

Open in browser:

- **Frontend**: `http://<alb-dns-name>/`
- **Backend API**: `http://<alb-dns-name>/api/`
- **API Documentation**: `http://<alb-dns-name>/docs`
- **Health Check**: `http://<alb-dns-name>/health`

### Quick Reference: All Commands in Order

```bash
# 1. Clone repository
git clone https://github.com/NoManNayeem/Terraform_POC.git
cd Terraform_POC

# 2. Configure AWS
aws configure

# 3. Configure backend
cd backend
cp .env.example .env
# Edit .env with your values

# 4. Configure frontend
cd ../frontend
cp .env.example .env.local
# Edit .env.local (will update after ALB creation)

# 5. Configure Terraform
cd ../terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# 6. Initialize and deploy
terraform init
terraform plan
terraform apply  # Type 'yes' when prompted

# 7. Get ALB DNS name
terraform output alb_dns_name

# 8. Update terraform.tfvars with ALB DNS name
# Edit terraform.tfvars: Update NEXT_PUBLIC_API_URL
terraform apply  # Type 'yes' when prompted

# 9. Build and push images
cd ..
./scripts/build-and-push.sh all

# 10. Verify deployment
cd terraform
terraform output alb_dns_name
# Test in browser or with curl
```

### Secrets and Credentials Summary

| Secret/Credential | Where to Get/Set | Location |
|-------------------|------------------|----------|
| **AWS Access Key ID** | AWS IAM Console → Users → Security Credentials | `aws configure` or environment variable |
| **AWS Secret Access Key** | AWS IAM Console → Users → Security Credentials | `aws configure` or environment variable |
| **AWS Region** | Choose your preferred region | `terraform.tfvars` or `aws configure` |
| **Backend SECRET_KEY** | Generate using Python/OpenSSL | `backend/.env` and `terraform.tfvars` |
| **ALB DNS Name** | From Terraform output | `terraform.tfvars` (frontend_env_vars) |
| **ECR Repository URLs** | From Terraform output | Used automatically by build script |

### Troubleshooting Common Issues

**Issue: "Unable to locate credentials"**

```bash
# Check AWS configuration
aws configure list
aws sts get-caller-identity

# Reconfigure if needed
aws configure
```

**Issue: "Error creating ECR repository: AccessDenied"**

```bash
# Check IAM permissions
aws iam get-user
aws iam list-attached-user-policies --user-name your-username

# Ensure you have ECR permissions or AdministratorAccess
```

**Issue: "Docker push failed: no basic auth credentials"**

```bash
# Re-authenticate Docker to ECR
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=$(aws configure get region)
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
```

**Issue: "ECS tasks not starting"**

```bash
# Check service events
aws ecs describe-services \
  --cluster fastapi-nextjs-poc-cluster \
  --services fastapi-nextjs-poc-backend-service

# Check task logs
aws logs tail /ecs/fastapi-nextjs-poc/backend --follow
```

**Issue: "502 Bad Gateway"**

```bash
# Check target group health
aws elbv2 describe-target-health \
  --target-group-arn $(aws elbv2 describe-target-groups --names fastapi-nextjs-poc-backend-tg --query 'TargetGroups[0].TargetGroupArn' --output text)

# Check security groups
aws ec2 describe-security-groups --filters "Name=group-name,Values=fastapi-nextjs-poc-*"
```

### Post-Deployment Checklist

- [ ] Application is accessible via ALB DNS name
- [ ] Frontend loads correctly
- [ ] Backend API responds to requests
- [ ] Health checks are passing
- [ ] CloudWatch logs are being generated
- [ ] ECS tasks are running and healthy
- [ ] Docker images are in ECR
- [ ] Security groups are configured correctly

### Cost Monitoring

**Set up billing alerts:**

```bash
# Create a budget (requires AWS Budgets access)
aws budgets create-budget \
  --account-id $(aws sts get-caller-identity --query Account --output text) \
  --budget file://budget.json
```

**Monitor costs:**

- AWS Cost Explorer: https://console.aws.amazon.com/cost-management/home
- Set up billing alerts in AWS Billing Console
- Estimated monthly cost: ~$66/month for this POC setup

---

## 💻 Local Development

### Backend Development

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your values

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend available at: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Run development server
npm run dev
```

Frontend available at: `http://localhost:3000`

### Docker Compose (Local)

Run the entire stack locally using Docker Compose:

#### Prerequisites

- Docker installed and running
- Docker Compose installed (usually included with Docker Desktop)

#### Quick Start

```bash
# From project root directory
docker-compose up -d
```

This will:
1. Build Docker images for both backend and frontend
2. Start both services
3. Set up networking between containers
4. Mount volumes for development

#### Access the Application

Once containers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

#### Useful Commands

```bash
# Start services in detached mode
docker-compose up -d

# Start services and view logs
docker-compose up

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Stop and remove volumes (cleans database)
docker-compose down -v

# Rebuild images (after code changes)
docker-compose up -d --build

# Restart a specific service
docker-compose restart backend
docker-compose restart frontend

# Check service status
docker-compose ps

# Execute commands in running container
docker-compose exec backend bash
docker-compose exec frontend sh

# View container resource usage
docker stats
```

#### Environment Variables

The `docker-compose.yml` file includes default environment variables. To customize:

**Option 1: Edit docker-compose.yml directly**

```yaml
environment:
  - DATABASE_URL=sqlite:///./app.db
  - SECRET_KEY=your-custom-secret-key
  - DEBUG=true
```

**Option 2: Use .env file**

Create a `.env` file in the project root:

```env
BACKEND_SECRET_KEY=your-secret-key-here
BACKEND_DEBUG=true
FRONTEND_API_URL=http://localhost:8000/api
```

Then reference in `docker-compose.yml`:

```yaml
environment:
  - SECRET_KEY=${BACKEND_SECRET_KEY}
  - DEBUG=${BACKEND_DEBUG}
```

#### Troubleshooting

**Issue: Port already in use**

```bash
# Check what's using the port
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Change ports in docker-compose.yml
ports:
  - "8001:8000"  # Use 8001 instead of 8000
```

**Issue: Containers won't start**

```bash
# Check logs
docker-compose logs

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

**Issue: Frontend can't connect to backend**

The frontend uses `http://localhost:8000/api` for browser requests, but inside Docker it should use `http://backend:8000/api`. The docker-compose.yml handles this with different URLs for internal vs external access.

**Issue: Database not persisting**

```bash
# Check volume
docker volume ls
docker volume inspect terraform_backend-data

# Reset database
docker-compose down -v
docker-compose up -d
```

**Issue: Changes not reflecting**

```bash
# Rebuild and restart
docker-compose up -d --build

# Or restart specific service
docker-compose restart backend
```

#### Development Workflow

1. **Make code changes** in `backend/` or `frontend/`
2. **For backend**: Changes are reflected immediately (volume mount)
3. **For frontend**: Rebuild required for Next.js changes
   ```bash
   docker-compose up -d --build frontend
   ```

#### Production-like Testing

To test production builds locally:

```bash
# Build production images
docker-compose -f docker-compose.yml build

# Run with production settings
docker-compose up -d
```

#### Clean Up

```bash
# Stop and remove containers
docker-compose down

# Remove containers, volumes, and images
docker-compose down -v --rmi all

# Remove all unused Docker resources
docker system prune -a
```

---

## ☁️ AWS Infrastructure Details

### Network Architecture

```mermaid
graph LR
    subgraph "VPC (10.0.0.0/16)"
        subgraph "Public Subnet (10.0.0.0/24)"
            ALB[Application Load Balancer]
            IGW[Internet Gateway]
        end
        
        subgraph "Private Subnet (10.0.1.0/24)"
            ECS[ECS Fargate Tasks]
            NAT[NAT Gateway]
        end
    end
    
    Internet[Internet] -->|HTTP/HTTPS| IGW
    IGW <--> ALB
    ALB -->|Traffic| ECS
    ECS -->|Outbound| NAT
    NAT -->|Internet Access| IGW
```

### Resource Specifications

#### VPC Configuration
- **CIDR Block**: `10.0.0.0/16`
- **Public Subnet**: `10.0.0.0/24` (ALB placement)
- **Private Subnet**: `10.0.1.0/24` (ECS tasks)
- **Availability Zone**: Single AZ (cost optimization)

#### ECS Services

| Service | CPU | Memory | Port | Health Check |
|---------|-----|--------|------|--------------|
| Backend | 0.5 vCPU (512) | 1 GB | 8000 | `/health` |
| Frontend | 0.5 vCPU (512) | 1 GB | 3000 | `/` |

#### Load Balancer
- **Type**: Application Load Balancer (Layer 7)
- **Protocol**: HTTP (port 80)
- **Routing Rules**:
  - `/api/*` → Backend target group
  - `/*` → Frontend target group

### Security Groups

```mermaid
graph TD
    ALB_SG[ALB Security Group]
    ECS_SG[ECS Security Group]
    
    ALB_SG -->|Allow| HTTP[HTTP:80 from 0.0.0.0/0]
    ALB_SG -->|Allow| HTTPS[HTTPS:443 from 0.0.0.0/0]
    ALB_SG -->|Allow| Outbound[All Outbound]
    
    ECS_SG -->|Allow| FromALB[TCP:0-65535 from ALB SG]
    ECS_SG -->|Allow| Outbound2[All Outbound]
    
    Internet[Internet] -->|HTTP| ALB_SG
    ALB_SG -->|Forward| ECS_SG
```

### IAM Roles

1. **ECS Task Execution Role**
   - Pull images from ECR
   - Write logs to CloudWatch
   - Managed policy: `AmazonECSTaskExecutionRolePolicy`

2. **ECS Task Role**
   - Application-level permissions
   - Currently minimal (can be extended)

---

## 🔄 Deployment Workflow

### Complete Deployment Pipeline

```mermaid
flowchart LR
    A[Code Changes] --> B[Build Docker Images]
    B --> C[Push to ECR]
    C --> D[Update ECS Service]
    D --> E[Health Checks]
    E --> F{Healthy?}
    F -->|Yes| G[Traffic Routing]
    F -->|No| H[Rollback]
    H --> D
    G --> I[Application Live]
```

### Manual Deployment Steps

1. **Make Code Changes**
   ```bash
   # Edit backend or frontend code
   ```

2. **Build and Push Images**
   ```bash
   ./scripts/build-and-push.sh all
   ```

3. **Force ECS Service Update**
   ```bash
   aws ecs update-service \
     --cluster fastapi-nextjs-poc-cluster \
     --service fastapi-nextjs-poc-backend-service \
     --force-new-deployment
   ```

### Automated Deployment (Future)

For production, consider:
- GitHub Actions CI/CD
- Automated testing
- Blue/Green deployments
- Canary releases

---

## 📊 Monitoring & Logging

### CloudWatch Integration

```mermaid
graph TD
    ECS[ECS Services] -->|Logs| CW[CloudWatch Logs]
    ECS -->|Metrics| Metrics[CloudWatch Metrics]
    
    CW --> LogGroups[Log Groups]
    LogGroups --> BackendLogs[/ecs/fastapi-nextjs-poc/backend]
    LogGroups --> FrontendLogs[/ecs/fastapi-nextjs-poc/frontend]
    
    Metrics --> ContainerInsights[Container Insights]
    ContainerInsights --> CPU[CPU Utilization]
    ContainerInsights --> Memory[Memory Utilization]
    ContainerInsights --> Network[Network Metrics]
```

### Viewing Logs

```bash
# Backend logs
aws logs tail /ecs/fastapi-nextjs-poc/backend --follow

# Frontend logs
aws logs tail /ecs/fastapi-nextjs-poc/frontend --follow

# Filter logs
aws logs filter-log-events \
  --log-group-name /ecs/fastapi-nextjs-poc/backend \
  --filter-pattern "ERROR"
```

### Key Metrics to Monitor

- **CPU Utilization** - Should stay below 80%
- **Memory Utilization** - Should stay below 80%
- **Request Count** - Track API calls
- **Error Rate** - Monitor 4xx/5xx responses
- **Response Time** - API latency
- **Task Count** - Running vs desired tasks

---

## 💰 Cost Analysis

### Monthly Cost Breakdown (POC)

| Service | Configuration | Estimated Cost |
|---------|--------------|----------------|
| **NAT Gateway** | Single AZ | ~$32/month |
| **Application Load Balancer** | 1 ALB | ~$16/month |
| **ECS Fargate** | 2 tasks (0.5 vCPU, 1GB each) | ~$15/month |
| **ECR** | Storage (minimal) | ~$0.10/month |
| **CloudWatch** | Logs & Metrics | ~$2/month |
| **Data Transfer** | Minimal | ~$1/month |
| **Total** | | **~$66/month** |

### Cost Optimization Tips

1. **Use Single AZ** (already implemented)
2. **Minimal Task Sizes** (already implemented)
3. **Stop Services When Not in Use**
   ```bash
   # Scale down to 0
   aws ecs update-service \
     --cluster fastapi-nextjs-poc-cluster \
     --service fastapi-nextjs-poc-backend-service \
     --desired-count 0
   ```
4. **Use Reserved Capacity** (for production)
5. **Monitor and Optimize** resource usage

### Cost Alerts

Set up AWS Budgets to monitor spending:
```bash
aws budgets create-budget \
  --account-id YOUR_ACCOUNT_ID \
  --budget file://budget.json
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. ECS Tasks Not Starting

**Symptoms**: Tasks stuck in PENDING or STOPPED state

**Diagnosis**:
```bash
# Check service events
aws ecs describe-services \
  --cluster fastapi-nextjs-poc-cluster \
  --services fastapi-nextjs-poc-backend-service

# Check task details
aws ecs describe-tasks \
  --cluster fastapi-nextjs-poc-cluster \
  --tasks TASK_ID
```

**Common Causes**:
- Image not found in ECR → Push images
- Insufficient permissions → Check IAM roles
- Health check failures → Check application logs
- Resource constraints → Increase CPU/memory

#### 2. Health Check Failures

**Symptoms**: Tasks constantly restarting

**Solutions**:
```bash
# Check application logs
aws logs tail /ecs/fastapi-nextjs-poc/backend --follow

# Verify health endpoint
curl http://<alb-dns>/health

# Adjust health check settings in terraform/ecs.tf
```

#### 3. Cannot Access Application

**Symptoms**: 502 Bad Gateway or connection timeout

**Checklist**:
- [ ] ALB security group allows HTTP from internet
- [ ] ECS security group allows traffic from ALB
- [ ] Target groups are healthy
- [ ] Tasks are running
- [ ] Application is listening on correct port

#### 4. Images Not Found

**Symptoms**: Task fails with "CannotPullContainerError"

**Solution**:
```bash
# Verify image exists
aws ecr describe-images \
  --repository-name fastapi-nextjs-poc-backend

# Rebuild and push
./scripts/build-and-push.sh all
```

#### 5. Terraform Apply Fails

**Common Errors**:
- **Insufficient permissions** → Check IAM policies
- **Resource limits** → Check AWS service quotas
- **Invalid configuration** → Run `terraform validate`

---

## 🔒 Security Considerations

### Current Security Measures

```mermaid
graph TD
    Security[Security Layers]
    
    Security --> Network[Network Security]
    Security --> Access[Access Control]
    Security --> Data[Data Protection]
    Security --> Monitoring[Security Monitoring]
    
    Network --> VPC[VPC Isolation]
    Network --> SG[Security Groups]
    Network --> PrivateSubnet[Private Subnets]
    
    Access --> IAM[IAM Roles]
    Access --> LeastPrivilege[Least Privilege]
    
    Data --> Encryption[Encryption at Rest]
    Data --> Transit[Encryption in Transit]
    
    Monitoring --> CloudWatch[CloudWatch Logs]
    Monitoring --> Alerts[Security Alerts]
```

### Security Best Practices

1. **Network Security**
   - ✅ ECS tasks in private subnets
   - ✅ Security groups with least privilege
   - ⚠️ Add WAF for production
   - ⚠️ Use HTTPS (ACM certificates)

2. **Access Control**
   - ✅ IAM roles with minimal permissions
   - ⚠️ Use AWS Secrets Manager for sensitive data
   - ⚠️ Enable MFA for AWS accounts
   - ⚠️ Rotate access keys regularly

3. **Data Protection**
   - ⚠️ Enable ECR image scanning
   - ⚠️ Use encrypted EBS volumes
   - ⚠️ Encrypt CloudWatch logs
   - ⚠️ Use RDS with encryption for production

4. **Monitoring**
   - ✅ CloudWatch logging enabled
   - ⚠️ Set up CloudWatch alarms
   - ⚠️ Enable VPC Flow Logs
   - ⚠️ Use AWS GuardDuty

### Production Security Checklist

- [ ] Enable HTTPS with ACM certificates
- [ ] Use AWS Secrets Manager for secrets
- [ ] Enable VPC Flow Logs
- [ ] Set up WAF rules
- [ ] Enable ECR image scanning
- [ ] Use encrypted EBS volumes
- [ ] Implement network ACLs
- [ ] Set up CloudWatch alarms
- [ ] Enable AWS GuardDuty
- [ ] Regular security audits

---

## ✅ Best Practices

### Infrastructure as Code

- ✅ **Modular Structure** - Separate files by resource type
- ✅ **Version Control** - All code in Git
- ✅ **Documentation** - Comprehensive README
- ⚠️ **Remote State** - Use S3 backend for production
- ⚠️ **State Locking** - Use DynamoDB for state locks

### Application Development

- ✅ **Environment Variables** - Use .env files
- ✅ **Health Checks** - Implement proper health endpoints
- ✅ **Error Handling** - Comprehensive error handling
- ✅ **Logging** - Structured logging
- ⚠️ **Testing** - Add unit and integration tests

### Deployment

- ✅ **Containerization** - Docker for consistency
- ✅ **Image Tagging** - Use version tags
- ⚠️ **CI/CD** - Automate deployments
- ⚠️ **Blue/Green** - Zero-downtime deployments
- ⚠️ **Rollback Strategy** - Plan for failures

### Monitoring

- ✅ **CloudWatch Logs** - Centralized logging
- ✅ **Health Checks** - Automated health monitoring
- ⚠️ **Metrics Dashboard** - Visualize metrics
- ⚠️ **Alarms** - Set up alerts
- ⚠️ **Distributed Tracing** - Use X-Ray

---

## 🚀 Future Enhancements

### Infrastructure Improvements

```mermaid
mindmap
  root((Future Enhancements))
    High Availability
      Multi-AZ Deployment
      Auto Scaling
      Load Balancing
    Security
      HTTPS/SSL
      WAF
      Secrets Manager
      VPC Endpoints
    Database
      RDS PostgreSQL
      RDS MySQL
      DynamoDB
      ElastiCache
    CI/CD
      GitHub Actions
      GitLab CI
      CodePipeline
      Automated Testing
    Monitoring
      CloudWatch Dashboards
      X-Ray Tracing
      Prometheus
      Grafana
    Cost Optimization
      Reserved Instances
      Spot Instances
      Auto Scaling Policies
      Cost Alerts
```

### Planned Features

1. **High Availability**
   - Multi-AZ deployment
   - Auto-scaling groups
   - Database replication

2. **Security**
   - HTTPS with ACM certificates
   - AWS WAF integration
   - Secrets Manager integration
   - VPC endpoints

3. **Database**
   - RDS PostgreSQL/MySQL
   - Connection pooling
   - Database migrations

4. **CI/CD**
   - GitHub Actions workflow
   - Automated testing
   - Blue/Green deployments

5. **Monitoring**
   - CloudWatch dashboards
   - AWS X-Ray tracing
   - Custom metrics

6. **Performance**
   - CloudFront CDN
   - Redis caching
   - Database optimization

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass
- Follow semantic versioning

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

- **GitHub Issues**: [Report Issues](https://github.com/NoManNayeem/Terraform_POC/issues)
- **Documentation**: See `terraform/README.md` for detailed Terraform documentation
- **Author**: NoManNayeem

---

## 🙏 Acknowledgments

- [HashiCorp Terraform](https://www.terraform.io/) - Infrastructure as Code
- [AWS ECS](https://aws.amazon.com/ecs/) - Container orchestration
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python framework
- [Next.js](https://nextjs.org/) - React framework
- [Docker](https://www.docker.com/) - Containerization platform

---

<div align="center">

**⭐ If you find this project helpful, please give it a star! ⭐**

Made with ❤️ for the DevOps community

</div>
