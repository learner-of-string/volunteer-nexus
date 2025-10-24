# 🌟 Volunteer Nexus

> **Connecting Hearts, Building Communities** - A modern volunteer management platform that bridges the gap between organizations and passionate volunteers.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Volunteer%20Nexus-blue?logo=vercel&logoColor=white)](https://volunteer-nexus-frontend.vercel.app/)
[![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-purple?logo=vite)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-5.1.0-green?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.20.0-green?logo=mongodb)](https://mongodb.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.3.0-orange?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.14-cyan?logo=tailwindcss)](https://tailwindcss.com/)

## 🌐 Live Demo

**Experience Volunteer Nexus in action!** 🚀

👉 **[Visit Live Application](https://volunteer-nexus-frontend.vercel.app/)** 👈

The live application is deployed on Vercel and showcases all the features including:
- User authentication with Google OAuth
- Volunteer opportunity browsing and filtering
- Application management system
- Responsive design for all devices
- Real-time notifications and updates

## 🚀 Overview

Volunteer Nexus is a comprehensive volunteer management platform designed to connect organizations with passionate volunteers. Built with modern web technologies, it provides an intuitive interface for posting volunteer opportunities, managing applications, and tracking volunteer engagement.

## ✨ Key Features

### 🏠 **For Organizations**
- **Create Opportunities**: Post detailed volunteer opportunities with categories, locations, and requirements
- **Manage Applications**: Review and respond to volunteer applications with status tracking
- **Dashboard Analytics**: Track volunteer engagement and application statistics
- **Real-time Updates**: Get instant notifications for new applications

### 👥 **For Volunteers**
- **Browse Opportunities**: Discover volunteer opportunities by category and location
- **Easy Application**: Apply to opportunities with a single click
- **Track Applications**: Monitor application status and manage your volunteer journey
- **Profile Management**: Maintain your volunteer profile and preferences

### 🔐 **Security & Authentication**
- **Firebase Authentication**: Secure login with Google OAuth and email/password
- **JWT Token Management**: Secure API access with HTTP-only cookies
- **Developer Tools Protection**: Advanced security measures against unauthorized access
- **Session Management**: Automatic session handling and token refresh

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** - Modern UI library with hooks and context
- **Vite 7.1.7** - Lightning-fast build tool and development server
- **React Router DOM 7.9.3** - Client-side routing
- **Tailwind CSS 4.1.14** - Utility-first CSS framework
- **Framer Motion 12.23.22** - Smooth animations and transitions
- **Radix UI** - Accessible component primitives
- **Sonner** - Beautiful toast notifications

### Backend
- **Express 5.1.0** - Fast, unopinionated web framework
- **MongoDB 6.20.0** - NoSQL database for flexible data storage
- **JWT Authentication** - Secure token-based authentication
- **CORS & Cookie Parser** - Cross-origin resource sharing and cookie handling

### Authentication & Security
- **Firebase Authentication** - Google OAuth and email/password authentication
- **JWT Tokens** - Secure API authentication with HTTP-only cookies
- **Developer Tools Protection** - Advanced security against unauthorized access
- **Session Management** - Automatic token refresh and session handling

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Modern Animations**: Smooth transitions and micro-interactions
- **Accessibility**: WCAG compliant components with keyboard navigation
- **Dark Mode Support**: Theme-aware components
- **Custom Components**: Reusable UI components with consistent design system

## 📱 Pages & Routes

### Public Pages
- **Home** (`/`) - Landing page with hero section and opportunity listings
- **All Posts** (`/all-posts`) - Browse all available volunteer opportunities
- **Sign In** (`/sign-in`) - User authentication
- **Sign Up** (`/sign-up`) - User registration

### Protected Pages
- **Dashboard** (`/dashboard`) - User dashboard with quick actions
- **Create Post** (`/post-to-get-volunteer`) - Create new volunteer opportunities
- **Manage Posts** (`/manage-post/me`) - Manage your posted opportunities
- **My Applications** (`/my-applications`) - Track your volunteer applications
- **Hunting Post** (`/hunting-post`) - Search and filter opportunities
- **Applicant Details** (`/applicant-details/:email`) - View applicant information

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm (v10.14.0 or higher)
- MongoDB Atlas account
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/learner-of-string/volunteer-nexus.git
   cd volunteer-nexus
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd volunteer-nexus
   pnpm install
   
   # Backend
   cd ../volunteer-nexus-backend
   pnpm install
   ```

3. **Environment Setup**
   
   **Frontend** (`.env`):
   ```env
   VITE_SERVER_URL=http://localhost:5000
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   ```

   **Backend** (`.env`):
   ```env
   DB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the application**
   ```bash
   # Start backend server
   cd volunteer-nexus-backend
   pnpm dev
   
   # Start frontend development server
   cd ../volunteer-nexus
   pnpm dev
   ```

## 🏗️ Project Structure

```
module-63/
├── volunteer-nexus/                 # Frontend React application
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── Pages/                 # Page components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── contexts/              # React context providers
│   │   ├── firebase/              # Firebase configuration
│   │   ├── lib/                   # Utility functions
│   │   └── Routes/                # Route definitions
│   └── public/                    # Static assets
└── volunteer-nexus-backend/        # Backend Express server
    ├── index.js                   # Main server file
    └── package.json              # Backend dependencies
```

## 🔧 Development

### Available Scripts

**Frontend:**
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm deploy` - Build and deploy to Vercel

**Backend:**
- `pnpm dev` - Start development server with nodemon
- `pnpm start` - Start production server

### Code Quality
- **ESLint** - Code linting and formatting
- **TypeScript Support** - Type checking and IntelliSense
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality

## 🚀 Deployment

### Frontend (Vercel)
```bash
pnpm build
vercel --prod
```

### Backend (Vercel/Heroku)
- Configure environment variables
- Deploy using Vercel CLI or Heroku CLI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Vite Team** - For the lightning-fast build tool
- **Tailwind CSS** - For the utility-first CSS framework
- **Firebase** - For authentication and hosting services
- **MongoDB** - For the flexible database solution

## 📞 Support

If you have any questions or need help, please open an issue or contact the development team.

---

<div align="center">
  <p>Made with ❤️ by the Volunteer Nexus Team</p>
  <p>🌟 Star this repository if you found it helpful!</p>
</div>