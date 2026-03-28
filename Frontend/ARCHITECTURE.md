/\*\*

- Architecture & Best Practices Documentation
  \*/

# Ionic React Mobile App - Architecture Guide

## 🏗️ Overall Architecture

```
┌──────────────────────────────────────────────┐
│             Ionic React App                  │
├──────────────────────────────────────────────┤
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │         React Components               │  │
│  │  (Pages, Components, UI Layer)         │  │
│  └────────────────────────────────────────┘  │
│           ↑         ↑         ↑              │
│           │         │         │              │
│  ┌────────────────────────────────────────┐  │
│  │      Custom Hooks & Guards             │  │
│  │  (useForm, useAuthGuard, useToast)    │  │
│  └────────────────────────────────────────┘  │
│           ↑                                   │
│           │                                   │
│  ┌────────────────────────────────────────┐  │
│  │      State Management (Zustand)        │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │  Auth | Task | Settings | UI    │  │  │
│  │  └──────────────────────────────────┘  │  │
│  └────────────────────────────────────────┘  │
│           ↑                                   │
│           │                                   │
│  ┌────────────────────────────────────────┐  │
│  │         API Service Layer              │  │
│  │  (authApi, taskApi, settingsApi)      │  │
│  └────────────────────────────────────────┘  │
│           ↑                                   │
│           │                                   │
│  ┌────────────────────────────────────────┐  │
│  │    HTTP Client (Axios + Interceptors) │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │  Request | Response | Error      │  │  │
│  │  │  Interceptors                    │  │  │
│  │  └──────────────────────────────────┘  │  │
│  └────────────────────────────────────────┘  │
│           ↑                                   │
└───────────┼───────────────────────────────────┘
            │
      Backend API
      (Node/Express)
```

## 📚 Layering Strategy

### 1. **UI Layer** (Components & Pages)

- Pure presentation logic
- Props passed from containers
- No direct API calls
- Styling with Tailwind CSS

### 2. **Container/Smart Components** (Pages)

- Handle routing
- Fetch data from stores
- Pass data to presentational components
- Manage component state

### 3. **Custom Hooks Layer**

- Encapsulate reusable logic
- Form handling
- Authentication checks
- Toast notifications

### 4. **State Management** (Zustand)

- Centralized data store
- Persist data to storage
- Handle async operations
- Manage loading/error states

### 5. **API Service Layer**

- Organized by domain (auth, task, settings)
- Type-safe requests/responses
- Error handling
- Timeout management

### 6. **HTTP Client Layer**

- Single axios instance
- Request/response interceptors
- Automatic token refresh
- Error handling

## 🔄 Data Flow Example

### Creating a Task:

```
User Input (CreateTaskPage)
    ↓
Form Validation (useForm hook)
    ↓
Store Action (useTaskStore.createTask)
    ↓
API Service (taskApi.createTask)
    ↓
HTTP Client (httpClient.post)
    ↓
Backend API (/tasks POST)
    ↓
Response → Store Update → Component Re-render
```

## 🎯 Zustand Store Design

Each store follows this pattern:

```typescript
interface MyState {
  // Data
  data: DataType[];
  isLoading: boolean;
  error: string | null;

  // Synchronous Actions
  setData: (data: DataType[]) => void;
  setError: (error: string | null) => void;

  // Asynchronous Actions
  fetchData: () => Promise<void>;
}

export const useMyStore = create<MyState>((set, get) => ({
  // Initial state
  data: [],
  isLoading: false,
  error: null,

  // Synchronous setters
  setData: (data) => set({ data }),
  setError: (error) => set({ error }),

  // Async actions
  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.fetch();
      set({ data, isLoading: false });
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },
}));
```

## 🔐 Authentication Pattern

### Login Flow:

```
1. User submits credentials
2. authApi.login() → Backend validates & returns tokens
3. Store saves tokens to Capacitor Storage
4. HTTP Client adds Authorization header
5. Protected routes check for tokens
6. User redirected to dashboard
```

### Token Refresh:

```
1. API request fails with 401
2. HTTP Interceptor catches error
3. Interceptor calls refresh endpoint
4. New tokens stored
5. Original request retried with new token
6. If refresh fails → logout user
```

