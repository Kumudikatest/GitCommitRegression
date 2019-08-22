let AWS = require('aws-sdk');
const ses = new AWS.SES();
let SL_AWS = require('slappforge-sdk-aws');
const sqs = new SL_AWS.SQS(AWS);

exports.handler = function (event, context, callback) {
    sqs.receiveMessage({
        QueueUrl: `https://sqs.${process.env.AWS_REGION}.amazonaws.com/${process.env.SIGMA_AWS_ACC_ID}/KTestSQS`,
        AttributeNames: ['All'],
        MaxNumberOfMessages: '1',
        VisibilityTimeout: '30',
        WaitTimeSeconds: '0'
    }).promise()
        .then(receivedMsgData => {
            if (!!(receivedMsgData) && !!(receivedMsgData.Messages)) {
                let receivedMessages = receivedMsgData.Messages;
                receivedMessages.forEach(message => {
                    // your logic to access each message through out the loop. Each message is available under variable message 
                    // within this block//
                });
            } else {
                //
                // No messages to process
            }
        })
        .catch(err => {
            // error handling goes here
            ses.sendEmail({
                Destination: {
                    ToAddresses: ['kumudika+@adroitlogic.com'],
                    CcAddresses: [],
                    BccAddresses: []
                },
                Message: {
                    Body: {
                        Text: {
                            Data: `Test`
                        }
                    },
                    Subject: {
                        Data: 'Test'
                    }
                },
                Source: 'kumudika@adroitlogic.com',
            }, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else console.log(data);           // successful response
            });
        });

    callback(null, { "message": "Successfully executed" });
}