module.exports = {
    "parser": "babel-eslint",
    "extends": "airbnb",
    "globals":{
        "window": true,
        "document": true,
        "fetch": true,
    },
    "plugins": [
        "react",
        "jsx-a11y",
        "import",
    ],
    "rules": {
        "global-require": "off",
        "no-unused-expressions": ["error", { "allowShortCircuit": true }],
    }
};