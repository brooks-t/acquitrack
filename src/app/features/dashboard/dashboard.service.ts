import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

// Dashboard Data Interfaces
export interface DashboardStats {
  myTasks: number;
  pendingApprovals: number;
  recentActivity: number;
  totalPurchaseRequests: number;
  totalVendors: number;
  monthlySpend: number;
}

export interface TaskItem {
  id: string;
  title: string;
  type: 'approval' | 'review' | 'action';
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  assignee?: string;
  description?: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
  type: 'created' | 'approved' | 'rejected' | 'updated';
  entity: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  // State signals
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  // Getters for reactive state
  isLoading = this._isLoading.asReadonly();
  error = this._error.asReadonly();

  /**
   * Get dashboard statistics
   */
  getDashboardStats(): Observable<DashboardStats> {
    this._isLoading.set(true);
    this._error.set(null);

    return of({
      myTasks: 12,
      pendingApprovals: 8,
      recentActivity: 24,
      totalPurchaseRequests: 156,
      totalVendors: 43,
      monthlySpend: 425600,
    }).pipe(
      delay(800) // Simulate network delay
    );
  }

  /**
   * Get current user's tasks
   */
  getMyTasks(): Observable<TaskItem[]> {
    this._isLoading.set(true);
    this._error.set(null);

    const mockTasks: TaskItem[] = [
      {
        id: '1',
        title: 'Review Office Supplies Purchase Request',
        type: 'approval',
        priority: 'high',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        assignee: 'John Doe',
        description:
          'Review and approve office supplies purchase request for Q4 2025',
      },
      {
        id: '2',
        title: 'Validate vendor information for ABC Corp',
        type: 'review',
        priority: 'medium',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        description: 'Complete vendor compliance review and documentation',
      },
      {
        id: '3',
        title: 'Complete Q3 procurement analysis',
        type: 'action',
        priority: 'low',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        description: 'Analyze Q3 procurement metrics and prepare report',
      },
      {
        id: '4',
        title: 'Approve IT Equipment solicitation',
        type: 'approval',
        priority: 'high',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        assignee: 'Sarah Johnson',
        description: 'Review and approve IT equipment procurement solicitation',
      },
      {
        id: '5',
        title: 'Update vendor contracts database',
        type: 'action',
        priority: 'medium',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        description: 'Update contract information in vendor management system',
      },
    ];

    return of(mockTasks).pipe(delay(600));
  }

  /**
   * Get recent activity feed
   */
  getRecentActivity(): Observable<ActivityItem[]> {
    this._isLoading.set(true);
    this._error.set(null);

    const mockActivity: ActivityItem[] = [
      {
        id: '1',
        action: 'approved',
        user: 'Sarah Johnson',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'approved',
        entity: 'PR-2024-001',
      },
      {
        id: '2',
        action: 'created',
        user: 'Mike Chen',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        type: 'created',
        entity: 'PR-2024-002',
      },
      {
        id: '3',
        action: 'updated',
        user: 'Lisa Wang',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        type: 'updated',
        entity: 'Vendor Profile',
      },
      {
        id: '4',
        action: 'rejected',
        user: 'David Smith',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        type: 'rejected',
        entity: 'PR-2024-003',
      },
      {
        id: '5',
        action: 'completed',
        user: 'Emily Davis',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        type: 'approved',
        entity: 'SOL-2024-005',
      },
      {
        id: '6',
        action: 'submitted',
        user: 'James Wilson',
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
        type: 'created',
        entity: 'PR-2024-006',
      },
    ];

    return of(mockActivity).pipe(delay(400));
  }

  /**
   * Clear any existing errors
   */
  clearError(): void {
    this._error.set(null);
  }

  /**
   * Set loading state manually (for external use)
   */
  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }
}
