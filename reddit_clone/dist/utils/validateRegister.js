"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
exports.validateRegister = (options) => {
    if (!options.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        return {
            errors: [
                {
                    field: "email",
                    message: "Enter a Valid Email",
                },
            ],
        };
    }
    if (options.username.length <= 2) {
        return {
            errors: [
                {
                    field: "username",
                    message: "Length Must be Greater than 2",
                },
            ],
        };
    }
    if (options.username.includes("@")) {
        return {
            errors: [
                {
                    field: "username",
                    message: "Cannot Include an @ Sign",
                },
            ],
        };
    }
    if (options.password.length <= 2) {
        return {
            errors: [
                {
                    field: "password",
                    message: "Length Must be Greater than 2",
                },
            ],
        };
    }
    return null;
};
//# sourceMappingURL=validateRegister.js.map