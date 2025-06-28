# Admin Management Article

A comprehensive article management system built with Next.js, featuring a modern admin dashboard for managing articles and categories.

## 🚀 Features

### Article Management

- **CRUD Operations**: Create, Read, Update, Delete articles
- **Rich Text Editor**: TinyMCE integration for content editing
- **Image Upload**: Support for article thumbnails
- **Category Management**: Organize articles by categories
- **Search & Filter**: Search by title and filter by category
- **Pagination**: Efficient data loading with pagination
- **Preview**: Preview articles before publishing

### Category Management

- **CRUD Operations**: Full category management
- **Modal Interface**: Clean modal-based create/edit forms
- **Search**: Search categories by name
- **Pagination**: Handle large category lists

### Authentication & Security

- **JWT Authentication**: Secure admin access with Bearer tokens
- **Protected Routes**: Admin-only access to management features
- **Session Management**: Persistent login state

### User Experience

- **Responsive Design**: Works on desktop and mobile
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **SweetAlert Notifications**: User-friendly success/error messages
- **Loading States**: Smooth user experience with loading indicators

## 🛠️ Technologies Used

- **Frontend Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Rich Text Editor**: TinyMCE
- **HTTP Client**: Axios
- **Notifications**: SweetAlert2
- **Icons**: Lucide React
- **TypeScript**: Type safety and better development experience
- **Font**: Archivo (Google Fonts)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd admin_management_article
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_BASE_URL=https://test-fe.mysellerpintar.com/api
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
admin_management_article/
├── app/
│   ├── articles/
│   │   ├── create/
│   │   │   └── page.tsx          # Create article page
│   │   └── edit/
│   │       └── [id]/
│   │           └── page.tsx      # Edit article page
│   ├── category/
│   │   └── page.tsx              # Category management page
│   ├── logins/
│   │   └── page.tsx              # Login page
│   ├── registers/
│   │   └── page.tsx              # Register page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (Articles list)
├── components/
│   ├── AuthCard.tsx              # Authentication card component
│   ├── CategoryModal.tsx         # Category create/edit modal
│   ├── Navbar.tsx                # Top navigation bar
│   └── SideBar.tsx               # Side navigation
├── public/
│   ├── iconLogo.svg              # Application logo
│   ├── iconLogo2.svg
│   └── iconLogo3.svg
└── README.md
```

## 🔧 API Endpoints

### Articles

- `GET /articles` - Get articles list with pagination
- `POST /articles` - Create new article
- `GET /articles/{id}` - Get article by ID
- `PUT /articles/{id}` - Update article
- `DELETE /articles/{id}` - Delete article

### Categories

- `GET /categories` - Get categories list
- `POST /categories` - Create new category
- `PUT /categories/{id}` - Update category
- `DELETE /categories/{id}` - Delete category

### Upload

- `POST /upload` - Upload image file

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration

## 🎨 Key Components

### SideBar

- Navigation menu with Articles, Category, and Logout
- Active state highlighting
- Responsive design

### Navbar

- Page title display
- User information and avatar
- Clean, minimal design

### CategoryModal

- Reusable modal for create/edit categories
- Form validation
- Success/error notifications

## 🔐 Authentication Flow

1. **Login**: Users authenticate with username/password
2. **Token Storage**: JWT token stored in localStorage
3. **Protected Routes**: All admin features require valid token
4. **Auto Logout**: Token validation and automatic logout on expiry

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:

- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Fatwa Akbar Jiwani**

- GitHub: [@fatwaakbarjiwani](https://github.com/fatwaakbarjiwani)
- LinkedIn: [Fatwa Akbar Jiwani](https://linkedin.com/in/fatwaakbarjiwani)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Tailwind CSS for the utility-first CSS framework
- TinyMCE for the rich text editor
- All contributors and supporters

---

Made with ❤️ by **Fatwa Akbar Jiwani**
