# Construye y sube todas las imagenes al ECR de la cuenta actual (requiere Docker en ejecucion).
# Uso: desde la raiz del repo: .\scripts\push-ecr.ps1
# Opcional: $env:AWS_REGION = 'us-east-1'

$ErrorActionPreference = "Stop"

$Region = if ($env:AWS_REGION) { $env:AWS_REGION } else { "us-east-1" }
$Account = (aws sts get-caller-identity --query Account --output text).Trim()
$Registry = "${Account}.dkr.ecr.${Region}.amazonaws.com"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")

Write-Host "Registry: $Registry" -ForegroundColor Cyan

aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin $Registry

function Push-Image {
  param(
    [string]$RepoSuffix,
    [string]$BuildContext,
    [string[]]$BuildArgs = @()
  )
  $repo = "mybookstore-$RepoSuffix"
  $uri = "${Registry}/${repo}:latest"
  Write-Host "`n>>> Building $uri" -ForegroundColor Yellow
  $dockerArgs = @("build", "-t", $uri)
  foreach ($a in $BuildArgs) { $dockerArgs += $a }
  $dockerArgs += $BuildContext
  & docker @dockerArgs
  if ($LASTEXITCODE -ne 0) { throw "docker build failed for $RepoSuffix" }
  docker push $uri
  if ($LASTEXITCODE -ne 0) { throw "docker push failed for $RepoSuffix" }
}

Push-Image "book-service" (Join-Path $Root "services\book-service")
Push-Image "user-service" (Join-Path $Root "services\user-service")
Push-Image "order-service" (Join-Path $Root "services\order-service")
Push-Image "inventory-service" (Join-Path $Root "services\inventory-service")
Push-Image "payment-service" (Join-Path $Root "services\payment-service")
Push-Image "review-service" (Join-Path $Root "services\review-service")
Push-Image "auth-service" (Join-Path $Root "services\auth-service")
Push-Image "frontend" (Join-Path $Root "frontend") @("--build-arg", "VITE_API_URL=")

Write-Host "`nListo. Imagenes en $Registry (tag latest)." -ForegroundColor Green
