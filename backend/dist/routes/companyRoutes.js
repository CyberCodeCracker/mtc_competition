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
const companyController = __importStar(require("../controllers/companyController"));
const middleware_1 = require("../middleware");
const schemas_1 = require("../validators/schemas");
const types_1 = require("../types");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(middleware_1.verifyToken);
// Company-only routes
router.get('/me/offers', middleware_1.isCompany, companyController.getCompanyOffers);
router.get('/me/stats', middleware_1.isCompany, companyController.getCompanyStats);
router.get('/me/applications', middleware_1.isCompany, companyController.getCompanyApplications);
// Admin-only routes
router.get('/', middleware_1.isAdmin, companyController.getAllCompanies);
router.delete('/:id', middleware_1.isAdmin, companyController.deleteCompany);
router.patch('/:id/approval', middleware_1.isAdmin, companyController.toggleCompanyApproval);
// Routes for company (own) or admin
router.get('/:id', companyController.getCompanyById);
router.put('/:id', (0, middleware_1.hasRole)(types_1.UserRole.ADMIN, types_1.UserRole.COMPANY), (0, middleware_1.validate)(schemas_1.updateCompanySchema), companyController.updateCompany);
exports.default = router;
//# sourceMappingURL=companyRoutes.js.map