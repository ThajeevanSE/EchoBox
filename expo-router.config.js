const { getRoutes } = require('expo-router/build/getRoutes');

module.exports = {
    projectRoot: __dirname,
    routes: {
        // Ignore files/folders that should not be treated as routes
        ignore: [
            // Folders starting with underscore (e.g., _theme, _layout)
            '**/_(*)/**',
            // Other non-route folders
            '**/store/**',
            '**/components/**',
            '**/navigation/**',
            '**/auth/**',
            '**/favourites/**',
            '**/home/**',
            '**/theme/**',
        ],
    },
};
