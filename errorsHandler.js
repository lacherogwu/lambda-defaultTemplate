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

exports.errorsHandler = async ({ awsRequestId: id, functionName }, input, output) => {
    // printing the full error object
    console.log(output);
    
    const error = throwError(output);
    const params = {
        FunctionName: 'errorsHandler',
        InvokeArgs: JSON.stringify({
            id,
            functionName,
            input,
            output: error,
        }),
    };

    await lambda.invokeAsync(params).promise();

    return error;
};