"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const config_1 = require("./config");
const database_1 = __importDefault(require("./config/database"));
const routes_1 = __importDefault(require("./routes"));
// Create Express app
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: config_1.config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Static files for uploads
app.use('/uploads', express_1.default.static(config_1.config.upload.dir));
// API routes
app.use('/api', routes_1.default);
// Root endpoint
app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'Welcome to ENET\'COM Forum API',
        version: '1.0.0',
        documentation: '/api/health',
    });
});
// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
    });
});
// Global error handler
app.use((err, _req, res, _next) => {
    console.error('❌ Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(config_1.config.nodeEnv === 'development' && { stack: err.stack }),
    });
});
// Start server
const startServer = async () => {
    try {
        // Test database connection
        await database_1.default.$queryRaw `SELECT 1`;
        console.log('✅ Database connection verified');
        app.listen(config_1.config.port, () => {
            console.log(`
🚀 ENET'COM Forum API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 URL: http://localhost:${config_1.config.port}
🔧 Environment: ${config_1.config.nodeEnv}
📊 Health Check: http://localhost:${config_1.config.port}/api/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('🔄 SIGTERM received, shutting down gracefully...');
    await database_1.default.$disconnect();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('🔄 SIGINT received, shutting down gracefully...');
    await database_1.default.$disconnect();
    process.exit(0);
});
exports.default = app;
//# sourceMappingURL=server.js.map