module.exports = function() {
    return function(req, res, next) {
        if (
            typeof req.headers[process.env.APIKEY_CUSTOM_HEADER_NAME] !==
            "undefined" &&
            req.headers[process.env.APIKEY_CUSTOM_HEADER_NAME]
        ) {
            if (
                req.headers[process.env.APIKEY_CUSTOM_HEADER_NAME] == process.env.APIKEY
            ) {
                next();
            } else {
                // throw ('Wrong API Key.');
                res.json({ status: "error", response: "Wrong API Key." });
            }
        } else {
            // throw ('No API key set.');
            res.json({ status: "error", response: "No API key set." });
        }
    };
};