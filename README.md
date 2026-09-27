# College Club Management System — Secure DevOps Pipeline

A College Club Management System (Spring Boot + React + MySQL) wired into a full
DevOps pipeline: GitHub → Jenkins → SonarQube → OWASP Dependency-Check → Docker →
Trivy → Kubernetes → health checks → Prometheus/Grafana → rollback.

The application itself is intentionally simple. The pipeline is the point.

```
college-club-management/
├── backend/        Spring Boot REST API
├── frontend/        React app (plain, simple UI — no design framework)
├── k8s/              Kubernetes manifests
├── Jenkinsfile
├── docker-compose.yml
└── README.md          (this file)
```

---

## 0. Prerequisites

Install on your machine (Windows commands shown where they differ):

| Tool | Purpose | Check install |
|---|---|---|
| JDK 21 | Build backend | `java -version` |
| Maven | Build backend | `mvn -version` |
| Node.js 20+ | Build frontend | `node -v` |
| Docker Desktop | Build/run containers, includes Kubernetes tooling | `docker -v` |
| Git | Version control | `git --version` |
| kubectl | Talk to Kubernetes | `kubectl version --client` |
| Minikube | Local Kubernetes cluster | `minikube version` |
| MySQL (or run it in Docker) | Database | — |

---

## 1. Run everything locally first (no DevOps yet)

This confirms the app itself works before you wire up the pipeline.

```bash
# 1. Start MySQL, backend, and frontend together
docker compose up --build
```

- Frontend: http://localhost:3001
- Backend: http://localhost:8081/api/clubs
- Health check: http://localhost:8081/actuator/health

Or run each piece manually while developing:

```bash
# backend
cd backend
mvn spring-boot:run

# frontend (separate terminal)
cd frontend
npm install
npm run dev
```

---

## 2. Connect GitHub

```bash
cd college-club-management
git init
git add .
git commit -m "Initial College Club Management System"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

Replace `YOUR_GITHUB_REPOSITORY_URL` inside `Jenkinsfile` (Checkout stage) with this
same URL.

---

## 3. Connect Jenkins

1. Install Jenkins (or use your existing instance).
2. Install these plugins (**Manage Jenkins → Plugins → Available**):
   - Git plugin
   - Pipeline
   - SonarQube Scanner
   - OWASP Dependency-Check
   - Docker Pipeline
   - JUnit
3. **Manage Jenkins → Tools**: add a Maven installation and a JDK 21 installation
   (name them, e.g., `Maven3` and `JDK21` — reference them in the Jenkinsfile if you
   customize `tools {}`).
4. **New Item → Pipeline**, name it `College-Club-DevOps-Pipeline`.
5. Under **Pipeline → Definition**, choose "Pipeline script from SCM", point it at
   your GitHub repo, branch `main`, script path `Jenkinsfile`.
6. If your repo is private, add GitHub credentials under
   **Manage Jenkins → Credentials** and reference them in the job.

---

## 4. Connect SonarQube

1. Run SonarQube locally:
   ```bash
   docker run -d --name sonarqube -p 9000:9000 sonarqube:community
   ```
2. Open http://localhost:9000 (default login `admin` / `admin`, you'll be asked to
   change it).
3. Generate a token: **My Account → Security → Generate Token**.
4. In Jenkins: **Manage Jenkins → System → SonarQube servers** — add a server named
   `MySonarQube`, URL `http://localhost:9000`, and paste the token as a credential.
5. In Jenkins: **Manage Jenkins → Tools → SonarQube Scanner installations** — add one
   if you're using the scanner CLI instead of the Maven plugin (this project uses
   the Maven `sonar:sonar` goal, so no extra installation is strictly required).
6. The Jenkinsfile already has `withSonarQubeEnv('MySonarQube')` — make sure the
   name matches what you configured.
