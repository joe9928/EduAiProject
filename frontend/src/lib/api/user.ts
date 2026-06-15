// src/lib/api/user.ts
import api from './client'
import { User } from '@/store/auth.store'

export interface EnrolledCourse {
  id:           string
  title:        string
  description:  string
  progress:     number
  totalLessons: number
  completedLessons: number
  thumbnailUrl?: string
  instructor:   string
  lastAccessed?: string
}

export interface DashboardStats {
  enrolledCourses:    number
  completedLessons:   number
  overallProgress:    number
  learningStreak:     number
  pendingAssignments: number
  unreadDiscussions:  number
}

export interface Notification {
  id:        string
  title:     string
  message:   string
  read:      boolean
  createdAt: string
  type:      'assignment' | 'discussion' | 'grade' | 'system'
}

// Fetch full profile
export async function getUserProfile(): Promise<User> {
  const { data } = await api.get('/auth/me')
  return data.data
}

// Fetch enrolled courses with progress
export async function getEnrolledCourses(): Promise<EnrolledCourse[]> {
  const { data } = await api.get('/courses/enrolled')
  return data.data
}

// Fetch dashboard stats
export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get('/analytics/dashboard')
  return data.data
}

// Fetch notifications
export async function getNotifications(): Promise<Notification[]> {
  const { data } = await api.get('/notifications')
  return data.data
}

// Mark notification as read
export async function markNotificationRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read`)
}