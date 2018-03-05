#!/bin/bash

export PATH=/sbin:/usr/sbin:/bin:/usr/bin:/usr/local/bin:/usr/local/apache-maven/apache-maven-3.3.9:/Users/Shared/Jenkins/Home/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/latest/lib/node_modules
echo node -v
npm install --prefix ./common/scripts
node core/scripts/tokenize.js