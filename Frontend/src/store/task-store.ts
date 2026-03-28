/**
 * Task Store (Zustand)
 * Manages tasks, agents, and tools state
 */

import { create } from 'zustand';
import { Task, Agent, Tool, CreateTaskInput } from '../types/index';
import { taskApi } from '../api/task-api';

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  agents: Agent[];
  tools: Tool[];
  isLoading: boolean;
  error: string | null;

  // Task Actions
  createTask: (input: CreateTaskInput) => Promise<Task>;
  listTasks: () => Promise<void>;
  getTaskById: (taskId: string) => Promise<Task>;
  selectTask: (task: Task | null) => void;

  // Agent Actions
  listAgentsByTask: (taskId: string) => Promise<void>;

  // Tool Actions
  listToolsByTask: (taskId: string) => Promise<void>;

  // Common Actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useTaskStore = create<TaskState>((set: any) => ({
  tasks: [],
  selectedTask: null,
  agents: [],
  tools: [],
  isLoading: false,
  error: null,

  createTask: async (input: CreateTaskInput) => {
    set({ isLoading: true, error: null });
    try {
      const task = await taskApi.createTask(input);
      set((state: any) => ({
        tasks: [task, ...state.tasks],
        isLoading: false,
      }));
      return task;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create task';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  listTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskApi.listTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load tasks';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  getTaskById: async (taskId: string) => {
    set({ isLoading: true, error: null });
    try {
      const task = await taskApi.getTaskById(taskId);
      set((state: any) => ({
        selectedTask: task,
        tasks: state.tasks.map((t: any) => (t._id === task._id ? task : t)),
        isLoading: false,
      }));
      return task;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load task';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  selectTask: (task: Task | null) => set({ selectedTask: task }),

  listAgentsByTask: async (taskId: string) => {
    try {
      const agents = await taskApi.listAgentsByTask(taskId);
      set({ agents });
    } catch (error) {
      console.warn('Failed to load agents:', error);
    }
  },

  listToolsByTask: async (taskId: string) => {
    try {
      const tools = await taskApi.listToolsByTask(taskId);
      set({ tools });
    } catch (error) {
      console.warn('Failed to load tools:', error);
    }
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => set({
    tasks: [],
    selectedTask: null,
    agents: [],
    tools: [],
    isLoading: false,
    error: null,
  }),
}));
