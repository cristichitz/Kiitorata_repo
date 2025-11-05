output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "application_url" {
  description = "URL to access the application"
  value       = "http://${aws_lb.main.dns_name}"
}

output "ecr_repository_client" {
  description = "ECR repository URL for client"
  value       = aws_ecr_repository.client.repository_url
}

output "ecr_repository_server" {
  description = "ECR repository URL for server"
  value       = aws_ecr_repository.server.repository_url
}

output "backend_logs" {
  description = "CloudWatch log group for backend"
  value       = aws_cloudwatch_log_group.backend.name
}

output "frontend_logs" {
  description = "CloudWatch log group for frontend"
  value       = aws_cloudwatch_log_group.frontend.name
}