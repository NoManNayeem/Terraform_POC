variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "fastapi-nextjs-poc"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zone" {
  description = "Availability zone for single-AZ deployment (POC)"
  type        = string
  default     = "us-east-1a"
}

variable "backend_port" {
  description = "Port for FastAPI backend"
  type        = number
  default     = 8000
}

variable "frontend_port" {
  description = "Port for Next.js frontend"
  type        = number
  default     = 3000
}

variable "backend_cpu" {
  description = "CPU units for backend task (1024 = 1 vCPU)"
  type        = number
  default     = 512
}

variable "backend_memory" {
  description = "Memory for backend task in MB"
  type        = number
  default     = 1024
}

variable "frontend_cpu" {
  description = "CPU units for frontend task (1024 = 1 vCPU)"
  type        = number
  default     = 512
}

variable "frontend_memory" {
  description = "Memory for frontend task in MB"
  type        = number
  default     = 1024
}

variable "backend_env_vars" {
  description = "Environment variables for backend task"
  type        = map(string)
  default     = {}
}

variable "frontend_env_vars" {
  description = "Environment variables for frontend task"
  type        = map(string)
  default     = {}
}

