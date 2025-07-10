// dtos/user_dto.js
const Joi = require('joi');

class UserValidator {
    // --- DTO Schema cho User Registration ---
    static userRegisterDTOSchema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(50)
            .required()
            .messages({
                'string.base': 'Tên người dùng phải là một chuỗi.',
                'string.empty': 'Tên người dùng không được để trống.',
                'string.min': 'Tên người dùng phải có ít nhất {#limit} ký tự.',
                'string.max': 'Tên người dùng không được vượt quá {#limit} ký tự.',
                'any.required': 'Tên người dùng là bắt buộc.'
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.base': 'Email phải là một chuỗi.',
                'string.empty': 'Email không được để trống.',
                'string.email': 'Định dạng email không hợp lệ.',
                'any.required': 'Email là bắt buộc.'
            }),
        password: Joi.string()
            .min(6)
            .max(100)
            .required()
            .messages({
                'string.base': 'Mật khẩu phải là một chuỗi.',
                'string.empty': 'Mật khẩu không được để trống.',
                'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự.',
                'string.max': 'Mật khẩu không được vượt quá {#limit} ký tự.',
                'any.required': 'Mật khẩu là bắt buộc.'
            }),
    });

    // --- DTO Schema cho User Login ---
    static loginDTOSchema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.base': 'Email phải là một chuỗi.',
                'string.empty': 'Email không được để trống.',
                'string.email': 'Định dạng email không hợp lệ.',
                'any.required': 'Email là bắt buộc.'
            }),
        password: Joi.string()
            .min(6)
            .required()
            .messages({
                'string.base': 'Mật khẩu phải là một chuỗi.',
                'string.empty': 'Mật khẩu không được để trống.',
                'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự.',
                'any.required': 'Mật khẩu là bắt buộc.'
            }),
    });

    // --- DTO Schema cho Send OTP ---
    static sendOtpDTOSchema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.base': 'Email phải là một chuỗi.',
                'string.empty': 'Email không được để trống.',
                'string.email': 'Định dạng email không hợp lệ.',
                'any.required': 'Email là bắt buộc.'
            }),
    });

    // --- DTO Schema cho Verify OTP ---
    static verifyOtpDTOSchema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.base': 'Email phải là một chuỗi.',
                'string.empty': 'Email không được để trống.',
                'string.email': 'Định dạng email không hợp lệ.',
                'any.required': 'Email là bắt buộc.'
            }),
        otp: Joi.string()
            .length(6)
            .pattern(/^[0-9]{6}$/)
            .required()
            .messages({
                'string.base': 'OTP phải là một chuỗi.',
                'string.empty': 'OTP không được để trống.',
                'string.length': 'Mã OTP phải có đúng {#limit} ký tự.',
                'string.pattern.base': 'Mã OTP chỉ được chứa 6 chữ số.',
                'any.required': 'Mã OTP là bắt buộc.'
            }),
    });

    // --- DTO Schema cho Update User ---
    static updateUserDTOSchema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(50)
            .required()
            .messages({
                'string.base': 'Tên người dùng phải là một chuỗi.',
                'string.empty': 'Tên người dùng không được để trống.',
                'string.min': 'Tên người dùng phải có ít nhất {#limit} ký tự.',
                'string.max': 'Tên người dùng không được vượt quá {#limit} ký tự.',
                'any.required': 'Tên người dùng là bắt buộc.'
            }),
    });

    // Hàm validator
    static validate = (schema, data) => {
        return schema.validate(data, { abortEarly: false });
    };
}

// Export class UserValidator
module.exports = UserValidator;