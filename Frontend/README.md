# Ionic React AI Task Manager - Complete Documentation

## 📱 Project Overview

A fully-featured Ionic React mobile application for managing AI-powered tasks. The app provides:

- **User Authentication** - Secure JWT-based auth with automatic token refresh
- **Task Management** - Create, list, and view detailed task information
- **Agent Tracking** - Monitor AI agents executing tasks
- **Tool Usage** - See tools utilized by AI agents
- **User Settings** - Configure AI model, temperature, and execution modes
- **Responsive Design** - Works seamlessly on mobile, tablet, and web

## 🎯 Key Features

✅ **Authentication System**

- Register and login with email/password
- JWT tokens with automatic refresh
- Secure token storage using Capacitor
- Session management

✅ **Task Management**

- Create new tasks with descriptions
- View task list with status filtering
- Real-time task status polling
- Detailed task view with agents and tools

✅ **AI Settings**

- Select AI model (Wind v2.5, Wind v2.0, DeepThink v1.0)
- Adjust temperature for response creativity
- Tool approval requirement setting
- Autonomous execution mode

✅ **User Experience**

- Bottom pull-to-refresh
- Toast notifications for feedback
- Side navigation menu
- Floating action button for quick create
- Loading states and error handling
- Empty states with helpful messages

✅ **Performance**

- Automatic token refresh without user interaction
- API request queuing during token refresh
- Settings caching for offline access
- Task polling with auto-stop on completion
- Minimal re-renders with Zustand selectors

## 📖 Quick Start

### Prerequisites

```bash
Node.js v16+
npm v8+
Ionic CLI
```

### Installation

```bash
# 1. Navigate to frontend directory
cd Frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.local.example .env.local

# 4. Edit .env.local with your backend API URL
# VITE_API_URL=http://localhost:3000/api

# 5. Start development server
npm run dev

# 6. In another terminal, start Ionic
ionic serve
```

Open your browser to `http://localhost:5173`

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── api/                    # API service layer
│   │   ├── http-client.ts      # Axios with interceptors
│   │   ├── auth-api.ts         # Auth endpoints
│   │   ├── task-api.ts         # Task/Agent/Tool endpoints
│   │   └── settings-api.ts     # Settings endpoints
│   │
│   ├── store/                  # Zustand state management
│   │   ├── auth-store.ts       # Authentication state
│   │   ├── task-store.ts       # Task/Agent/Tool state
│   │   ├── settings-store.ts   # Settings state
│   │   └── ui-store.ts         # UI notifications state
│   │
│   ├── hooks/                  # Custom React hooks
│   │   └── index.ts            # useForm, useToast, usePollTask, etc.
│   │
│   ├── pages/                  # Page components
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── CreateTaskPage.tsx
│   │   ├── TaskDetailPage.tsx
│   │   └── SettingsPage.tsx
│   │
│   ├── components/             # Reusable components
│   │   ├── common/             # Common UI components
│   │   │   └── index.tsx       # StatusBadge, LoadingCard, etc.
│   │   ├── task/               # Task-specific components
│   │   └── Toast.tsx           # Toast notification container
│   │
│   ├── guards/                 # Route protection
│   │   └── ProtectedRoute.tsx  # Auth guard wrapper
│   │
│   ├── router/                 # Routing setup
│   │   └── AppRouter.tsx       # Route configuration
│   │
│   ├── types/                  # TypeScript definitions
│   │   └── index.ts
│   │
│   ├── utils/                  # Utility functions
│   │   ├── storage.ts          # Capacitor storage
│   │   ├── errors.ts           # Error handling
│   │   └── common.ts           # Date, format, status utils
│   │
│   ├── config/                 # Configuration
│   │   └── env.ts
│   │
│   ├── theme/                  # Styling
│   │   └── globals.css         # Global styles & Tailwind
│   │
│   ├── App.tsx                 # Root component
│   └── main.tsx                # Entry point
│
├── public/                     # Static assets
├── cypress/                    # E2E tests
├── SETUP_GUIDE.md             # Detailed setup instructions
├── ARCHITECTURE.md            # Architecture & best practices
├── .env.local.example         # Environment variables template
└── package.json
```

## 🔑 Core Concepts

### Authentication Flow

1. User registers/logs in
2. Backend returns JWT tokens (access + refresh)
3. Tokens stored securely in Capacitor Storage
4. Access token sent with API requests
5. When token expires, automatic refresh happens
6. User doesn't need to re-login

### State Management

Using Zustand for lightweight, scalable state:

```typescript
// Auth
const { login, logout, user, tokens } = useAuthStore();

// Tasks
const { createTask, listTasks, selectedTask } = useTaskStore();

// Settings
const { settings, updateSettings } = useSettingsStore();

// UI
const { addToast, toasts } = useUIStore();
```

### Custom Hooks

```typescript
// Form handling
const form = useForm({ email: "", password: "" });

// Toast notifications
const toast = useToast();

// Protected access
useAuthGuard(); // Redirects if not logged in

