const homePageController = {
    getHomePage: async (req, res) => {
        // Middleware `checkAuthStatus` đã làm hết việc
        // Biến `user` (hoặc null) đã có sẵn trong `res.locals.user` cho view
        res.render('homePage', {
            title: 'Trang Chủ'
        });
    },
};

module.exports = homePageController;