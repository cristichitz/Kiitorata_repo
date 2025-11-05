# Simple Web App Deployment

The application is a simple "vote counter," where the frontend calls a backend API to increment or reset votes.

## Architecture

This project uses Terraform to define and manage all cloud resources on AWS.

### Application

- **Backend**: A Deno/Hono API service (from the `/server` directory) that manages vote counts.
- **Frontend**: A client-side application (from the `/client2` directory) that displays votes and sends requests to the backend.

### Infrastructure

- **Containerization**: Both frontend and backend applications are containerized using Docker.
- **ECR (Elastic Container Registry)**: Two repositories are created to store the client and server Docker images.
- **ECS (Elastic Container Service)**: An ECS cluster running on Fargate (serverless) hosts both the frontend and backend services.
- **ALB (Application Load Balancer)**: A single ALB serves as the entry point. It routes traffic based on the URL path:
  - Requests to `/api/*` are forwarded to the backend service.
  - All other requests (e.g., `/`) are forwarded to the frontend service.
- **Networking**: The services run in the default VPC. Security groups are configured to allow traffic from the ALB to the ECS tasks.
- **Logging**: Logs from both services are sent to AWS CloudWatch.

## 1. Prerequisites

Before you begin, ensure you have the following tools installed and configured:

- **Terraform (v1.2+)**: Used as the IaC tool.
https://developer.hashicorp.com/terraform/install

- **AWS CLI**: Used for authenticating with AWS and logging into ECR. You must have your AWS credentials configured by running `aws configure`
https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

- **Docker**: Used to build and push the container images for the frontend and backend.
https://docs.docker.com/get-started/get-docker/

## 2. How to Deploy

The deployment process is automated using a shell script. This script handles initializing Terraform, building/pushing the images, and deploying the full infrastructure.

### Clone the repository

```bash
git clone https://github.com/cristichitz/Kiitorata_repo.git
cd <in the repository>
```

### Make the deploy script executable

```bash
chmod +x deploy.sh
```

### Run the deploy script

```bash
./deploy.sh
```

### What the Script Does

The `deploy.sh` script performs the following steps:

1. Initializes Terraform in the `/infrastructure` directory.
2. Applies a partial deployment to create the ECR repositories first.
3. Retrieves the ECR repository URLs using `terraform output`.
4. Logs Docker into AWS ECR using the AWS CLI.
5. Builds and pushes the backend (`/server`) Docker image to its ECR repository.
6. Builds and pushes the frontend (`/client2`) Docker image to its ECR repository.
7. Applies the full infrastructure, creating the ALB, ECS cluster, services, and task definitions. The services will pull the images you just pushed.
8. Outputs the final `application_url`.

**Note**: After the script finishes, it may take 2-3 minutes for the ECS services to become healthy and register with the load balancer.

## 3. How to Destroy

```bash
cd infrastructure
```

### Run the destroy command

```bash
terraform destroy -auto-approve
```

This command will read the state file and remove all the resources it created, including the ECR repositories, ECS services, ALB, and security groups.

## 4. Missing Parts & Non-Idealities

This solution is designed to meet the assignment's core goals but is not a production-ready setup. Here are some known non-idealities and missing parts:

- **Hardcoded Variables**: The `deploy.sh` script hardcodes the `AWS_REGION` and `PROJECT_NAME`. These would be better as script arguments or environment variables.

- **VPC**: The solution uses the default VPC for simplicity. A production environment should use a custom VPC for better network isolation and control.

- **Security**: The security groups are permissive (e.g., allowing all outbound traffic). In a real-world scenario, these rules should be much stricter, only allowing the specific traffic needed.

- **HTTP Only**: The ALB listens on HTTP (port 80). A production application must use HTTPS (port 443) with an SSL/TLS certificate (e.g., from AWS Certificate Manager) for security.
