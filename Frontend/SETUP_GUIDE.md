/\*\*

- Detailed Installation & Setup Guide
- Complete guide for setting up the Ionic React mobile application
  \*/

# Ionic React AI Task Manager - Setup Guide

## 📋 Prerequisites

- Node.js v16+ and npm v8+
- Ionic CLI: `npm install -g @ionic/cli`
- Capacitor CLI: `npm install -g @capacitor/cli`
- Git

## 🚀 Installation Steps

### 1. Install Dependencies

```bash

cd Frontend
npm install

```

### 2. Install Required Packages

Most dependencies are already in package.json, but ensure you have:

```bash

npm install axios zustand @capacitor/storage @ionic/react @ionic/core
npm install -D tailwindcss postcss autoprefixer typescript

```

### 3. Environment Configuration

Create `.env.local` in the `Frontend` directory:

```env

VITE_API_URL=http://localhost:3000/api
VITE_ENV=development

```

For production:

```env

VITE_API_URL=https://api.yourdomain.com/api
VITE_ENV=production

```

## 🏃 Running the Application

### Development Mode

```bash

# Start development server
npm run dev

# In another terminal, start Ionic
ionic serve

```

### Build for Production

```bash

npm run build

```

### Mobile Development (iOS/Android)

```bash

# Add platforms
ionic capacitor add ios
ionic capacitor add android

# Build and run on device
ionic capacitor copy
ionic capacitor open ios
ionic capacitor open android

# Or for direct run
ionic capacitor run ios
ionic capacitor run android

```

## 📁 Project Structure

```
Frontend/src/
├── api/
│   ├── http-client.ts       # Axios instance with interceptors
│   ├── auth-api.ts          # Authentication API calls
│   ├── task-api.ts          # Task/Agent/Tool API calls
│   ├── settings-api.ts      # Settings API calls
│   └── index.ts             # Barrel export
│
├── store/
│   ├── auth-store.ts        # Auth state (Zustand)
│   ├── task-store.ts        # Task state (Zustand)
│   ├── settings-store.ts    # Settings state (Zustand)
│   ├── ui-store.ts          # UI state (Zustand)
│   └── index.ts             # Barrel export
│
├── hooks/
│   └── index.ts             # Custom React hooks
│       - useAsync()          # Handle async operations
│       - useIsAuthenticated() # Check auth status
│       - useForm()           # Form state management
│       - usePollTask()       # Poll task status
│       - useToast()          # Toast notifications
│       - useAuthGuard()      # Protect routes
│       - useCurrentUser()    # Get current user
│
├── guards/
│   └── ProtectedRoute.tsx    # Route protection component
│
├── pages/
│   ├── LoginPage.tsx         # Login screen
│   ├── RegisterPage.tsx      # Registration screen
│   ├── DashboardPage.tsx     # Main task list
│   ├── CreateTaskPage.tsx    # Create new task
│   ├── TaskDetailPage.tsx    # Task details with agents/tools
│   └── SettingsPage.tsx      # User settings
│
├── components/
│   ├── common/
│   │   └── index.tsx         # Reusable components
│   │       - StatusBadge
│   │       - LoadingCard
│   │       - ErrorCard
│   │       - EmptyState
│   │       - TaskCard
│   │       - ConfirmAlert
│   ├── task/
│   │   └── (Task-specific components)
│   └── Toast.tsx             # Toast notification component
│
├── types/
│   └── index.ts              # TypeScript interfaces
│
├── utils/
│   ├── storage.ts            # Capacitor Storage utilities
│   ├── errors.ts             # Error handling
│   └── common.ts             # Date, format, status helpers
│
├── config/
│   └── env.ts                # Environment configuration
│
├── theme/
│   └── globals.css           # Global styles & Tailwind
│
├── router/
│   └── AppRouter.tsx         # Route configuration
│
└── App.tsx                   # Root component
```

## 🔐 Authentication Flow

1. **Register/Login**: User submits credentials
2. **Token Generation**: Backend generates JWT tokens
3. **Token Storage**: Tokens saved in secure Capacitor Storage
4. **Automatic Refresh**: HTTP interceptor handles token refresh
5. **Request Authorization**: Bearer token added to all API requests
6. **Session Management**: Auto-logout on 401 errors

## 📊 State Management (Zustand)

### Auth Store

```typescript
const { login, logout, user, tokens } = useAuthStore();
```

