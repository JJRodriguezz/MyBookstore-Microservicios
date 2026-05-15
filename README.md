# 📚 MyBookstore - Microservicios

Una arquitectura de microservicios moderna y escalable para una plataforma de tienda de libros online. Implementada con **Node.js**, **gRPC**, **PostgreSQL** y **Kubernetes**, siguiendo principios de **Arquitectura Hexagonal** y **Domain-Driven Design**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)
![Docker](https://img.shields.io/badge/Docker-Supported-blue.svg)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-blue.svg)

---

## 🎯 Descripción del Proyecto

**MyBookstore** es una plataforma de comercio electrónico diseñada para demostrar las mejores prácticas en arquitectura de microservicios. La aplicación permite a los usuarios:

- ✅ Navegar y consultar un catálogo de libros
- ✅ Autenticarse de forma segura con JWT
- ✅ Gestionar un carrito de compra
- ✅ Realizar pedidos y pagos
- ✅ Consultar el historial de órdenes
- ✅ Dejar reseñas y calificaciones
- ✅ Gestionar inventario en tiempo real

---

## 🏗️ Arquitectura del Sistema

### Microservicios

| Servicio | Puerto | Descripción | BD |
|----------|--------|-------------|-----|
| **API Gateway** | 8080 | Nginx - Enrutador central | - |
| **Auth Service** | 3006 | Autenticación y autorización | PostgreSQL |
| **User Service** | 3001 | Gestión de usuarios | PostgreSQL |
| **Book Service** | 3000 | Catálogo de libros | PostgreSQL |
| **Order Service** | 3002 | Procesamiento de órdenes | PostgreSQL |
| **Inventory Service** | 3003 | Control de inventario | PostgreSQL |
| **Payment Service** | 3004 | Procesamiento de pagos | - |
| **Review Service** | 3005 | Reseñas y calificaciones | PostgreSQL |
| **Frontend** | 3007 | React + Vite | - |

### Comunicación

- **REST API**: Comunicación cliente-servidor
- **gRPC**: Comunicación inter-servicios (alta performance)
- **Docker Compose**: Orquestación local
- **Kubernetes**: Orquestación en producción

### Patrones de Diseño

```
┌─────────────────────────────────────────┐
│         API Gateway (Nginx)             │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    ┌───▼──────┐        ┌────▼────┐
    │ Frontend  │        │  Services│
    │ (React)   │        │ (gRPC)   │
    └───┬──────┘        └────┬────┘
        │                    │
    ┌───▼────────────────────▼──┐
    │   Arquitectura Hexagonal   │
    │  - Adapters (HTTP/gRPC)    │
    │  - Use Cases (Lógica)      │
    │  - Domain (Modelos)        │
    │  - Infrastructure (BD/Cache)
    └────────────────────────────┘
```

---

## 🚀 Inicio Rápido

### Requisitos Previos

- **Node.js**: 18+
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **PostgreSQL**: 15 (si ejecutas localmente)

### Instalación Local (Docker Compose)

```bash
# Clonar el repositorio
git clone https://github.com/JJRodriguezz/MyBookstore-Microservicios.git
cd MyBookstore-Microservicios

# Copiar configuración de ejemplo
cp backend.env.example backend.env
cp frontend.env.example frontend.env

# Edita los archivos .env con tus valores (si es necesario)

# Levantar todos los servicios
docker-compose up -d

# Verificar estado
docker-compose ps
```

**Acceso:**
- Frontend: http://localhost:3007
- API Gateway: http://localhost:8080
- Servicios individuales: http://localhost:3000-3006

### Detener los Servicios

```bash
docker-compose down
```

---

## 🐳 Despliegue en Kubernetes

### Requisitos

- Cluster Kubernetes activo (minikube, EKS, AKS, etc.)
- `kubectl` configurado
- `docker` para construir imágenes

### Pasos

```bash
# 1. Crear namespace
kubectl create namespace bookstore

# 2. Crear secretos (IMPORTANTE: configura con valores reales)
cp k8s/secrets.example.yaml k8s/secrets.yaml
# Edita k8s/secrets.yaml con credenciales seguras
kubectl apply -f k8s/secrets.yaml

# 3. Aplicar manifests
kubectl apply -f k8s/

# 4. Verificar despliegue
kubectl get pods -n bookstore
kubectl get services -n bookstore

# 5. Acceder a la aplicación
kubectl port-forward svc/frontend 3007:80 -n bookstore
```

---

## 📁 Estructura del Proyecto

```
MyBookstore-Microservicios/
├── frontend/                    # Aplicación React + Vite
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   ├── screens/            # Páginas completas
│   │   ├── context/            # Estado global (AuthContext, CartContext)
│   │   └── lib/                # Utilidades (API calls, helpers)
│   └── Dockerfile              # Imagen de producción
│
├── services/                    # Microservicios backend
│   ├── auth-service/           # Autenticación JWT
│   ├── user-service/           # Gestión de usuarios
│   ├── book-service/           # Catálogo de libros
│   ├── order-service/          # Procesamiento de órdenes
│   ├── inventory-service/      # Control de inventario
│   ├── payment-service/        # Procesamiento de pagos
│   └── review-service/         # Reseñas y calificaciones
│
├── gateway/                     # API Gateway (Nginx)
│   └── nginx.conf              # Configuración de routing
│
├── k8s/                         # Manifests de Kubernetes
│   ├── namespace.yaml           # Namespace
│   ├── postgres/                # ConfigMap con scripts SQL
│   ├── auth/                    # Deployment + Service
│   ├── book/                    # Deployment + Service
│   ├── order/                   # Deployment + Service
│   └── ... (otros servicios)
│
├── scripts/                     # Scripts útiles
│   ├── apply-k8s.ps1           # Script para aplicar K8s
│   └── push-ecr.ps1            # Script para subir a ECR
│
├── docker-compose.yml           # Orquestación local
├── backend.env.example          # Variables de entorno (backend)
├── frontend.env.example         # Variables de entorno (frontend)
└── README.md                    # Este archivo
```

---

## 🔐 Seguridad

### Buenas Prácticas Implementadas

✅ **Variables de Entorno**: Todas las credenciales se cargan desde archivos `.env`  
✅ **JWT Authentication**: Autenticación segura con tokens JWT  
✅ **No Hardcoding de Secretos**: Ningún dato sensible en el código  
✅ **Kubernetes Secrets**: Credenciales gestionadas a través de `k8s/secrets.yaml`  
✅ **Database Encryption**: Conexiones seguras a PostgreSQL  

### Configuración de Credenciales

#### Desarrollo Local
```bash
cp backend.env.example backend.env
# Edita backend.env con credenciales seguras
```

#### Producción (Kubernetes)
```bash
cp k8s/secrets.example.yaml k8s/secrets.yaml
# Configura secretos reales en k8s/secrets.yaml
kubectl apply -f k8s/secrets.yaml
```

**NUNCA** hagas push de archivos `.env` o `secrets.yaml` con valores reales.

---

## 🛠️ Desarrollo

### Variables de Entorno Disponibles

#### Backend (`backend.env`)
```env
NODE_ENV=development
PORT=5001
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

#### Frontend (`frontend.env`)
```env
VITE_API_URL=http://localhost:80
VITE_GATEWAY_URL=http://localhost:80
```

### Scripts Disponibles

```bash
# Instalar dependencias de un servicio
cd services/book-service && npm install

# Ejecutar un servicio localmente
npm start

# Ejecutar tests (si están disponibles)
npm test

# Build para producción
npm run build
```

---

## 📊 Modelos de Datos

### Entidades Principales

#### Users
```javascript
{
  id: UUID,
  email: string (unique),
  name: string,
  password: hashed,
  createdAt: timestamp
}
```

#### Books
```javascript
{
  id: UUID,
  title: string,
  author: string,
  price: decimal,
  inventory: integer,
  description: string
}
```

#### Orders
```javascript
{
  id: UUID,
  userId: UUID,
  items: [{bookId, quantity, price}],
  totalAmount: decimal,
  status: 'pending' | 'paid' | 'shipped' | 'delivered',
  createdAt: timestamp
}
```

---

## 🧪 Testing

Los servicios incluyen capacidad para testing (requiere setup adicional).

```bash
# Ejecutar tests en un servicio
cd services/book-service
npm test

# Coverage
npm run test:coverage
```

---

## 📈 Monitoreo y Logs

### Docker Compose
```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f book-service
```

### Kubernetes
```bash
# Logs de un pod
kubectl logs -f pod-name -n bookstore

# Logs en tiempo real
kubectl logs -f deployment/book-service -n bookstore
```

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💼 Autor

**José Javier Rodríguez**  
GitHub: [@JJRodriguezz](https://github.com/JJRodriguezz)

---

## 📚 Referencias y Recursos

- [gRPC Documentation](https://grpc.io/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)

---

## 📞 Soporte

Para reportar issues o hacer sugerencias, por favor abre un [GitHub Issue](https://github.com/JJRodriguezz/MyBookstore-Microservicios/issues).

---

**Última actualización**: Mayo 2026
