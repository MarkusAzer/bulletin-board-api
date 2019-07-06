const { isDev } = global.serverConfig;

const errorHandler = (payload, req, res, next) => {
    try {
        if (payload instanceof CustomError) {
            return res
                .status(payload.errorCode)
                .json(...payload.message);
        }

        if (payload instanceof Error) {

            if (isDev) {
                console.log('DEVELOPMENT ERRORS');
                console.log(payload);
            }

            SendNotifications.sendSlackNotification('', `${'Error on Bulletin Board \n' + '```'}${payload.stack}\`\`\``).catch(error => console.log(error.message));
            return res
                .status(500)
                .json('Internal Server Error');
        }

        return next(payload);
    } catch (error) {
        return res
            .status(500)
            .json('Internal Server Error');
    }
};

const dataHandler = (payload, req, res, next) => res.status(200).json({
    statusCode: 200,
    message: payload.message ? payload.message : 'data successfully retrieved',
    data: payload && payload.data,
});

module.exports = {
  errorHandler,
  dataHandler
};