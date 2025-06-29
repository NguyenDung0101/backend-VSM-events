const User = require('../models/User');
const bcrypt = require('bcryptjs'); // bcryptjs để mã hóa mật khẩu
// Thay bcrypt bằng bcryptjs để tránh lỗi khi sử dụng trên một số hệ thống
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Đăng ký Admin duy nhất (chỉ gọi một lần)
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;// Lấy thông tin từ body request/postman 
//     {
//       name: "Nguyen Van A",
//       email: "a.nguyen@example.com",    => đây là phần đống gói của req.body 
//       password: "mysecretpassword123"
//      }


    const existingAdmin = await User.findOne({ role: 'admin' }); 
    if (existingAdmin) return res.status(403).json({ message: 'Admin đã tồn tại và không được tạo admin được nữa' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({ name, email, password: hashedPassword, role: 'admin' });

    res.status(201).json({ message: 'Admin đã tạo thành công', admin });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Đăng nhập (cho cả user và admin)
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) return res.status(401).json({ message: 'Nhập sai email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Nhập sai mật khẩu' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// Admin tạo tài khoản cho User
exports.createUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = `${name}@vsm.org.vn`;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Tên người dùng đã tồn tại' }); // Không thể tạo 2 user có cùng email

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: 'user' });

    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