### Task Store

```typescript
const { createTask, listTasks, getTaskById, agents, tools } = useTaskStore();
```

### Settings Store

```typescript
const { settings, updateSettings, loadSettings } = useSettingsStore();
```

### UI Store

```typescript
const { addToast, toasts, isSideMenuOpen, toggleSideMenu } = useUIStore();
```

## 🎨 Component Examples

### Using Protected Routes

```typescript

<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

```

### Using Custom Hooks

```typescript

const { values, handleChange, setFieldValue } = useForm({
  email: "",
  password: "",
});

```

### Showing Toasts

```typescript
const toast = useToast();
toast.success("Operation successful");
toast.error("Something went wrong");
toast.warning("Check this");
toast.info("FYI information");
```

### Polling Task Status

```typescript
const { task, isPolling } = usePollTask(taskId);
```

## 🔄 API Integration Pattern

### 1. Define API Service

```typescript
// api/task-api.ts
export const taskApi = {
  async createTask(input: CreateTaskInput): Promise<Task> {
    return httpClient.post<Task>("/tasks", input);
  },
};
```

### 2. Create Store Action

```typescript
// store/task-store.ts
createTask: async (input) => {
  const task = await taskApi.createTask(input);
  set((state) => ({
    tasks: [task, ...state.tasks],
  }));
  return task;
},
```

### 3. Use in Component

```typescript
const { createTask, isLoading } = useTaskStore();

const handleCreate = async () => {
  try {
    await createTask(input);
  } catch (error) {
    toast.error("Failed to create");
  }
};
```

## 🛡️ Error Handling

### API Errors

```typescript
try {
  await taskApi.createTask(input);
} catch (error) {
  const { message, code, statusCode } = parseApiError(error);
  toast.error(message);
}
```

### Validation Errors

```typescript
form.setFieldError("email", "Invalid email format");
```

## ⚡ Performance Optimizations

1. **Code Splitting**: Routes are lazy-loaded via React Router
2. **API Caching**: Settings cached in Capacitor Storage
3. **Request Deduplication**: HTTP interceptor prevents duplicate requests
4. **Token Refresh Queue**: Queues requests during token refresh
5. **Polling Optimization**: Task polling stops on completed/failed status

## 🧪 Testing Guidelines

### Unit Tests (Jest/Vitest)

```typescript
describe("useForm", () => {
  it("should update form values", () => {
    const form = useForm({ email: "" });
    form.setFieldValue("email", "test@example.com");
    expect(form.values.email).toBe("test@example.com");
  });
});
```

### E2E Tests (Cypress)

Already configured in `cypress.config.ts`

```bash
npm run cypress:open
```

## 📱 Mobile Specific Features

### Storage

Uses Capacitor Storage for secure token persistence:

```typescript
await storageUtils.saveTokens(tokens);
```

### Permissions

For file attachments, request permissions:

```typescript
import { Filesystem } from "@capacitor/filesystem";
```

## 🚀 Deployment

### Web (Vercel/Netlify)

```bash
npm run build
# Deploy the dist/ folder
```

### iOS

```bash
ionic capacitor copy ios
ionic capacitor open ios
# Build and archive in Xcode
```

### Android

```bash
ionic capacitor copy android
ionic capacitor open android
# Build in Android Studio
```

## 🐛 Troubleshooting

### CORS Issues

Ensure backend has CORS configured:

```typescript
// backend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
```

### Token Expired

Automatic refresh happens transparently. If logout occurs:

1. User redirected to login
2. Tokens cleared
3. New login required

### Mobile App Not Connecting

1. Check API URL in `.env.local`
2. Verify backend is running
3. Check device network connection
4. Enable HTTPS for production

## 📚 Additional Resources

- [Ionic React Documentation](https://ionicframework.com/docs/react)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Axios Documentation](https://axios-http.com/)
- [Capacitor Documentation](https://capacitorjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 📝 Development Workflow

1. Create feature branch
2. Implement API service
3. Create Zustand store
4. Build page component
5. Add error handling
6. Test with real backend
7. Create PR for review

## 🎯 Next Steps

- [ ] Configure backend API URL
- [ ] Test authentication flow
- [ ] Customize theme colors
- [ ] Add app icon and splash screen
- [ ] Set up mobile builds
- [ ] Configure push notifications (optional)
- [ ] Implement offline support (optional)
