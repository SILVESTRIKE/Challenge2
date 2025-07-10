const homePageController = {
    getHomePage: async (req, res) => {
        res.render('homePage', {
            title: 'Trang Chủ'
        });
    },
};

module.exports = homePageController;