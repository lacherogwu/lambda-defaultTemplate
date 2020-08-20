const Lambda = require('aws-sdk/clients/lambda');
const lambda = new Lambda();

const throwError = err => {
    // check if axios error
    if(err.isAxiosError){
        const path = err.response;
        return { 
            statusCode: path.status || 500,
            data: {
                message: err.message || 'No message provided',
                ...path.data
            },
        };
    }

    // else
    return { 
        statusCode: 500,
        data: {
            message: err.message || 'No message provided'
        },
    };
};

const generateContextData = ({ awsRequestId: id, functionName, logGroupName, logStreamName }) => {
    
    let url = 'https://us-east-2.console.aws.amazon.com/cloudwatch/home?region=us-east-2#logsV2:log-groups/log-group/';
    const groupName = logGroupName.replace(/\//g, '$252F');
    const streamName = logStreamName.replace(/\$/g, '$2524').replace(/\//g, '$252F').replace(/\[/g, '$255B').replace(/\]/g, '$255D');
    url += `${groupName}/log-events/${streamName}`;
    
    return {
        id,
        functionName,
        url,
    };
};

exports.errorsHandler = async (context, input, output) => {
    // printing the full error object
    console.log(output);
    
    const error = throwError(output);
    const params = {
        FunctionName: 'errorsHandler',
        InvokeArgs: JSON.stringify({
            ...generateContextData(context),
            input,
            output: error,
        }),
    };

    await lambda.invokeAsync(params).promise();

    return error;
};