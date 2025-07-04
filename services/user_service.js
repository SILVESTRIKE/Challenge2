const User = require('../models/user_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Otp = require('../models/otp');
const { sendEmail } = require('../services/email');

const userService = {
    getAll: async () => {
        return await User.find();
    },

    getById: async (id) => {
        const user = await User.findById(id);
        if (!user) throw new Error('Không tìm thấy người dùng');
        return user;
    },

    getByEmail: async (email) => {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Không tìm thấy người dùng');
        return user;
    },


    sendOtp: async (email) => {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Không tìm thấy người dùng');

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        await new Otp({ userId: user._id, otp: otpCode }).save();
        await sendEmail(user.email, otpCode);
        return { message: 'OTP đã được gửi đến email của bạn' };
    },

    createUser: async ({ username, email, password }) => {
        if (!username || !email || !password) {
            throw new Error('Username, email, and password are required');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        const result = await user.save();
        if (result) await userService.sendOtp(user.email);
        return;
    },

    updateUser: async (id, data) => {
        const user = await User.findById(id);
        if (!user) throw new Error('Không tìm thấy người dùng');

        if (!data.username && !data.email && !data.password) {
            throw new Error('Phải thay đổi tên, email hoặc mật khẩu');
        }

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
        if (!updatedUser) throw new Error('Không tìm thấy người dùng');

        return updatedUser;
    },

    deleteUser: async (id) => {
        const user = await User.findByIdAndDelete(id);
        if (!user) throw new Error('Không tìm thấy người dùng');
        return true;
    },

    loginUser: async (email, password) => {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Không tìm thấy người dùng');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Sai mật khẩu');

        if (!user.vertify) {
            await userService.sendOtp(user.email);
            throw new Error('Tài khoản chưa được xác thực. Vui lòng kiểm tra email để xác thực tài khoản của bạn.');
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { user, token };
    },

    

    verifyOtp: async (email, otp) => {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Email không hợp lệ');

        const otpRecord = await Otp.findOne({ userId: user._id, otp: otp });
        if (!otpRecord) throw new Error('OTP không hợp lệ hoặc đã hết hạn');

        await Otp.deleteOne({ _id: otpRecord._id });
        await User.findByIdAndUpdate(user._id, { verify: true });

        return true;
    }
};

module.exports = userService;
