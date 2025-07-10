class ProductOutputDTO {
    constructor(id, name, slug, quantity, price, createdAt, updatedAt) {
        // this._id = id; // Thường trả về ID dưới dạng string
        this.name = name;
        this.slug = slug;
        this.quantity = quantity;
        this.price = price;
        // // Định dạng ngày tháng cho dễ đọc hơn nếu cần
        // this.createdAt = createdAt ? createdAt.toISOString() : null;
        // this.updatedAt = updatedAt ? updatedAt.toISOString() : null;
    }
}

module.exports = ProductOutputDTO;