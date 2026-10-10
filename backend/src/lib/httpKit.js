// ========================================
// HTTP KIT
// A small Express-style layer on top of Node's
// built-in http module: app.use()/get()/post()/etc,
// middleware chaining, :params, JSON body parsing,
// and res.json()/res.status(). No framework
// dependency required — this is what Express does
// under the hood, simplified.
// ========================================

const http = require("http");
const { URL } = require("url");

function compilePath(routePath) {

    const paramNames = [];

    const pattern = routePath
        .split("/")
        .map(function (segment) {

            if (segment.startsWith(":")) {
                paramNames.push(segment.slice(1));
                return "([^/]+)";
            }

            return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        })
        .join("/");

    return { regex: new RegExp("^" + pattern + "$"), paramNames };

}

function createApp() {

    const middlewares = []; // { method, matcher, handler }

    function register(method, routePath, handlers) {

        const { regex, paramNames } = compilePath(routePath);

        handlers.forEach(function (handler) {

            middlewares.push({
                method: method,
                regex: regex,
                paramNames: paramNames,
                handler: handler
            });

        });

    }

    const app = {};

    ["get", "post", "put", "delete", "patch"].forEach(function (method) {

        app[method] = function (routePath, ...handlers) {
            register(method.toUpperCase(), routePath, handlers);
            return app;
        };

    });

    // Global middleware (runs on every request, any method).
    app.use = function (handler) {
        middlewares.push({ method: "ALL", regex: /.*/, paramNames: [], handler: handler });
        return app;
    };

    async function readBody(req) {

        return new Promise(function (resolve, reject) {

            let raw = "";

            req.on("data", function (chunk) {

                raw += chunk;

                // Basic protection against unbounded payloads.
                if (raw.length > 1e6) {
                    reject(new Error("Payload too large"));
                    req.destroy();
                }

            });

            req.on("end", function () {

                if (!raw) {
                    resolve({});
                    return;
                }

                try {
                    resolve(JSON.parse(raw));
                } catch (error) {
                    resolve({});
                }

            });

            req.on("error", reject);

        });

    }

    function decorateResponse(res) {

        res.status = function (code) {
            res.statusCode = code;
            return res;
        };

        res.json = function (data) {
            const body = JSON.stringify(data);
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Content-Length", Buffer.byteLength(body));
            res.end(body);
        };

    }

    const server = http.createServer(async function (req, res) {

        decorateResponse(res);

        const url = new URL(req.url, "http://localhost");

        req.query = Object.fromEntries(url.searchParams);
        req.path = url.pathname;

        try {
            req.body = await readBody(req);
        } catch (error) {
            res.status(413).json({ message: "Payload too large." });
            return;
        }

        const matching = middlewares.filter(function (m) {
            return (m.method === "ALL" || m.method === req.method) && m.regex.test(req.path);
        });

        let index = 0;

        async function next(error) {

            if (error) {
                handleError(error);
                return;
            }

            const layer = matching[index++];

            if (!layer) {

                res.status(404).json({ message: "Not found." });
                return;

            }

            req.params = {};

            const match = layer.regex.exec(req.path);

            if (match) {
                layer.paramNames.forEach(function (name, i) {
                    req.params[name] = decodeURIComponent(match[i + 1]);
                });
            }

            try {
                await layer.handler(req, res, next);
            } catch (error) {
                handleError(error);
            }

        }

        function handleError(error) {

            console.error("[error]", error);

            if (!res.headersSent) {
                res.status(error.statusCode || 500).json({
                    message: error.publicMessage || "Internal server error."
                });
            }

        }

        next();

    });

    app.listen = function (port, callback) {
        return server.listen(port, callback);
    };

    app._server = server;

    return app;

}

module.exports = { createApp };
