"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const configSetup_1 = __importDefault(require("./config/configSetup"));
const middlewares_1 = require("./helpers/middlewares");
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
// PARSE JSON
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ENABLE CORS AND START SERVER
app.use((0, cors_1.default)({ origin: true }));
app.listen(configSetup_1.default.PORT, () => {
    console.log(`Server started on port ${configSetup_1.default.PORT}`);
});
// Routes
app.all('*', middlewares_1.isAuthorized);
app.use(routes_1.default);
