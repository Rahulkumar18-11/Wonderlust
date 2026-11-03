pipeline {
    agent any

    environment {
        APP_NAME = "wanderlust"
        PORT = "8000"
        PATH = "C:\\Program Files\\nodejs;C:\\Users\\RAHUL\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin;${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo '====================================='
                echo ' Stage 1: Checkout Source Code'
                echo '====================================='
                checkout scm
            }
        }

        stage('Environment Check') {
            steps {
                echo '====================================='
                echo ' Stage 2: Checking Node.js, NPM & Docker'
                echo '====================================='
                bat 'node -v'
                bat 'npm -v'
                bat 'docker -v'
            }
        }

        stage('Install Dependencies & Lint') {
            steps {
                echo '====================================='
                echo ' Stage 3: Installing Node.js Dependencies'
                echo '====================================='
                bat 'npm install --prefer-offline --no-audit'
            }
        }

        stage('Docker Deployment') {
            steps {
                echo '====================================='
                echo ' Stage 4: Docker Container Deployment'
                echo '====================================='
                script {
                    def dockerStatus = bat(script: 'docker.exe info >nul 2>&1', returnStatus: true)
                    if (dockerStatus == 0) {
                        echo '[INFO] Docker daemon active. Building and launching Wanderlust stack...'
                        bat 'docker compose up --build -d'
                        echo 'Waiting for web and mongo containers to stabilize...'
                        bat 'timeout /t 10 /nobreak'
                    } else {
                        echo '[WARN] Docker daemon is not accessible. Running standalone node verification.'
                    }
                }
            }
        }

        stage('Health & Route Verification') {
            steps {
                echo '====================================='
                echo ' Stage 5: Health Check & Route Verification'
                echo '====================================='
                bat 'node -e "const http=require(\'http\'); http.get(\'http://localhost:8000/listings\', r => { console.log(\'Wanderlust HTTP Status:\', r.statusCode); if(r.statusCode !== 200) process.exit(1); }).on(\'error\', e => { console.error(\'Error:\', e.message); process.exit(1); });"'
            }
        }
    }

    post {
        success {
            echo '====================================================='
            echo ' [SUCCESS] Jenkins CI/CD Pipeline Completed Successfully!'
            echo ' Project: WanderLust Travel & Tourism'
            echo ' Web Application: http://localhost:8000/listings'
            echo ' Default Admin Login: admin / admin123'
            echo ' Health & Route Verification: PASSED (200 OK)'
            echo ' Docker Containers: wanderlust_app & wanderlust_mongo'
            echo '====================================================='
        }
        failure {
            echo '====================================================='
            echo ' [FAILURE] Pipeline build failed. Check Jenkins console.'
            echo '====================================================='
        }
    }
}

