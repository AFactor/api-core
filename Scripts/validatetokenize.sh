#!/bin/bash

export PATH=/sbin:/usr/sbin:/bin:/usr/bin:/usr/local/bin:/usr/local/apache-maven/apache-maven-3.3.9:/Users/Shared/Jenkins/Home/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/latest/lib/node_modules
echo node -v
echo $currentBuild.changeSets
npm install --prefix core/Scripts
node core/Scripts/tokenize.js