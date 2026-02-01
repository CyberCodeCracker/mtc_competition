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
const studentController = __importStar(require("../controllers/studentController"));
const middleware_1 = require("../middleware");
const schemas_1 = require("../validators/schemas");
const types_1 = require("../types");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(middleware_1.verifyToken);
// Student-only routes
router.get('/me/applications', middleware_1.isStudent, studentController.getStudentApplications);
router.get('/me/stats', middleware_1.isStudent, studentController.getStudentStats);
// Admin-only routes
router.get('/', middleware_1.isAdmin, studentController.getAllStudents);
router.delete('/:id', middleware_1.isAdmin, studentController.deleteStudent);
// Routes for student (own) or admin
router.get('/:id', (0, middleware_1.hasRole)(types_1.UserRole.ADMIN, types_1.UserRole.STUDENT), studentController.getStudentById);
router.put('/:id', (0, middleware_1.hasRole)(types_1.UserRole.ADMIN, types_1.UserRole.STUDENT), (0, middleware_1.validate)(schemas_1.updateStudentSchema), studentController.updateStudent);
exports.default = router;
//# sourceMappingURL=studentRoutes.js.map