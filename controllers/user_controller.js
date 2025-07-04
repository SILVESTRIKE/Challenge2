const userService = require('../services/user_service');
const User = require('../models/user_model');

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

    createUser: async (req, res) => {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.render('register', { error: 'Vui lòng nhập đầy đủ thông tin.' });
        }

        try {
            const existed = await User.findOne({ email });
            if (existed) {

                return res.render('register', { error: 'Email đã tồn tại.' });
                
            }
            
            await userService.createUser({ username, email, password });
            res.render('verify_otp', { error: null, successmsg: 'OTP đã gửi, hãy kiểm tra email!',success: true , email: email });

        } catch (err) {
            res.render('register', { error: err.message });
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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('login', { error: 'Vui lòng nhập email và mật khẩu.' });
        }

        try {
            const { user, token } = await userService.loginUser(email, password);
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/products');
        } catch (err) {
            // Nếu lỗi do chưa xác thực, truyền lại email để render verify_otp
            if (err.message && err.message.includes('chưa được xác thực')) {
                res.render('verify_otp', { error: err.message, success: null, email: email });
            } else {
                res.render('login', { error: 'Đăng nhập thất bại: ' + err.message, email: email });
            }
        }
    },

    sendOtp: async (req, res) => {
        const { email } = req.body;

        try {
            const result = await userService.sendOtp(email);
            res.render('verify_otp', { error: null, success: result.message, email: email });
        } catch (err) {
            res.render('send_otp', { error: err.message, success: null });
        }
    },
    verifyOtp: async (req, res) => {
        const { email, otp } = req.body;

        console.log('🔃 Xác thực OTP cho email:', email);
        console.log('🔃 Xác thực OTP cho otp:', otp);

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
};

module.exports = userController;