7. **Quality Gate webhook** (so Jenkins doesn't have to poll): in SonarQube, go to
   **Administration → Configuration → Webhooks**, add
   `http://<jenkins-host>:8080/sonarqube-webhook/`.

---

## 5. Connect OWASP Dependency-Check

1. In Jenkins: **Manage Jenkins → Tools → Dependency-Check installations** — add an
   automatic installation named `OWASP-DC` (matches the Jenkinsfile
   `odcInstallation: 'OWASP-DC'`).
2. First run will download the NVD vulnerability database — this can take a while
   the first time. Optionally get a free NVD API key
   (https://nvd.nist.gov/developers/request-an-api-key) and set it in the
   Dependency-Check global tool config to speed this up dramatically.
3. The pipeline stage already runs the scan against the `backend` folder and
   publishes the HTML/XML report.

---

## 6. Connect Docker

Docker Desktop already gives you the Docker CLI Jenkins needs. Two options:

- **Jenkins running natively on the host** — it can call `docker` directly as long
  as the Jenkins service user has Docker permissions.
- **Jenkins running in a container** — mount the Docker socket:
  ```bash
  docker run -d --name jenkins -p 8080:8080 -p 50000:50000 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v jenkins_home:/var/jenkins_home \
    jenkins/jenkins:lts
  ```

Test manually first:
```bash
docker build -t college-club-backend:1.0 backend
docker build -t college-club-frontend:1.0 frontend
docker images
```

---

## 7. Connect Trivy

Install Trivy (Windows via Chocolatey, or WSL/Linux):
```bash
choco install trivy
# or on Linux/WSL:
sudo apt-get install trivy
```

Test manually:
```bash
trivy image college-club-backend:1.0
```

Make sure `trivy` is on Jenkins' PATH (same rule as Docker above — native Jenkins
needs Trivy installed on the host; containerized Jenkins needs it installed inside
that image or run via a Trivy container).

---

## 8. Connect Kubernetes (Minikube)

```bash
minikube start
kubectl get nodes
```

Point Docker builds at Minikube's Docker daemon so images don't need to be pushed
to a registry:
```bash
# Windows PowerShell
& minikube -p minikube docker-env | Invoke-Expression

# macOS/Linux
eval $(minikube docker-env)
```

Then rebuild the images (they'll now live inside Minikube):
```bash
docker build -t college-club-backend:1.0 backend
docker build -t college-club-frontend:1.0 frontend
```

Deploy:
```bash
kubectl apply -f k8s/mysql-secret.yaml
kubectl apply -f k8s/mysql-deployment.yaml
kubectl apply -f k8s/mysql-service.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml

kubectl get pods
kubectl get deployments
kubectl get services
```

Access the app:
```bash
minikube service college-club-frontend-service
minikube service college-club-backend-service
```

---

## 9. Connect Prometheus + Grafana

Easiest path is Helm:

```bash
# install Helm if you don't have it: https://helm.sh/docs/intro/install/
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack
```

This installs Prometheus, Alertmanager, and Grafana together with sensible
defaults, and automatically scrapes Kubernetes metrics.

To also scrape the Spring Boot Actuator `/actuator/prometheus` endpoint, add a
`ServiceMonitor` (or a `prometheus.io/scrape: "true"` annotation on the backend
Service) — this requires the `micrometer-registry-prometheus` dependency, which you
can add to `pom.xml` if you want app-level metrics beyond pod CPU/memory.

Open Grafana:
```bash
kubectl port-forward svc/monitoring-grafana 3001:80
```
Visit http://localhost:3001 (default login `admin` / run
`kubectl get secret monitoring-grafana -o jsonpath="{.data.admin-password}" | base64 --decode`
for the password). Import any Kubernetes dashboard (e.g. dashboard ID `315` on
grafana.com) to see pod status, CPU, and memory immediately.

---

## 10. Demonstrate rollback

```bash
# see revision history
kubectl rollout history deployment/college-club-backend

# simulate a bad deploy (e.g. push a broken image tag)
kubectl set image deployment/college-club-backend backend=college-club-backend:broken

# it fails health checks — roll back
kubectl rollout undo deployment/college-club-backend

# confirm it's healthy again
kubectl rollout status deployment/college-club-backend
```

The Jenkinsfile's `post { failure { ... } }` block automates this same
`kubectl rollout undo` call when the Health Check stage fails.

---

## 11. What to show in your final demo

1. **App** — register, log in, browse clubs, join a club, view/register for an
   event, view announcements; log in as an admin/coordinator and create a club,
   event, and announcement.
2. **GitHub** — commit history, Jenkinsfile, Dockerfiles, k8s manifests.
3. **Jenkins** — a full green pipeline run through all stages.
4. **SonarQube** — the quality gate result for a build.
5. **OWASP Dependency-Check** — the vulnerability report.
6. **Docker** — `docker images`, `docker ps`.
7. **Kubernetes** — `kubectl get pods/deployments/services`.
8. **Grafana** — the live dashboard.
9. **Rollback** — trigger a bad deploy and roll it back live.

---

## Notes on security

- Passwords are BCrypt-hashed before storage (`SecurityConfig` /
  `PasswordEncoder`).
- The MySQL root/app credentials are stored as a Kubernetes `Secret`
  (`k8s/mysql-secret.yaml`), not hardcoded in the repo. Change the default values
  in that file before any real deployment.
- CORS is wide open (`*`) and API auth is intentionally permissive for demo
  simplicity — tighten `SecurityConfig` before using this beyond a classroom
  project.
