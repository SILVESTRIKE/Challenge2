const userService = require('../services/user_service');
const User = require('../models/user_model');
// const mongoose = require('mongoose');

const userController = {
    getAllUser: async (req, res) => {
        try {
            const users = await userService.getAll();
            res.json(users);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getById: async (req, res) => {
        try {
            const user = await userService.getById(req.params.id);
            res.json(user);
        } catch (err) {
            res.status(404).send(err.message);
        }
    },

    getByEmail: async (req, res) => {
        try {
            const user = await userService.getByEmail(req.params.email);
            res.json(user);
        } catch (err) {
            res.status(404).send(err.message);
        }
    },
    getCreateUser: (req, res) => {
        return res.render('register', { error: null, errormsg: null});
    },
    postCreateUser: async (req, res) => {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.render('register', { error: true, errormsg: 'Vui lòng nhập đầy đủ thông tin.' });
        }

        try {
            const existed = await User.findOne({ email });
            if (existed) {

                return res.render('register', { error: true, errormsg: 'Email đã tồn tại.' });
                
            }
            
            await userService.createUser({ username, email, password });
            res.render('verify_otp', { error: null, successmsg: 'OTP đã gửi, hãy kiểm tra email!',success: true , email: email });

        } catch (err) {
            res.render('register', { error: true, errormsg: 'Lỗi khi tạo tài khoản. Vui lòng thử lại.' });
        }
    },

    updateUser: async (req, res) => {
        try {
            const updated = await userService.updateUser(req.params.id, req.body);
            res.json(updated);
        } catch (err) {
            res.status(400).send(err.message);
        }
    },

    deleteUser: async (req, res) => {
        try {
            await userService.deleteUser(req.params.id);
            res.send('Deleted');
        } catch (err) {
            res.status(400).send(err.message);
        }
    },

    getLoginUser: async (req, res) => {
        return res.render('login', { error: null, errormsg: null });
    },
    postLoginUser: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('login', { error: true,  errormsg: 'Vui lòng nhập email và mật khẩu.' });
        }

        try {
            const { user, accessToken, refreshToken } = await userService.loginUser(email, password);

            res.cookie('accessToken', accessToken, { httpOnly: true });
            res.cookie('refreshToken', refreshToken, { httpOnly: true });
            res.redirect('/profile');
        } catch (err) {
            // Nếu lỗi do chưa xác thực, truyền lại email để render verify_otp
            if (err.message && err.message.includes('Chưa được xác thực')) {
                res.render('verify_otp', { error: err.message, success: null, email: email });
            } else {
                res.render('login', { error: true, errormsg: err.message });
            }
        }
    },

    getSendOtp: (req, res) => {
        return res.render('send_otp', { error: null, success: null });
    },
    postSendOtp: async (req, res) => {
        const { email } = req.body;
        try {
            const result = await userService.sendOtp(email);
            res.render('verify_otp', { error: null, success: result.message, email: email });
        } catch (err) {
            res.render('send_otp', { error: true, errormsg: err.message, success: null });
        }
    },
    getVerifyOtp: (req, res) => {
        const { email } = req.query;    
        return res.render('verify_otp', { error: null, success: null, email: email || '' });
    },
    verifyOtp: async (req, res) => {
        const { email, otp } = req.body;

        console.log(' Xác thực OTP cho email:', email);
        console.log(' Xác thực OTP cho otp:', otp);

        if (!email || !otp) {
            return res.render('verify_otp', { 
                error: 'Vui lòng nhập email và OTP.', 
                success: null, 
                successmsg: null, 
                email: email || '' 
            });
        }

        try {
            await userService.verifyOtp(email, otp);
            res.render('login', { 
                error: null, 
                sucess: true,
                successmsg: 'Xác thực thành công. Bạn có thể đăng nhập ngay bây giờ.', 
                email: email || ''
            });
        } catch (err) {
            res.render('verify_otp', { 
                error: err.message, 
                success: null, 
                successmsg: null, 
                email: email || '' 
            });
        }
    },
    refreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(401).json({ error: 'Không có refresh token' });
        try{
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const accessToken = userService.createAccessToken({ userId: decoded.userId });
            res.json({ accessToken });

        }catch (err) {
            res.status(403).json({ error: 'Refresh token không hợp lệ' });
        }
    },
    getProfile: async (req, res) => {
        try {
            const user = await userService.getById(req.user.userId);
            res.render('profile', { user });
        } catch (err) {
            res.status(404).send(err.message);
        }
    },
    logout: (req, res) => {
        try{
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.redirect('/login');
        }
        catch (err) {
            res.status(500).send(err.message);
        };
    },
    
    
};

module.exports = userController;

