// dtos/product_dto.js
const Joi = require('joi');

class ProductValidator {
    static productDTOSchema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(100)
            .required()
            .messages({
                'string.base': 'Tên sản phẩm phải là một chuỗi ký tự.',
                'string.empty': 'Tên sản phẩm không được để trống.',
                'string.min': 'Tên sản phẩm phải có ít nhất {#limit} ký tự.',
                'string.max': 'Tên sản phẩm không được vượt quá {#limit} ký tự.',
                'any.required': 'Tên sản phẩm là bắt buộc.'
            }),
        quantity: Joi.number()
            .integer()
            .min(0)
            .required()
            .messages({
                'number.base': 'Số lượng phải là một số.',
                'number.integer': 'Số lượng phải là số nguyên.',
                'number.min': 'Số lượng không được nhỏ hơn 0.',
                'any.required': 'Số lượng là bắt buộc.'
            }),
        slug: Joi.string()
            .pattern(/^[a-z0-9-]+$/) // Chỉ cho phép chữ thường, số, dấu gạch ngang
            .required()
            .messages({
                'string.base': 'Slug phải là một chuỗi ký tự.',
                'string.empty': 'Slug không được để trống.',
                'string.pattern.base': 'Slug chỉ được chứa chữ cái thường (a-z), số (0-9) và dấu gạch ngang (-).',
                'any.required': 'Slug là bắt buộc.'
            }),
        price: Joi.number()
            .min(0)
            .required()
            .messages({
                'number.base': 'Giá phải là một số.',
                'number.min': 'Giá không được nhỏ hơn 0.',
                'any.required': 'Giá là bắt buộc.'
            }),
        description: Joi.string()
            .max(500) // Mô tả tối đa 500 ký tự
            .optional()
            .messages({
                'string.base': 'Mô tả phải là một chuỗi ký tự.',
                'string.max': 'Mô tả không được vượt quá {#limit} ký tự.'
            })
    });

    static validateProductDTO = (data) => {
        return productDTOSchema.validate(data, { abortEarly: false });
    };
}

// Export class ProductValidator
module.exports = ProductValidator;