/**
 * Type Definitions for AI Task Management System
 */

// ============ Auth Types ============
export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';
export type AiModel = 'wind-v2.5' | 'wind-v2.0' | 'deepthink-1.0';
export type AgentType = 'PlannerAgent' | 'ResearchAgent' | 'AnalysisAgent' | 'WriterAgent';
export type ToolType = 'WebSearchTool' | 'CalculatorTool' | 'DocumentReaderTool';
export type AttachmentKind = 'code' | 'csv' | 'text' | 'json' | 'markdown' | 'pdf';

// ============ User & Auth ============
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserSettings {
  aiModel: AiModel;
  temperature: number;
  requireToolApproval: boolean;
  autonomousMode: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AttachmentFile {
  fileName: string;
  mimeType: string;
  size: number;
  kind: AttachmentKind;
  content: string;
  truncated: boolean;
}

// ============ Task Types ============
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface Task {
  _id: string;
  userId: string;
  status: TaskStatus;
  input: string;
  attachment?: AttachmentFile;
  result?: string;
  error?: string;
  tokenUsage?: TokenUsage;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  input: string;
  attachment?: AttachmentFile;
}

// ============ Agent Types ============
export interface Agent {
  _id: string;
  taskId: string;
  name: AgentType;
  status: TaskStatus;
  output?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ Tool Types ============
export interface Tool {
  _id: string;
  taskId: string;
  name: ToolType;
  query: string;
  result?: string;
  status: 'running' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

// ============ API Request/Response ============
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

// ============ UI State ============
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}
