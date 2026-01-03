/**
 * Admin Service
 * Handles all admin-related API calls
 */

import apiClient from './api.client';
import type {
  SystemStats,
  User,
  DeleteUserResponse,
  Leave,
  UpdateLeaveRequest,
  UpdateLeaveResponse,
  Room,
  RoomsResponse,
  DeleteRoomResponse,
} from '../types/api.types';

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  designation: string;
  wage: number;
  joinDate: string;
}

export interface CreateUserResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  tempPassword?: string;
}

export class AdminService {
  /**
   * Create a new employee/user
   */
  static async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    const response = await apiClient.post<CreateUserResponse>('/admin/create-user', data);
    return response.data;
  }

  /**
   * Get system statistics
   */
  static async getStats(): Promise<SystemStats> {
    const response = await apiClient.get<SystemStats>('/admin/stats');
    return response.data;
  }

  /**
   * Get all users
   */
  static async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/admin/users');
    return response.data;
  }

  /**
   * Delete user
   */
  static async deleteUser(id: string): Promise<DeleteUserResponse> {
    const response = await apiClient.delete<DeleteUserResponse>(`/admin/users/${id}`);
    return response.data;
  }

  /**
   * Update leave status (approve/reject)
   */
  static async updateLeaveStatus(id: number, data: UpdateLeaveRequest): Promise<UpdateLeaveResponse> {
    const response = await apiClient.put<UpdateLeaveResponse>(`/admin/leave/${id}`, data);
    return response.data;
  }

  /**
   * Get all leave requests
   */
  static async getAllLeaves(): Promise<Leave[]> {
    const response = await apiClient.get<Leave[]>('/admin/leaves');
    return response.data;
  }

  /**
   * Get all rooms (placeholder)
   */
  static async getRooms(): Promise<RoomsResponse> {
    const response = await apiClient.get<RoomsResponse>('/admin/rooms');
    return response.data;
  }

  /**
   * Delete room (placeholder)
   */
  static async deleteRoom(roomId: number): Promise<DeleteRoomResponse> {
    const response = await apiClient.delete<DeleteRoomResponse>(`/admin/rooms/${roomId}`);
    return response.data;
  }

  /**
   * Get all attendance records for today
   */
  static async getAllAttendance(): Promise<any[]> {
    const response = await apiClient.get<any[]>('/admin/attendance');
    return response.data;
  }
}

export default AdminService;
