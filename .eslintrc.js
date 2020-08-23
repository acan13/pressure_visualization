module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
        // "amd": true,
        // "jest": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/recommended",
        '@nuxtjs',
        'plugin:nuxt/recommended'
    ],
    "parserOptions": {
        "parser": "babel-eslint",
        "sourceType": "module",
        "ecmaVersion": 2017,
    },
    "globals": {
        "_": "readonly",
        "moment": "readonly",
    },
    "rules": {
        "indent": [
            "error",
            4,
        ],
        // "linebreak-style": [
        //     "error",
        //     "windows"
        // ],
        "semi": [
            "error",
            "always",
        ],
        "vue/html-indent": [
            "error",
            4,
        ],
        "vue/require-default-prop": 0,
        "vue/order-in-components": ["error", {
            "order": [
                "el",
                "name",
                "parent",
                "functional",
                ["delimiters", "comments"],
                ["components", "directives", "filters"],
                "extends",
                "mixins",
                "inheritAttrs",
                "model",
                ["props", "propsData"],
                "data",
                "computed",
                "watch",
                "methods",
                "LIFECYCLE_HOOKS",
                ["template", "render"],
                "renderError",
            ],
        },
        ],
        "vue/component-name-in-template-casing": ["error", "kebab-case", {
            "ignores": [], // can ignore specific cases
        }],
        "vue/name-property-casing": ["error", "kebab-case"],
        "vue/html-closing-bracket-newline": ["error", {
            "singleline": "never",
            "multiline": "never", // or always, it's just personal preference
        }],
        "vue/html-closing-bracket-spacing": ["error", {
            "startTag": "never",
            "endTag": "never",
            "selfClosingTag": "never",
        }],
        "no-console": [
            "error",
            {"allow": ["warn", "error"]},
        ],
        "no-global-assign": [
            "error", 
            {"exceptions": []},
        ],
        "comma-dangle": ["error", "always-multiline"],
    },
};