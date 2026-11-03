pipeline {
    agent any

    triggers {
        // Automatically checks GitHub for new commits every 2 minutes
        pollSCM('H/2 * * * *')
        // Automatically triggers on GitHub Webhook push
        githubPush()
    }

    environment {
        APP_NAME = "wanderlust"
        PORT = "8000"
        PATH = "C:\\Program Files\\nodejs;C:\\Users\\RAHUL\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin;${env.PATH}"
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                echo '====================================='
                echo ' Stage 1: Checkout Source Code from GitHub'
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
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '====================================='
                echo ' Stage 3: Installing Node.js Dependencies'
                echo '====================================='
                bat 'npm install --prefer-offline --no-audit'
            }
        }

        stage('Database & Sanity Check') {
            steps {
                echo '====================================='
                echo ' Stage 4: Database Connection Sanity Check'
                echo '====================================='
                bat 'node -e "const m = require(\'mongoose\'); m.connect(\'mongodb://127.0.0.1:27017/wanderlust\').then(() => { console.log(\'MongoDB connection verified!\'); process.exit(0); }).catch(e => { console.error(e.message); process.exit(1); });"'
            }
        }

        stage('Health & Route Verification') {
            steps {
                echo '====================================='
                echo ' Stage 5: Health & Route Verification'
                echo '====================================='
                bat 'node -e "const http=require(\'http\'); http.get(\'http://localhost:8000/listings\', r => { console.log(\'Wanderlust HTTP Status:\', r.statusCode); if(r.statusCode !== 200) process.exit(1); }).on(\'error\', e => { console.error(\'Error:\', e.message); process.exit(1); });"'
            }
        }
    }

    post {
        always {
            echo 'CI/CD Pipeline execution finished.'
        }
        success {
            echo '====================================================='
            echo ' [SUCCESS] Jenkins CI/CD Pipeline Completed Successfully!'
            echo ' Project: WanderLust Travel & Tourism'
            echo ' Repository: https://github.com/Rahulkumar18-11/Wonderlust'
            echo ' Live Application: http://localhost:8000/listings'
            echo ' All Stages: PASSED'
            echo '====================================================='
        }
        failure {
            echo '====================================================='
            echo ' [FAILURE] Pipeline build failed. Check Jenkins console.'
            echo '====================================================='
        }
    }
}
