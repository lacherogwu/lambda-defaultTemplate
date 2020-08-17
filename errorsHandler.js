const { Lambda } = require('aws-sdk');
const lambda = new Lambda();

exports.errorsHandler = async ({ awsRequestId: id, functionName }, input, output) => {
    const params = {
        FunctionName: 'errorsHandler',
        InvokeArgs: JSON.stringify({
            id,
            functionName,
            input,
            output
        }),
    };

    await lambda.invokeAsync(params).promise();
};

exports.createError = (data, status) => {
    const res = {
        response: {
            data: {},
            status: status || 400
        }
    };

    if(typeof data === 'string'){
        res.response.data.message = data;
    } else if (typeof data === 'object'){
        res.response.data = data;
    } else {
        res.response.data = {
            message: 'No message provided'
        };
    }
    
    return res;
};