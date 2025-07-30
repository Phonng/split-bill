# 💰 Chia Tiền - Split Bill App

Ứng dụng web chia tiền đơn giản và hiệu quả, giúp chia sẻ hóa đơn một cách công bằng giữa nhiều người.

## ✨ Tính năng

- **Nhập thông tin đơn hàng:** Số tiền hàng, phí ship, số tiền cuối cùng
- **Quản lý người tham gia:** Thêm/xóa người với giao diện bảng Excel-style
- **Tính toán thông minh:** Chia đều hoặc chia theo tỷ lệ số tiền đặt
- **Phí ship:** Tự động tính vào số tiền gốc và áp dụng giảm giá
- **Giao diện đẹp:** Responsive design với gradient và animations

## 🚀 Cách sử dụng

1. **Nhập thông tin đơn hàng:**

   - Số tiền hàng (VNĐ)
   - Phí ship (VNĐ)
   - Số tiền cuối cùng (sau giảm giá)

2. **Thêm người tham gia:**

   - Nhập tên từng người
   - Nhập số tiền mỗi người đặt (tùy chọn)

3. **Tính toán:**
   - Để trống số tiền đặt → Chia đều
   - Nhập số tiền đặt → Chia theo tỷ lệ

## 🛠️ Công nghệ

- **Frontend:** Preact (React alternative nhẹ)
- **Build Tool:** Vite
- **Styling:** CSS3 với gradients và animations
- **Deployment:** Netlify/Vercel

## 📦 Cài đặt và chạy

```bash
# Clone repository
git clone <repository-url>
cd split-bill

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build
```

## 🌐 Deploy

### Netlify

1. Push code lên GitHub
2. Kết nối repository với Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Vercel

1. Push code lên GitHub
2. Import project vào Vercel
3. Framework preset: Vite
4. Build command: `npm run build`

## 📱 Responsive

Ứng dụng hoạt động tốt trên:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎨 Giao diện

- **Excel-style table:** Bảng chuyên nghiệp với header gradient
- **Modern design:** Gradients, shadows, và smooth animations
- **User-friendly:** Intuitive UI với clear instructions
- **Accessible:** Keyboard navigation và screen reader support

## 📄 License

MIT License - Tự do sử dụng và modify
