const productService = require('../services/product_service');

const webProductController = {
    getAllProducts: async (req, res) => {
        try {
            const products = await productService.getAll();
            if (!Array.isArray(products)) {
                console.error('productService.getAll did not return an array:', products);
                return res.status(500).send('Error: Products data is not an array');
            }
            res.render('product/index', {
                products,
                verify: req.verify || false,
                message: req.message || '',
            });
        } catch (err) {
            console.error('Error in getAllProducts:', err.message);
            return res.status(500).send('Error fetching products: ' + err.message);
        }
    },

    // Hiển thị trang chi tiết một sản phẩm
    getProductById: async (req, res) => {
        try {
            const product = await productService.getById(req.params.id);
            if (!product) return res.status(404).send('Không tìm thấy sản phẩm');

            res.render(`product/details`, {
                product: product,
                title: product.name
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // Hiển thị trang chi tiết một sản phẩm bằng slug
    getBySlug: async (req, res) => {
        try {
            const product = await productService.getBySlug(req.params.slug);
            if (!product) return res.status(404).send('Không tìm thấy sản phẩm');

            res.render(`product/details/${product._id}`, {
                product: product,
                title: product.name
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // Hiển thị form để tạo sản phẩm mới
    getCreateProductPage: (req, res) => {
        res.render('product/create', {
            title: 'Thêm sản phẩm mới',
            error: null
        });
    },

    // Xử lý việc tạo sản phẩm từ form
    createProduct: async (req, res) => {
        try {
            const { name, quantity, slug, description, price } = req.body; // Thêm các trường khác nếu có
            const newProduct = await productService.create({ name, quantity, slug, description, price });
            console.log(newProduct);
            // Sau khi tạo thành công, chuyển hướng đến trang chi tiết sản phẩm vừa tạo
            res.redirect(`/product/details/${newProduct._id}`);
        } catch (err) {
            // Nếu có lỗi, render lại trang tạo sản phẩm với thông báo lỗi
            res.render('product/create', {
                title: 'Thêm sản phẩm mới',
                error: err.message
            });
        }
    },

    // Hiển thị form để chỉnh sửa sản phẩm
    getUpdateProductPage: async (req, res) => {
        try {
            const product = await productService.getById(req.params.id);
            if (!product) return res.status(404).send('Không tìm thấy sản phẩm');

            res.render('product/edit', {
                title: `Chỉnh sửa: ${product.name}`,
                product: product,
                error: null
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // Xử lý việc cập nhật sản phẩm từ form
    updateProduct: async (req, res) => {
        try {
            await productService.update(req.params.id, req.body);
            // Cập nhật thành công, chuyển hướng về trang chi tiết
            res.redirect(`/product/details/${req.params.id}`);
        } catch (err) {
            // Nếu lỗi, render lại trang edit với thông báo lỗi
            const product = await productService.getById(req.params.id);
            res.render('product/edit', {
                title: `Chỉnh sửa: ${product.name}`,
                product: product,
                error: err.message
            });
        }
    },

    // Xử lý việc xóa sản phẩm
    deleteProduct: async (req, res) => {
        try {
            await productService.delete(req.params.id);
            // Xóa xong, quay về trang danh sách sản phẩm
            res.redirect('/products');
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
};
module.exports = webProductController;
