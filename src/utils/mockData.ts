
// Mock data for development

export interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
  rollNumber: string;
  profileImage: string;
}

export interface Attendance {
  date: string;
  status: 'present' | 'absent' | 'late';
  reason?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  important: boolean;
  from: string;
}

export interface Message {
  id: string;
  from: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  category: 'academic' | 'cultural' | 'sports' | 'holiday' | 'exam' | 'meeting';
}

export interface Subject {
  id: string;
  name: string;
  teacher: string;
  grade: number;
  recentScore?: number;
  totalClasses: number;
  attendedClasses: number;
}

export interface Fee {
  id: string;
  type: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidOn?: string;
  receiptNo?: string;
}

export const studentData: Student = {
  id: "S12345",
  name: "Aanya Sharma",
  grade: "10",
  section: "A",
  rollNumber: "1032",
  profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop"
};

export const attendanceData: Attendance[] = [
  { date: "2023-06-01", status: "present" },
  { date: "2023-06-02", status: "present" },
  { date: "2023-06-03", status: "absent", reason: "Sick leave" },
  { date: "2023-06-04", status: "present" },
  { date: "2023-06-05", status: "late" },
  { date: "2023-06-06", status: "present" },
  { date: "2023-06-07", status: "present" },
];

export const announcementData: Announcement[] = [
  {
    id: "A1",
    title: "School Closed for Diwali",
    content: "The school will remain closed from 12th to 16th November for Diwali celebrations.",
    date: "2023-06-01T10:30:00",
    important: true,
    from: "Principal's Office"
  },
  {
    id: "A2",
    title: "Annual Sports Day",
    content: "Annual Sports Day will be held on 20th December. All parents are cordially invited.",
    date: "2023-06-02T14:15:00",
    important: false,
    from: "Sports Department"
  },
  {
    id: "A3",
    title: "Parent-Teacher Meeting",
    content: "The quarterly parent-teacher meeting is scheduled for 25th June from 9 AM to 1 PM.",
    date: "2023-06-03T09:00:00",
    important: true,
    from: "Academic Committee"
  }
];

export const messageData: Message[] = [
  {
    id: "M1",
    from: "Mrs. Patel (Mathematics)",
    subject: "Regarding Mathematics Homework",
    content: "Aanya has been performing exceptionally well in mathematics. However, she needs to work on her problem-solving speed. Please encourage her to practice more problems at home.",
    date: "2023-06-02T14:30:00",
    read: true,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop"
  },
  {
    id: "M2",
    from: "Mr. Kumar (Physics)",
    subject: "Science Project Completion",
    content: "This is a reminder that the science project on 'Renewable Energy' is due next Monday. Aanya has completed about 70% of the project and should focus on the conclusion part.",
    date: "2023-06-03T10:15:00",
    read: false,
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop"
  },
  {
    id: "M3",
    from: "School Admin",
    subject: "Fee Reminder",
    content: "This is a gentle reminder that the second term fees are due by 15th June. Please make the payment to avoid late fees.",
    date: "2023-06-04T09:00:00",
    read: false
  }
];

export const eventData: Event[] = [
  {
    id: "E1",
    title: "Annual Day Rehearsal",
    date: "2023-06-10",
    time: "14:00 - 16:00",
    location: "School Auditorium",
    description: "Compulsory rehearsal for all students participating in the Annual Day program.",
    category: "cultural"
  },
  {
    id: "E2",
    title: "Mathematics Quiz",
    date: "2023-06-15",
    time: "10:00 - 12:00",
    location: "Mathematics Lab",
    description: "Inter-house mathematics quiz competition for grades 9 and 10.",
    category: "academic"
  },
  {
    id: "E3",
    title: "Parent-Teacher Meeting",
    date: "2023-06-25",
    time: "09:00 - 13:00",
    location: "Respective Classrooms",
    description: "Quarterly review of student performance with parents.",
    category: "meeting"
  },
  {
    id: "E4",
    title: "Summer Vacation Begins",
    date: "2023-06-30",
    category: "holiday"
  }
];

export const subjectData: Subject[] = [
  {
    id: "SUB1",
    name: "Mathematics",
    teacher: "Mrs. Patel",
    grade: 85,
    recentScore: 92,
    totalClasses: 24,
    attendedClasses: 23
  },
  {
    id: "SUB2",
    name: "Physics",
    teacher: "Mr. Kumar",
    grade: 78,
    recentScore: 75,
    totalClasses: 20,
    attendedClasses: 18
  },
  {
    id: "SUB3",
    name: "Chemistry",
    teacher: "Mrs. Joshi",
    grade: 82,
    recentScore: 88,
    totalClasses: 20,
    attendedClasses: 19
  },
  {
    id: "SUB4",
    name: "English",
    teacher: "Mr. Sharma",
    grade: 90,
    recentScore: 85,
    totalClasses: 16,
    attendedClasses: 16
  },
  {
    id: "SUB5",
    name: "Hindi",
    teacher: "Mrs. Reddy",
    grade: 88,
    recentScore: 90,
    totalClasses: 16,
    attendedClasses: 15
  }
];

export const feeData: Fee[] = [
  {
    id: "F1",
    type: "Tuition Fee (April-June)",
    amount: 25000,
    dueDate: "2023-04-15",
    status: "paid",
    paidOn: "2023-04-10",
    receiptNo: "REC23001"
  },
  {
    id: "F2",
    type: "Computer Lab Fee",
    amount: 5000,
    dueDate: "2023-04-15",
    status: "paid",
    paidOn: "2023-04-10",
    receiptNo: "REC23002"
  },
  {
    id: "F3",
    type: "Tuition Fee (July-September)",
    amount: 25000,
    dueDate: "2023-07-15",
    status: "pending"
  },
  {
    id: "F4",
    type: "Annual Sports Fee",
    amount: 3000,
    dueDate: "2023-06-30",
    status: "overdue"
  }
];
