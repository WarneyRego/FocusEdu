export interface User {
  id: string;
  email: string;
}

export interface StudyPlan {
  id: string;
  user_id: string;
  subjects: string[];
  hours_per_day: number;
  schedule: StudySchedule[];
  created_at: string;
}

export interface StudySchedule {
  subject: string;
  duration: string;
  focus: string;
}