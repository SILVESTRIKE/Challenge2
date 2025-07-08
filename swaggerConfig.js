const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API PRODUCT MANAGEMENT',
            version: '1.0.0',
            description: 'Tài liệu API quản lý sản phẩm',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
        // Dùng để thêm nút "Authorize" cho JWT
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    // Chỗ này quan trọng: trỏ đến các file chứa route của bạn
    apis: ['./routes/*.js'], // Ví dụ: './src/routes/**/*.js'
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwaggerDocs(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
            defaultModelsExpandDepth: -1,
            defaultModelRendering: "example",
            tryItOutEnabled: true // bật mặc định
        }
    }));
    console.log(`Swagger docs available at http://localhost:3000/api-docs`); // Thay port
}

module.exports = setupSwaggerDocs;