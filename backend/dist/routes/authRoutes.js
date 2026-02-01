"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController = __importStar(require("../controllers/authController"));
const middleware_1 = require("../middleware");
const schemas_1 = require("../validators/schemas");
const router = (0, express_1.Router)();
// Public routes
router.post('/login', (0, middleware_1.validate)(schemas_1.loginSchema), authController.login);
router.post('/refresh-token', (0, middleware_1.validate)(schemas_1.refreshTokenSchema), authController.refreshToken);
// Protected routes
router.get('/profile', middleware_1.verifyToken, authController.getProfile);
router.post('/change-password', middleware_1.verifyToken, authController.changePassword);
// Admin-only registration routes
router.post('/register/student', middleware_1.verifyToken, middleware_1.isAdmin, (0, middleware_1.validate)(schemas_1.registerStudentSchema), authController.registerStudent);
router.post('/register/company', middleware_1.verifyToken, middleware_1.isAdmin, (0, middleware_1.validate)(schemas_1.registerCompanySchema), authController.registerCompany);
router.post('/register/admin', middleware_1.verifyToken, middleware_1.isAdmin, (0, middleware_1.validate)(schemas_1.registerAdminSchema), authController.registerAdmin);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map