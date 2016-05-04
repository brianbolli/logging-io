var path = require("path"),
	rootPath = path.normalize(__dirname + "/.."),
	env = process.env["NODE_ENV"] || "development";

var config = {
	development: {
		redis: {
			port: process.env["ARC_LOGGING_AZURE_SESSION_STORE_PORT"],
			host: process.env["ARC_LOGGING_AZURE_SESSION_STORE_NAME"] + '.redis.cache.windows.net',
			key: process.env["ARC_LOGGING_AZURE_SESSION_STORE_KEY"],
			name: 'arc-sessions',
			prefix: 'arc-sess',
			database: 0
		},
		root: rootPath,
		secret: "cf864c72-5c90-4787-8e11-5d83a0b59668",
		app: {
			name: "logging-io"
		}
	},
	test: {
		root: rootPath,
		app: {
			name: "logging-io"
		}
	},
	production: {
		root: rootPath,
		app: {
			name: "logging-io"
		},
		secret: "cf864c72-5c90-4787-8e11-5d83a0b59668",
		host: "http://arc-logging.azurewebsites.net",
		google: {
			token: process.env["ARC_LOGGING_GOOGLE_API_ACCESS_TOKEN"],
			secret: process.env["ARC_LOGGING_GOOGLE_API_ACCESS_SECRET"],
			auth: "/auth/google",
			callback: "/auth/google/callback"
		},
		redis: {
			port: process.env["ARC_LOGGING_AZURE_SESSION_STORE_PORT"],
			host: process.env["ARC_LOGGING_AZURE_SESSION_STORE_NAME"] + '.redis.cache.windows.net',
			key: process.env["ARC_LOGGING_AZURE_SESSION_STORE_KEY"],
			name: 'arc-sessions',
			prefix: 'arc-sess',
			database: 0
		},
		routes: {
			login: '/login',
			googleAuth: '/auth/google',
			googleAuthCallback: '/auth/google/callback',
			googleSuccessRedirect: '/',
			googleFailureRedirect: '/'
		}
	}
};

module.exports = config[env];
