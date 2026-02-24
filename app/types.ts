export type BaseCourseRow = {
  subjectArea: string;
  courseTitle: string;
  catalogNumber: string;
};

export type CourseRow = BaseCourseRow & {
  enrollmentTerm: string;
  sectionNumber: string;
  gradeOffered: string;
  gradeCount: string;
  enrollmentTotal: string;
  instructorName: string;
};

export type CourseRanking = {
  subjectArea: string;
  catalogNumber: string;
  courseTitle: string;
  enrollmentTerm: string;
  totalStudents: number;
  aCount: number;
  percentA: number;
  instructors: string[];
  catalogNumberNumeric: number;
};
