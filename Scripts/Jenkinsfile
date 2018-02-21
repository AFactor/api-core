properties([
    [$class: 'jenkins.model.BuildDiscarderProperty', strategy: [$class: 'LogRotator', numToKeepStr: '96']],
    pipelineTriggers([[$class:"SCMTrigger", scmpoll_spec:"H/10 * * * *"]]),
])
pipeline {
  agent any
  options {
    skipDefaultCheckout(true)
  }
  
  stages {
    
    stage('Check Source') {
        steps {
            deleteDir()
            checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'PathRestriction', excludedRegions: '', includedRegions: '/products']], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'jenkins-generated-ssh-key', name: 'customergit', url: 'git@github.com:AFactor/API-yamls-customers.git']]])
        }
    }
    stage('Tokenize') {
      steps {
        sh '''export PATH=/sbin:/usr/sbin:/bin:/usr/bin:/usr/local/bin:/usr/local/apache-maven/apache-maven-3.3.9:/Users/Shared/Jenkins/Home/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/latest/lib/node_modules
              node -v
              npm install --prefix ./common/scripts
              node ./common/scripts/tokenize.js
              '''
      }
    }
    stage('Copy to temp') {
      steps {
        sh '''export PATH=/sbin:/usr/sbin:/bin:/usr/bin:/usr/local/bin:/usr/local/apache-maven/apache-maven-3.3.9:/Users/Shared/Jenkins/Home/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/latest/lib/node_modules
              node -v
              b=$(git diff --name-only HEAD^ HEAD)
              node ./common/scripts/copy.js ${BUILD_TAG} $b
              '''
      }
    }
    stage('Deploy to API Cloud') {
      steps {
        configFileProvider([configFile(fileId: '14ce0658-5942-4980-a3cf-7bef5e1bd2c9', variable: 'ciConfig')]) {
        sh '''export PATH=/sbin:/usr/sbin:/bin:/usr/bin:/usr/local/bin:/usr/local/apache-maven/apache-maven-3.3.9:/Users/Shared/Jenkins/Home/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/latest/lib/node_modules
              node -v
              b=$(git diff --name-only HEAD^ HEAD)
              node ./common/scripts/publish.js ${BUILD_TAG} $ciConfig $b'''
        }
      }
    }
  }
}