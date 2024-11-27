"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const schemas_1 = require("../validation/schemas");
const wrapHandler_1 = require("../utils/wrapHandler");
const router = (0, express_1.Router)();
router.post('/register', (0, validate_1.validate)(schemas_1.schemas.auth.register), (0, wrapHandler_1.wrapHandler)(authController_1.register));
router.post('/login', (0, validate_1.validate)(schemas_1.schemas.auth.login), (0, wrapHandler_1.wrapHandler)(authController_1.login));
router.get('/me', auth_1.requireAuth, (0, wrapHandler_1.wrapAuthHandler)(authController_1.me));
exports.default = router;
