pipeline {
    agent { docker { image 'node:12.18' } }
    stages {
        stage('Build') { 
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Test') { 
            steps {
                sh 'npm run test-unit'
            }
        }
    }
}