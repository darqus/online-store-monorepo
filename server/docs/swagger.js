import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Online Store API',
      version: '1.0.0',
    },
    servers: [{ url: '/' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ErrorResponse: {
          description: 'Standard error envelope',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'integer', example: 400 },
                message: { type: 'string', example: 'Bad Request' },
                details: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      msg: { type: 'string' },
                      param: { type: 'string' },
                      location: { type: 'string' },
                    },
                  },
                },
              },
              required: ['code', 'message'],
            },
          },
          required: ['success', 'error'],
        },
        Brand: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Type: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        DeviceInfo: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            deviceId: { type: 'integer' },
          },
        },
        Device: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            price: { type: 'integer' },
            rating: { type: 'number' },
            img: { type: 'string' },
            brandId: { type: 'integer' },
            typeId: { type: 'integer' },
            info: {
              type: 'array',
              items: { $ref: '#/components/schemas/DeviceInfo' },
            },
          },
        },
        DeviceWithImage: {
          allOf: [
            { $ref: '#/components/schemas/Device' },
            {
              type: 'object',
              properties: {
                imageUrl: { type: 'string', nullable: true },
                imageKey: { type: 'string', nullable: true },
              },
            },
          ],
        },
        Rating: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            rate: { type: 'integer' },
            userId: { type: 'integer' },
            deviceId: { type: 'integer' },
          },
        },
        AuthToken: {
          type: 'object',
          properties: { token: { type: 'string' } },
          required: ['token'],
        },
        SuccessBrand: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: '#/components/schemas/Brand' },
          },
          required: ['success', 'data'],
        },
        SuccessBrandList: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Brand' },
            },
          },
          required: ['success', 'data'],
        },
        SuccessType: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: '#/components/schemas/Type' },
          },
          required: ['success', 'data'],
        },
        SuccessTypeList: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Type' },
            },
          },
          required: ['success', 'data'],
        },
        SuccessDevice: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: '#/components/schemas/DeviceWithImage' },
          },
          required: ['success', 'data'],
        },
        SuccessDeviceList: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                count: { type: 'integer', example: 1 },
                rows: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/DeviceWithImage' },
                },
              },
              required: ['count', 'rows'],
            },
          },
          required: ['success', 'data'],
        },
        SuccessAuthToken: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: '#/components/schemas/AuthToken' },
          },
          required: ['success', 'data'],
        },
        SuccessMessage: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: { message: { type: 'string' } },
              required: ['message'],
            },
          },
          required: ['success', 'data'],
        },
      },
      responses: {
        Unauthorized: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              examples: {
                example: {
                  summary: 'Missing or invalid token',
                  value: {
                    success: false,
                    error: { code: 401, message: 'Unauthorized' },
                  },
                },
              },
            },
          },
        },
        Forbidden: {
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              examples: {
                example: {
                  summary: 'User lacks required role',
                  value: {
                    success: false,
                    error: { code: 403, message: 'Forbidden' },
                  },
                },
              },
            },
          },
        },
        BadRequest: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              examples: {
                example: {
                  summary: 'Validation error',
                  value: {
                    success: false,
                    error: {
                      code: 400,
                      message: 'Validation error',
                      details: [
                        {
                          msg: 'Invalid value',
                          param: 'field',
                          location: 'body',
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
        NotFound: {
          description: 'Not Found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              examples: {
                example: {
                  value: {
                    success: false,
                    error: { code: 404, message: 'Not Found' },
                  },
                },
              },
            },
          },
        },
        ServerError: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              examples: {
                example: {
                  value: {
                    success: false,
                    error: { code: 500, message: 'Internal Server Error' },
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['**/routes/*.js'],
}

export const swaggerSpec = swaggerJsdoc(options)
