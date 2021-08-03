module.exports = {
    "root": true,
    "env": {
        "node": true
    },
    "extends": [
        "plugin:vue/essential",
        "eslint:recommended",
        "@vue/typescript"
    ],
    "parserOptions": {
        "parser": "@typescript-eslint/parser"
    },
    "rules": {
        "vue/valid-v-slot": ["off", {
            "allowModifiers": true
        }]
    }
}