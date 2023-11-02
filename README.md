### Run command below to install dependencies  
- npm init (To initialise a new Node.js project)
- npm install pg (packages for Node-postgres)
- npm install express dotenv
- npm install --save-dev nodemon
- npm i @aws-sdk/client-rds
- npm i @aws-sdk/client-secrets-manager


We need to tell our application to run with nodemon and to do that we can add the “start” line under scripts in your package.json file like in the example below.

  "scripts": {
    "start": "nodemon app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },