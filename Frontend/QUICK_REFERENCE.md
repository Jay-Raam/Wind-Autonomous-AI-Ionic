/\*\*

- Quick Reference Guide
- Cheat sheet for common tasks
  \*/

# Ionic React Mobile App - Quick Reference Guide

## 🚀 Quick Start (5 minutes)

```bash
cd Frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your API URL
npm run dev
```

Open http://localhost:5173

---

## 🔐 Authentication

### Login

```typescript
const { login, user } = useAuthStore();
await login("email@example.com", "password");
// Tokens auto-saved, redirects to dashboard
```

### Register

```typescript
const { register } = useAuthStore();
await register("email@example.com", "John", "password");
```

### Logout

```typescript
const { logout } = useAuthStore();
await logout();
// Tokens cleared, redirects to login
```

### Check if Authenticated

```typescript
const { tokens } = useAuthStore();
const isAuth = !!tokens?.accessToken;

// Or use hook
const isAuth = useIsAuthenticated();
```

---

## 📝 Form Handling

```typescript
const form = useForm({ email: "", password: "" });

// Update value
form.setFieldValue("email", "test@example.com");

// Set error
form.setFieldError("email", "Invalid email");

// Get values
console.log(form.values.email);

// Get errors
console.log(form.errors.email);

// Reset
form.reset();

// In JSX
<input name="email" value={form.values.email} onChange={form.handleChange} />;
```

---

## 📢 Toast Notifications

```typescript
const toast = useToast();

toast.success("Task created!"); // Green
toast.error("Failed to save"); // Red
toast.warning("This is permanent"); // Yellow
toast.info("New update available"); // Blue

// Custom duration (ms)
toast.success("Saved!", 5000);
```

---

## 📊 Task Management

### Create Task

```typescript
const { createTask } = useTaskStore();
const task = await createTask({
  input: "Analyze the data and create a report",
});
```

### List Tasks

```typescript
const { tasks, listTasks } = useTaskStore();
useEffect(() => {
  listTasks();
}, []);
```

### Get Task Details

```typescript
const { selectedTask, getTaskById, agents, tools } = useTaskStore();
useEffect(() => {
  getTaskById(taskId);
  listAgentsByTask(taskId);
  listToolsByTask(taskId);
}, [taskId]);
```

### Poll Task Status

```typescript
const { task, isPolling } = usePollTask(taskId);
// Automatically updates every 2 seconds
// Stops when completed or failed
```

---

## ⚙️ Settings Management

### Get Settings

```typescript
const { settings, loadSettings } = useSettingsStore();
useEffect(() => {
  loadSettings();
}, []);
```

### Update Settings

```typescript
const { updateSettings, setAiModel, setTemperature } = useSettingsStore();

// Update one field
await setAiModel("wind-v2.5");
await setTemperature(0.7);

// Update multiple
await updateSettings({
  aiModel: "wind-v2.5",
  temperature: 0.7,
  autonomousMode: true,
});
```

### Available Settings

```typescript
{
  aiModel: 'wind-v2.5' | 'wind-v2.0' | 'deepthink-1.0',
  temperature: 0.0-1.0,
  requireToolApproval: boolean,
  autonomousMode: boolean,
}
```

---

## 🎨 Components

### Status Badge

```typescript
import { StatusBadge } from '@/components/common';

<StatusBadge status="running" />  // Shows status with icon
<StatusBadge status="completed" className="text-lg" />
```

### Loading Card

```typescript
import { LoadingCard } from "@/components/common";

<LoadingCard message="Loading tasks..." />;
```

### Error Card

```typescript
import { ErrorCard } from "@/components/common";

<ErrorCard error="Something went wrong" onRetry={handleRetry} />;
```

### Empty State

```typescript
import { EmptyState } from "@/components/common";

<EmptyState
  title="No tasks found"
  subtitle="Create your first task to get started"
  icon="document-outline"
/>;
```

### Task Card

```typescript
import { TaskCard } from "@/components/common";

<TaskCard
  taskId={task._id}
  title={task.input}
  status={task.status}
  createdAt={task.createdAt}
  onClick={(id) => navigate(`/tasks/${id}`)}
/>;
```

---

## 🛡️ Protected Routes

```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

Automatically:

- Redirects to login if not authenticated
- Shows loading spinner while checking auth
- Works with React Router v6

---

## 🔄 Async Operations

```typescript
const { execute, status, data, error, isLoading } = useAsync(
  () => taskApi.listTasks(),
  true, // immediate
);

// status: 'idle' | 'pending' | 'success' | 'error'
if (isLoading) return <Spinner />;
if (error) return <Error retry={execute} />;
return <List items={data} />;
```

---

## 🌐 API Calls

### From Components (Use Stores!)

```typescript
// ❌ DON'T do this in components
import { httpClient } from "@/api";
await httpClient.get("/tasks"); // Wrong!

// ✅ DO this instead
import { useTaskStore } from "@/store";
const { tasks, listTasks } = useTaskStore();
await listTasks();
```

### Custom API Service

```typescript
// src/api/my-api.ts
import { httpClient } from "./http-client";

export const myApi = {
  async doSomething(id: string): Promise<MyType> {
    return httpClient.get(`/endpoint/${id}`);
  },
};
```

---

## 📱 Navigation

### Navigate to Page

```typescript
const navigate = useNavigate();

navigate("/dashboard"); // Go to path
navigate("/tasks/123"); // With params
navigate(-1); // Go back
navigate("/login", { replace: true }); // Replace history
```

### Link Component

```typescript
<Link to="/tasks/123">View Task</Link>

// Ionic button with router
<IonButton routerLink="/dashboard">Dashboard</IonButton>
```

### Get Route Params

```typescript
const { taskId } = useParams<{ taskId: string }>();

// Example URL: /tasks/:taskId
```

---

## 🏗️ Project Structure

```
src/
├── api/           - API service layer (use these!)
├── store/         - State management (Zustand)
├── hooks/         - Custom React hooks
├── pages/         - Full page components
├── components/    - Reusable UI components
├── guards/        - Route protection (ProtectedRoute)
├── router/        - Route configuration
├── types/         - TypeScript interfaces
├── utils/         - Utility functions
├── config/        - Configuration
└── theme/         - Styling
```

---

## 🧪 Testing

### Unit Test Example

```typescript
describe("useForm", () => {
  it("updates form values", () => {
    const form = useForm({ email: "" });
    form.setFieldValue("email", "test@example.com");
    expect(form.values.email).toBe("test@example.com");
  });
});
```

### E2E Test Example

```typescript
describe("Login", () => {
  it("logs in user", () => {
    cy.visit("/login");
    cy.get('input[name="email"]').type("user@example.com");
    cy.get('input[name="password"]').type("password");
    cy.get("button").contains("Sign In").click();
    cy.url().should("include", "/dashboard");
  });
});
```

---

## 🐛 Debugging

### Check Store State

```typescript
// In browser console
localStorage.getItem("auth-store"); // Zustand persistence
```

### Check API Calls

```typescript
// Network tab in DevTools
// Look for API requests to backend
// Check status codes and responses
```

### Check Auth Status

```typescript
// In component or console
useAuthStore.getState().tokens;
useAuthStore.getState().user;
```

### Inspect State

```typescript
// Add to component
useEffect(() => {
  console.log("State:", useTaskStore.getState());
}, []);
```

---

## 📚 Type Definitions

```typescript
// User
interface User {
  id: string;
  email: string;
  name: string;
}

// Task
interface Task {
  _id: string;
  userId: string;
  status: TaskStatus;
  input: string;
  result?: string;
  error?: string;
  tokenUsage?: TokenUsage;
  createdAt: string;
  updatedAt: string;
}

// Status
type TaskStatus = "pending" | "running" | "completed" | "failed";

// Settings
interface UserSettings {
  aiModel: AiModel;
  temperature: number;
  requireToolApproval: boolean;
  autonomousMode: boolean;
}
```

---

## ⚡ Performance Tips

```typescript
// ✅ Good: Memoize expensive components
const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

// ✅ Good: Use Zustand selectors to prevent re-renders
const tasks = useTaskStore((state) => state.tasks);

// ✅ Good: Debounce search
const debouncedSearch = debounce((value) => {
  Search(value);
}, 300);

// ❌ Bad: Inline objects in renders
<component style={{ color: "red" }} />; // Creates new object each render

// ❌ Bad: Large lists without virtualization
{
  items.map((item) => <Item key={item.id} />);
} // Thousands of items
```

---

## 🚀 Common Workflows

### Add New API Endpoint

**Step 1: Add to service**

```typescript
// api/task-api.ts
async myNewEndpoint(id: string): Promise<MyType> {
  return httpClient.get(`/new-endpoint/${id}`);
},
```

**Step 2: Create store action**

```typescript
// store/task-store.ts
myAction: async (id) => {
  const result = await taskApi.myNewEndpoint(id);
  set({ /* update state */ });
},
```

**Step 3: Use in component**

```typescript
// pages/MyPage.tsx
const { myAction, result } = useTaskStore();
useEffect(() => {
  myAction(id);
}, [id]);
```

### Add New Page

**Step 1: Create file**

```typescript
// pages/NewPage.tsx
const NewPage = () => {
  return <IonPage>{/* content */}</IonPage>;
};
export default NewPage;
```

**Step 2: Add route**

```typescript
// router/AppRouter.tsx
<Route path="/new-page" element={<NewPage />} />
```

**Step 3: Add navigation**

```typescript
<IonButton routerLink="/new-page">New Page</IonButton>;
// Or programmatic
navigate("/new-page");
```

### Add Error Handling

```typescript
try {
  await action();
  toast.success("Success!");
} catch (error) {
  const message = getErrorMessage(error);
  toast.error(message);
}
```

---

## 🔗 Environment Variables

```env
VITE_API_URL=http://localhost:3000/api
VITE_ENV=development

# Production
VITE_API_URL=https://api.yourdomain.com/api
VITE_ENV=production
```

---

## 📖 Documentation Files

```
README.md              - Overview and quick start
SETUP_GUIDE.md         - Detailed installation
ARCHITECTURE.md        - Architecture and patterns
API_DOCUMENTATION.md   - Complete API reference
```

---

## 💡 Pro Tips

1. **Always validate forms** before submission
2. **Always show loading states** during async operations
3. **Always handle errors** with try/catch
4. **Always use selectors** in Zustand to prevent re-renders
5. **Always check auth** before accessing protected data
6. **Always clear tokens** on logout
7. **Always update types** when API changes
8. **Always test** before merging to main
9. **Always document** complex logic
10. **Always optimize** bundle size

---

## 🆘 Getting Help

1. Check documentation files
2. Review similar components
3. Check store implementation
4. Look at API service
5. Debug with console logs
6. Check browser DevTools
7. Review React/Ionic docs

---

## ✨ You're All Set!

You now have a complete, production-ready Ionic React mobile application.

**Next steps:**

1. Read SETUP_GUIDE.md
2. Run the dev server
3. Login with test credentials
4. Explore the app
5. Read the code
6. Start building features!

**Happy coding! 🎉**
