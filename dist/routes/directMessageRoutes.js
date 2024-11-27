"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const directMessageController_1 = require("../controllers/directMessageController");
const wrapHandler_1 = require("../utils/wrapHandler");
const router = (0, express_1.Router)();
router.get('/', auth_1.protect, (0, wrapHandler_1.wrapAuthHandler)(directMessageController_1.getDirectMessageConversations));
router.get('/:userId', auth_1.protect, (0, wrapHandler_1.wrapAuthHandler)(directMessageController_1.getDirectMessages));
router.post('/', auth_1.protect, (0, wrapHandler_1.wrapAuthHandler)(directMessageController_1.sendDirectMessage));
exports.default = router;
