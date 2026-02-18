module.exports = function (req, res, next) {

    const apiKey = req.headers['x-api-key'];

    console.log("Header key:", apiKey);
    console.log("Env key:", process.env.API_KEY);

    if (!apiKey) {
        return res.status(401).json({ error: 'API key missing' });
    }

    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({ error: 'Invalid API key' });
    }

    next();
};
