# Aplica los manifiestos en orden razonable (namespace -> datos -> microservicios -> entrada web).
# Uso: .\scripts\apply-k8s.ps1
# Requiere kubectl configurado contra tu cluster EKS.

$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$K = Join-Path $Root "k8s"

kubectl apply -f (Join-Path $K "namespace.yaml")
kubectl apply -f (Join-Path $K "postgres\postgres.yaml")
kubectl apply -f (Join-Path $K "book\deployment.yaml")
kubectl apply -f (Join-Path $K "book\service.yaml")
kubectl apply -f (Join-Path $K "user\deployment.yaml")
kubectl apply -f (Join-Path $K "user\service.yaml")
kubectl apply -f (Join-Path $K "inventory\deployment.yaml")
kubectl apply -f (Join-Path $K "inventory\service.yaml")
kubectl apply -f (Join-Path $K "payment\deployment.yaml")
kubectl apply -f (Join-Path $K "payment\service.yaml")
kubectl apply -f (Join-Path $K "review\deployment.yaml")
kubectl apply -f (Join-Path $K "review\service.yaml")
kubectl apply -f (Join-Path $K "order\deployment.yaml")
kubectl apply -f (Join-Path $K "order\service.yaml")
kubectl apply -f (Join-Path $K "auth\deployment.yaml")
kubectl apply -f (Join-Path $K "auth\service.yaml")
kubectl apply -f (Join-Path $K "frontend\deployment.yaml")
kubectl apply -f (Join-Path $K "frontend\service.yaml")
kubectl apply -f (Join-Path $K "gateway\configmap.yaml")
kubectl apply -f (Join-Path $K "gateway\deployment.yaml")
kubectl apply -f (Join-Path $K "gateway\service.yaml")

Write-Host "`nPara ver la URL publica del NLB: kubectl get svc api-gateway -n bookstore" -ForegroundColor Green
