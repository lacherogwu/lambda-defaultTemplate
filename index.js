const { errorsHandler } = require('./errorsHandler');
const { run } = require('./script');

exports.handler = async (event, context) => {
    const body = JSON.parse(event.body);
    const response = {};

    try {
        const data = await run(body);
        response.body = data;
        
    } catch (err) {
        const error = await errorsHandler(context, event, err);
        response.body = error.data;
        response.statusCode = error.statusCode;
    }
    
    response.body = JSON.stringify(response.body);
    return response;
};