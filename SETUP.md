# Deploy lên Cloudflare Pages — Hướng dẫn 5 phút

## 1. Lấy Resend API key (để gửi mail thật)

1. Vào https://resend.com → đăng ký bằng email
2. **API Keys** → **Create API Key** → đặt tên `portfolio` → copy key
   (dạng `re_xxxxxxxxxxxxxxxxxxxxxxxx`)
3. **Domains**: có 2 lựa chọn
   - **Test ngay**: không thêm domain, dùng sender mặc định `onboarding@resend.dev` —
     chỉ gửi được tới email anh đã đăng ký Resend. OK để test, không nên dùng lâu dài.
   - **Production**: thêm domain `kiendt.dev`, verify 3 record DNS (TXT/CNAME)
     trên Cloudflare DNS → xong, gửi từ `contact@kiendt.dev`.

## 2. Push code lên GitHub

```bash
git init
git add .
git commit -m "init portfolio"
git remote add origin https://github.com/bigbearman/portfolio.git
git push -u origin main
```

## 3. Tạo Cloudflare Pages project

1. https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git** → chọn repo
2. Build settings:
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `out`
3. **Save and Deploy**

## 4. Thêm environment variables

Sau khi deploy lần đầu thành công:

**Project → Settings → Environment variables → Production:**

| Variable        | Value                                       |
|-----------------|---------------------------------------------|
| `RESEND_API_KEY`| `re_xxxxxxxxxxxxxxxxxxxxxxxx`               |
| `TO_EMAIL`      | `kienduong.hust@gmail.com`                  |
| `FROM_EMAIL`    | `Kien Duong <contact@kiendt.dev>`           |
|                 | *(bỏ qua nếu chưa verify domain → tự fallback)* |

Save → vào **Deployments** → **Retry deployment** (để function nhận env mới).

## 5. Gắn domain `kiendt.dev`

Project → **Custom domains** → **Set up a custom domain** → nhập `kiendt.dev`
→ Cloudflare tự thêm record DNS nếu domain đã ở Cloudflare.

## 6. Test

- Mở https://kiendt.dev → cuộn xuống form
- Điền name / email / message → **send message**
- Kiểm tra inbox `kienduong.hust@gmail.com` → phải thấy mail
  với subject `[Portfolio] new message from <tên>`, reply-to chính là email khách.

## Chi phí

| Service          | Free tier                      | Đủ dùng cho portfolio?   |
|------------------|--------------------------------|--------------------------|
| Cloudflare Pages | unlimited bandwidth, 500 builds/tháng | ✅ thoải mái       |
| Pages Functions  | 100,000 req/ngày               | ✅ thoải mái             |
| Resend           | 100 mail/ngày, 3,000/tháng     | ✅ thoải mái             |
| Domain `.dev`    | ~$10/năm                       | đã có rồi                |
| **Tổng**         | **0đ/tháng**                   |                          |

## Đã build sẵn cho anh

- `functions/api/contact.js` — Cloudflare Pages Function: validate, rate-limit 5 req/phút/IP,
  honeypot chống bot, forward qua Resend, reply-to là email khách.
- `components/ContactForm.tsx` — Form đã wire fetch `/api/contact`, có loading state, error messages
  song ngữ EN/VI, disable input khi đang gửi.

## Nếu chạy local để test

Cloudflare Pages Functions không chạy được khi mở file `index.html` trực tiếp
(form sẽ báo lỗi network). Cách test local:

```bash
npm run build
npx wrangler@latest pages dev out
```

Lệnh này serve site + functions ở `http://localhost:8788`.
Set env tạm thời:

```bash
RESEND_API_KEY=re_xxx TO_EMAIL=ban@gmail.com npx wrangler pages dev out
```

## Troubleshooting

- **`server_not_configured`** → chưa set env var, hoặc set xong chưa **Retry deployment**.
- **`send_failed`** → kiểm tra Resend dashboard → **Logs** xem lý do.
  Phổ biến: dùng `FROM_EMAIL` ở domain chưa verify.
- **Email rơi vào spam** → verify domain trên Resend (SPF/DKIM/Return-Path) là xong.
