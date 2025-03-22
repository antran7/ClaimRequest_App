export interface Feedback {
  id?: string;
  userId: string;
  userName: string;
  email: string;
  subject: string;
  message: string;
  rating: number;
  createdAt?: Date;
  status?: 'pending' | 'reviewed' | 'resolved';
}

export interface FeedbackFormData {
  subject: string;
  message: string;
  rating: number;
} 