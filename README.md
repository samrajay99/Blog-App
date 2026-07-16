# 📝 Blog-App

A full-stack blogging platform where users can create, edit, publish, and manage blog posts — built with the MERN stack.

<!-- Add a live demo GIF or screenshot here once deployed -->
<!-- ![demo](./screenshots/demo.gif) -->

🔗 **Live Demo:** [add-your-deployed-link-here]
📂 **Repo:** https://github.com/samrajay99/Blog-App

---

## ✨ Features

- User authentication (sign up / login / logout)
- Create, edit, and delete blog posts
- Rich text / markdown post editor
- View and comment on posts
- Responsive UI across mobile and desktop
- (Add/remove based on what you actually built — e.g. image uploads, categories/tags, search, likes)

---

## 🛠️ Tech Stack

**Frontend:** ReactJS, [Tailwind CSS / CSS3 — update to match]
**Backend:** Node.js, Express.js
**Database:** MongoDB
**Auth:** [JWT / Firebase Auth — update to match]
**Other tools:** Postman (API testing), Git

---

## 📸 Screenshots

| Home Feed | Post Editor | Single Post View |
|---|---|---|
| _add screenshot_ | _add screenshot_ | _add screenshot_ |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas connection string)

### Installation

```bash
# Clone the repo
git clone https://github.com/samrajay99/Blog-App.git
cd Blog-App

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Environment Variables

Create a `.env` file in the `server` folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Run Locally

```bash
# Start backend (from /server)
npm run dev

# Start frontend (from /client, in a separate terminal)
npm start
```

App runs at `http://localhost:3000` (frontend) and `http://localhost:5000` (backend API).

---

## 📁 Folder Structure

```
Blog-App/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
├── server/          # Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
└── README.md
```

---

## 🗺️ API Endpoints (update to match your actual routes)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in a user |
| GET | `/api/posts` | Get all posts |
| POST | `/api/posts` | Create a new post |
| PUT | `/api/posts/:id` | Update a post |
| DELETE | `/api/posts/:id` | Delete a post |

---

## 🔮 Future Improvements

- Add comment threads
- Add post categories/tags & search
- Add image upload support (Cloudinary)
- Add pagination / infinite scroll

---

## 👤 Author

**Samrajay Gupta**
[LinkedIn](https://linkedin.com/in/samrajaygupta1) · [GitHub](https://github.com/samrajay99) · samrajgupta250298@gmail.com
