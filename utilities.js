const https = require('https');
const { validationResult } = require('express-validator');

module.exports = {
    CustomError: function (message, errorCode) {
        Error.captureStackTrace(this, this.constructor);
        const formatMsg = (Array.isArray(message))?message:[message];
        this.name = this.constructor.name;
        this.message = formatMsg || 'The requested resource couldn\'t be found';
        this.errorCode = errorCode || 404;
    },
    notification: (config) => {
        var notificationsConfig = config && config.notifications;

        function sendSlackNotification(channelId, message) {
            try {

                return new Promise((resolve, reject) => {
                    try {
                        if (empty(notificationsConfig))
                            throw new Error('Config is Missing');

                        if (empty(notificationsConfig.slackHostName))
                            throw new Error('Config Slack Host Name is Missing');

                        if (empty(notificationsConfig.slackToken))
                            throw new Error('Config Slack Token is Missing');

                        if (empty(channelId) || empty(message))
                            throw new Error('channelId Or message is Missing');
                    } catch (error) {
                        reject(error)
                    }

                    const options = {
                        hostname: notificationsConfig.slackHostName,
                        port: 443,
                        path: "/api/chat.postMessage?token=" + notificationsConfig.slackToken + "&channel=" + channelId + "&username=elnotifier&text=" + encodeURI(message),
                        method: 'POST',
                    };


                    const req = https.request(options, (response) => {

                        // Continuously update stream with data
                        let body = '';
                        response.on('data', d => body += d);

                        // Data reception is done, do whatever with it!
                        response.on('end', () => resolve(body));

                    });

                    req.on('error', error => reject(error));
                    req.end();
                });

            } catch (error) {
                console.log(error.message);
            }
        }

        return {
            sendSlackNotification
        }
    },
    slugify: (s, opt) =>{

        //check if s is provided
        if (empty(s))
            return undefined;
        
        s = String(s);
        opt = Object(opt);

        const defaults = {
            'delimiter': '-',
            'limit': undefined,
            'lowercase': true,
            'replacements': {},
        };

        // Merge options
        for (let k in defaults) {
            if (!opt.hasOwnProperty(k)) {
                opt[k] = defaults[k];
            }
        }

        // Make custom replacements
        for (let k in opt.replacements) {
            s = s.replace(RegExp(k, 'g'), opt.replacements[k]);
        }

        // Replace non-alphanumeric characters with our delimiter
        const alnum = RegExp('[^a-z0-9\\u0621-\\u064A]+', 'ig');
        s = s.replace(alnum, opt.delimiter);

        // Remove duplicate delimiters
        s = s.replace(RegExp('[' + opt.delimiter + ']{2,}', 'g'), opt.delimiter);

        // Truncate slug to max. characters
        s = s.substring(0, opt.limit);

        // Remove delimiter from ends
        s = s.replace(RegExp('(^' + opt.delimiter + '|' + opt.delimiter + '$)', 'g'), '');

        return opt.lowercase ? s.toLowerCase() : s;
    },
    validate: (req)=>{
        const errors = validationResult(req);

        if (!errors.isEmpty())
            throw new CustomError(errors.array(),400);
    }
}