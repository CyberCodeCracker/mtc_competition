"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const studentRoutes_1 = __importDefault(require("./studentRoutes"));
const companyRoutes_1 = __importDefault(require("./companyRoutes"));
const offerRoutes_1 = __importDefault(require("./offerRoutes"));
const applicationRoutes_1 = __importDefault(require("./applicationRoutes"));
const adminRoutes_1 = __importDefault(require("./adminRoutes"));
const router = (0, express_1.Router)();
// Mount routes
router.use('/auth', authRoutes_1.default);
router.use('/students', studentRoutes_1.default);
router.use('/companies', companyRoutes_1.default);
router.use('/offers', offerRoutes_1.default);
router.use('/applications', applicationRoutes_1.default);
router.use('/admin', adminRoutes_1.default);
// Health check
router.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'ENET\'COM Forum API is running',
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map