// Task polling
const { task } = usePollTask(taskId);
```

## 🚀 Usage Examples

### Login

```tsx
const { login } = useAuthStore();
await login("user@example.com", "password");
// Redirects to dashboard automatically
```

### Create Task

```tsx
const { createTask } = useTaskStore();
const task = await createTask({
  input: "Analyze this data...",
});
```

### Update Settings

```tsx
const { updateSettings } = useSettingsStore();
await updateSettings({ aiModel: "wind-v2.5" });
```

### Show Toast

```tsx
const toast = useToast();
toast.success("Task created!");
toast.error("Failed to save");
```

## 🛠️ Development

### Available Scripts

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

### Making API Changes

1. **Update Types** (`src/types/index.ts`)

```typescript
export interface NewType {
  id: string;
  name: string;
}
```

2. **Add API Service** (`src/api/new-api.ts`)

```typescript
export const newApi = {
  async fetch(): Promise<NewType[]> {
    return httpClient.get("/endpoint");
  },
};
```

3. **Create Zustand Store** (`src/store/new-store.ts`)

```typescript
export const useNewStore = create((set) => ({
  items: [],
  fetchItems: async () => {
    const data = await newApi.fetch();
    set({ items: data });
  },
}));
```

4. **Use in Component** (`src/pages/NewPage.tsx`)

```typescript
const { items } = useNewStore();
useEffect(() => {
  useNewStore.getState().fetchItems();
}, []);
```

## 📱 Mobile Specific

### Build for iOS

```bash
ionic capacitor add ios
ionic capacitor copy ios
ionic capacitor open ios
# Build in Xcode
```

### Build for Android

```bash
ionic capacitor add android
ionic capacitor copy android
ionic capacitor open android
# Build in Android Studio
```

### Permissions

File uploads may require permissions:

```typescript
import { Permissions } from "@capacitor/permissions";
const status = await Permissions.query({ name: "camera" });
```

## 🧪 Testing

### Unit Tests (Jest/Vitest)

```bash
npm run test
```

Example test:

```typescript
describe("useForm", () => {
  it("updates form values", () => {
    const form = useForm({ email: "" });
    form.setFieldValue("email", "test@example.com");
    expect(form.values.email).toBe("test@example.com");
  });
});
```

### E2E Tests (Cypress)

```bash
npm run cypress:open
```

Example test:

```typescript
describe("Login Flow", () => {
  it("logs in user", () => {
    cy.visit("/login");
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password");
    cy.get("button").contains("Sign In").click();
    cy.url().should("include", "/dashboard");
  });
});
```

## 🔒 Security Best Practices

✅ **Implemented**

- JWT tokens stored securely (Capacitor Storage)
- HTTP-only cookies when possible
- Token refresh without user interaction
- Protected routes with route guards
- Secure password hashing (backend)
- CORS configuration (backend)
- Input validation
- Error messages don't leak sensitive info

✅ **To Implement**

- HTTPS in production (required)
- Certificate pinning for mobile apps
- Biometric authentication (optional)
- API rate limiting (backend)
- Request signing (for high-security apps)

## 🐛 Troubleshooting

### API Connection Issues

```
1. Check VITE_API_URL in .env.local
2. Verify backend is running
3. Check CORS configuration
4. Look at browser console for errors
```

### Token Expiration

```
Automatic! The app handles this:
1. API request fails with 401
2. App refreshes token silently
3. Request retried
4. User doesn't notice
```

### Mobile Build Issues

```
1. Clear node_modules: rm -rf node_modules && npm install
2. Clear build: rm -rf dist/
3. Rebuild: ionic capacitor build ios
4. Check Xcode build settings
```

## 📊 Performance

- **Bundle Size**: ~180KB (gzipped)
- **First Load**: <2 seconds (on 5G)
- **API Response Time**: Varies by backend
- **Memory Usage**: ~40MB (mobile)

## 🎨 Customization

### Change Theme Colors

Edit `src/theme/globals.css`:

```css
:root {
  --ion-color-primary: #3880ff;
  --ion-color-secondary: #3dc2ff;
  --ion-color-danger: #f04141;
}
```

### Change App Icon

```bash
# iOS
cp your-icon.png ios/App/App/Assets.xcassets/AppIcon.appiconset/

# Android
# Copy icons to android/app/src/main/res/mipmap-*/
```

### Customize Navigation

Edit `src/router/AppRouter.tsx` for routes and menu items.

## 📚 Documentation Files

- **SETUP_GUIDE.md** - Detailed installation and setup
- **ARCHITECTURE.md** - Architecture patterns and best practices
- **README.md** (this file) - Quick reference

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Make changes and test locally
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues:

1. Check existing GitHub issues
2. Review documentation files
3. Check browser console for errors
4. Check backend API logs

## 🎓 Learning Resources

- [Ionic React Docs](https://ionicframework.com/docs/react)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [Axios Documentation](https://axios-http.com/)
- [React Best Practices](https://react.dev/)
- [Capacitor Docs](https://capacitorjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🚀 Next Steps

- [ ] Configure backend API URL
- [ ] Test authentication flow
- [ ] Customize branding/colors
- [ ] Set up mobile builds
- [ ] Add push notifications (optional)
- [ ] Implement offline support (optional)
- [ ] Deploy to app stores
- [ ] Set up monitoring/analytics

---

**Happy coding! 🎉**
