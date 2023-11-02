
const { Client } = require('pg')
const {
    RDSClient,
    DescribeDBInstancesCommand,
} = require("@aws-sdk/client-rds");
const {
    SecretsManagerClient,
    ListSecretsCommand,
    GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

// authentication DB with secret manager
const region = process.env.AWS_REGION
var client = () => { }
const run = async () => {
    const rdsClient = new RDSClient({ region: region });
    const smClient = new SecretsManagerClient({ region: region });
    let connection = {
        endpoint: '',
        port: '',
        username: '',
        password: ''
    };
    // get port & endpoint 
    try {
        const describeDBInstancesCommand = new DescribeDBInstancesCommand({
            DBInstanceIdentifier: "rdspg-fcj-labs",
        });
        const describeDBInstancesResponse = await rdsClient.send(
            describeDBInstancesCommand
        );

        connection.endpoint = describeDBInstancesResponse.DBInstances[0].Endpoint.Address;
        connection.port = describeDBInstancesResponse.DBInstances[0].Endpoint.Port;
    } catch (err) {
        console.error(err);
    }
    let secretArn;
    try {
        const listSecretsCommand = new ListSecretsCommand({
            Filters: [{ Key: "name", Values: ["secretPostgresqlMasterUser1"] }],
        });
        const listSecretsResponse = await smClient.send(listSecretsCommand);
        secretArn = listSecretsResponse.SecretList[0].ARN;
    } catch (err) {
        console.error(err);
    }
    //get username & password
    try {
        const getSecretValueCommand = new GetSecretValueCommand({
            SecretId: secretArn,
        });
        const getSecretValueResponse = await smClient.send(getSecretValueCommand);
        const secretString = JSON.parse(getSecretValueResponse.SecretString);
        connection.username = secretString.username;
        connection.password = secretString.password;

    } catch (err) {
        console.error(err);
    }
    console.log("credential RDS PostgreSQL on AWS secret manager", connection)
    client = new Client({
        user: connection.username,
        password: connection.password,
        host: connection.endpoint,
        database: "pglab",
        port: connection.port,
        ssl: {
            rejectUnauthorized: false,
        }
    });
    client.connect((err) => {
        if (err) {
            console.error("connection error", err.stack);
        } else {
            console.log('You are connecting to RDS PostgreSQL')
        }
    });
};
run();

