// dtos/output/user_output_dto.js

class UserOutputDTO {
    constructor(id, username, email, verify, role) {
        // this._id = id;
        this.username = username;
        this.email = email; // Cân nhắc có nên trả về email cho tất cả các API user hay không
        // this.verify = verify;
        // this.role = role;
    }
}

module.exports = UserOutputDTO;