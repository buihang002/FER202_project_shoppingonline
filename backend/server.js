const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8000;
const SECRET_KEY = 'your-very-secret-key'; // Thay đổi key này trong dự án thực tế
const dbPath = path.join(__dirname, 'database.json');

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Hàm để đọc dữ liệu từ database.json
const readDatabase = () => {
    const data = fs.readFileSync(dbPath);
    return JSON.parse(data);
};

// Hàm để ghi dữ liệu vào database.json
const writeDatabase = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// --- API ENDPOINTS ---

// 1. Endpoint Đăng ký: [POST] /api/register
app.post('/api/register', (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }

    const db = readDatabase();

    // Kiểm tra email đã tồn tại chưa
    const existingUser = db.users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Email đã được sử dụng.' });
    }

    // Mã hóa mật khẩu
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Tạo người dùng mới
    const newUser = {
        id: `user-${Date.now()}`,
        username: email.split('@')[0],
        fullname: fullName,
        email: email,
        password: hashedPassword,
        role: 'buyer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    // Thêm người dùng mới vào mảng và ghi lại vào file
    db.users.push(newUser);
    writeDatabase(db);

    res.status(201).json({ message: 'Đăng ký thành công!' });
});

// 2. Endpoint Đăng nhập: [POST] /api/login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const db = readDatabase();

    const user = db.users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    // So sánh mật khẩu
    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
        // Xử lý trường hợp mật khẩu chưa mã hóa (cho tài khoản admin cũ)
        if (password !== user.password) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }
    }

    // Tạo JSON Web Token (JWT)
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

    res.json({
        message: 'Đăng nhập thành công!',
        token: token,
        role: user.role,
    });
});


// Khởi động server
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