## 🛡️ Error Handling Strategy

### Three Levels of Error Handling:

```typescript
// 1. Component Level (useToast)
try {
  await taskStore.createTask(input);
} catch (error) {
  toast.error("Failed to create task");
}

// 2. Store Level (set error state)
createTask: async (input) => {
  try {
    // ... API call
  } catch (error) {
    set({ error: error.message });
    throw error;
  }
};

// 3. HTTP Client Level (Interceptor)
interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle auth error globally
    }
    return Promise.reject(error);
  },
);
```

## 💡 Best Practices

### ✅ DO

1. **Use TypeScript** - Define interfaces for all data
2. **Separate Concerns** - Keep logic in stores, UI in components
3. **Error Handling** - Always handle API errors
4. **Loading States** - Show spinners for async operations
5. **Form Validation** - Validate before submission
6. **Type Safety** - Use strict typing in Zustand stores
7. **Environment Variables** - Never hardcode API URLs
8. **Reusable Components** - Create generic components
9. **Custom Hooks** - Extract complex logic into hooks
10. **Mobile First** - Design with mobile experience first

### ❌ DON'T

1. **API Calls in Components** - Use stores instead
2. **Global State for Everything** - Use local state when appropriate
3. **Synchronous Stores** - Keep stores simple and reactive
4. **Nested Ternaries** - Extract to separate components
5. **Large Components** - Split into smaller components
6. **Prop Drilling** - Use stores for deeply nested data
7. **Direct DOM Manipulation** - Use React patterns
8. **Ignoring Types** - Use `any` sparingly
9. **Hardcoded Values** - Use constants or config
10. **Memory Leaks** - Clean up subscriptions in useEffect

## 🧪 Testing Strategy

### Unit Tests

Test individual functions and hooks:

```typescript
describe("useForm", () => {
  it("validates email", () => {
    // Test validation logic
  });
});
```

### Integration Tests

Test store + API:

```typescript
describe("Auth Flow", () => {
  it("logs in user and saves tokens", async () => {
    // Test complete login flow
  });
});
```

### E2E Tests

Test complete user journeys:

```typescript
describe("User Dashboard", () => {
  it("creates and views task", () => {
    // Test from login to task creation
  });
});
```

## 📈 Scalability Considerations

### As App Grows:

1. **Split Stores** - Create separate stores per feature
2. **Extract Utilities** - Move complex logic to utils
3. **Component Library** - Build reusable component library
4. **API Versioning** - Support multiple API versions
5. **Offline Support** - Implement service workers
6. **Analytics** - Add event tracking
7. **Monitoring** - Add error tracking (Sentry)
8. **Performance** - Implement code splitting
9. **Security** - Add request signing
10. **Internationalization** - Add i18n support

## 🔗 Common Patterns

### Polling Pattern

```typescript
const { isPolling, task } = usePollTask(taskId);
// Automatically polls and stops when done
```

### Form Pattern

```typescript
const form = useForm({ email: "", password: "" });
<input {...form} name="email" onChange={form.handleChange} />;
```

### Protected Route Pattern

```typescript
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

### Async Action Pattern

```typescript
const { execute, status, data } = useAsync(apiCall);
```

## 🚀 Performance Tips

1. **Memoization** - Use React.memo for expensive components
2. **Lazy Loading** - Code-split pages
3. **Virtual Lists** - For large lists (when needed)
4. **Request Debouncing** - Debounce search requests
5. **Image Optimization** - Use responsive images
6. **Bundle Optimization** - Monitor bundle size
7. **Caching** - Cache API responses
8. **Prefetching** - Prefetch likely next pages
9. **Minimize Re-renders** - Use selectors in Zustand
10. **Tree Shaking** - Use ES6 modules for better tree shaking

## 📋 Code Review Checklist

- [ ] Types are properly defined
- [ ] Error handling implemented
- [ ] Loading states shown
- [ ] No API calls in components
- [ ] Using custom hooks properly
- [ ] Store actions are async-safe
- [ ] No memory leaks
- [ ] Mobile responsive
- [ ] Accessibility considered
- [ ] Performance optimized
