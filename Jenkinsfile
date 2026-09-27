pipeline {

    agent any

    environment {
        BACKEND_IMAGE  = "college-club-backend:${BUILD_NUMBER}"
        FRONTEND_IMAGE = "college-club-frontend:${BUILD_NUMBER}"
        SONAR_URL      = "http://localhost:9000"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/tejaswinimuradnar/College_Club_Management'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    bat 'mvn -B clean package -DskipTests'
                }
            }
        }

        stage('Unit Tests') {
            steps {
                dir('backend') {
                    bat 'mvn -B test'
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                dir('backend') {
                    withSonarQubeEnv('MySonarQube') {
                        bat 'mvn -B sonar:sonar -Dsonar.projectKey=college-club-backend'
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                dir('backend') {
                    dependencyCheck additionalArguments: '--scan . --format HTML --format XML', odcInstallation: 'OWASP-DC'
                    dependencyCheckPublisher pattern: 'dependency-check-report.xml'
                }
            }
        }

        stage('Docker Build') {
            steps {
                bat "docker build -t ${BACKEND_IMAGE} backend"
                bat "docker build -t ${FRONTEND_IMAGE} frontend"
            }
        }

        stage('Trivy Scan') {
            steps {
                bat "trivy image --exit-code 0 --severity HIGH,CRITICAL ${BACKEND_IMAGE}"
                bat "trivy image --exit-code 0 --severity HIGH,CRITICAL ${FRONTEND_IMAGE}"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl apply -f k8s/mysql-secret.yaml'
                bat 'kubectl apply -f k8s/mysql-deployment.yaml'
                bat 'kubectl apply -f k8s/mysql-service.yaml'
                bat "kubectl set image deployment/college-club-backend backend=${BACKEND_IMAGE} --record"
                bat 'kubectl apply -f k8s/backend-deployment.yaml'
                bat 'kubectl apply -f k8s/backend-service.yaml'
                bat "kubectl set image deployment/college-club-frontend frontend=${FRONTEND_IMAGE} --record"
                bat 'kubectl apply -f k8s/frontend-deployment.yaml'
                bat 'kubectl apply -f k8s/frontend-service.yaml'
            }
        }

        stage('Health Check') {
            steps {
                script {
                    bat 'kubectl rollout status deployment/college-club-backend --timeout=90s'
                }
            }
        }
    }

    post {
        failure {
            echo 'Deployment failed health check. Rolling back...'
            bat 'kubectl rollout undo deployment/college-club-backend'
        }
        success {
            echo 'Pipeline completed successfully.'
        }
    }
}
