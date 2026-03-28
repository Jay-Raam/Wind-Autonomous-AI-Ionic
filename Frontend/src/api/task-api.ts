/**
 * Task API Service
 * Handles all task-related API calls
 */

import { httpClient } from './http-client';
import { Task, CreateTaskInput, Agent, Tool } from '../types/index';

interface TaskDetailResponse {
  task: Task;
  logs: unknown[];
}

export const taskApi = {
  // ============ Tasks ============
  async createTask(input: CreateTaskInput): Promise<Task> {
    return httpClient.post<Task>('/tasks', input);
  },

  async listTasks(): Promise<Task[]> {
    return httpClient.get<Task[]>('/tasks');
  },

  async getTaskById(taskId: string): Promise<Task> {
    const response = await httpClient.get<TaskDetailResponse>(`/tasks/${taskId}`);
    return response.task;
  },

  // ============ Agents ============
  async listAgentsByTask(taskId: string): Promise<Agent[]> {
    return httpClient.get<Agent[]>(`/agents/tasks/${taskId}`);
  },

  // ============ Tools ============
  async listToolsByTask(taskId: string): Promise<Tool[]> {
    return httpClient.get<Tool[]>(`/tools/tasks/${taskId}`);
  },
};
