
import { useState } from "react";
import { Award, BarChart3, Download, FileCog } from "lucide-react";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { studentData, subjectData } from "../utils/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExamType {
  id: string;
  name: string;
}

interface ResultData {
  examId: string;
  totalMarks: number;
  percentage: number;
  grade: string;
  subjects: {
    name: string;
    marks: number;
    maxMarks: number;
    grade: string;
  }[];
}

// Mock exam types
const examTypes: ExamType[] = [
  { id: "midterm1", name: "Mid Term 1 (July)" },
  { id: "midterm2", name: "Mid Term 2 (October)" },
  { id: "finalterm", name: "Final Term (March)" },
];

// Mock results data
const resultsData: Record<string, ResultData> = {
  midterm1: {
    examId: "midterm1",
    totalMarks: 435,
    percentage: 87,
    grade: "A",
    subjects: [
      { name: "Mathematics", marks: 90, maxMarks: 100, grade: "A+" },
      { name: "Physics", marks: 85, maxMarks: 100, grade: "A" },
      { name: "Chemistry", marks: 88, maxMarks: 100, grade: "A" },
      { name: "English", marks: 92, maxMarks: 100, grade: "A+" },
      { name: "Hindi", marks: 80, maxMarks: 100, grade: "A" },
    ],
  },
  midterm2: {
    examId: "midterm2",
    totalMarks: 445,
    percentage: 89,
    grade: "A",
    subjects: [
      { name: "Mathematics", marks: 92, maxMarks: 100, grade: "A+" },
      { name: "Physics", marks: 87, maxMarks: 100, grade: "A" },
      { name: "Chemistry", marks: 89, maxMarks: 100, grade: "A" },
      { name: "English", marks: 95, maxMarks: 100, grade: "A+" },
      { name: "Hindi", marks: 82, maxMarks: 100, grade: "A" },
    ],
  },
  finalterm: {
    examId: "finalterm",
    totalMarks: 455,
    percentage: 91,
    grade: "A+",
    subjects: [
      { name: "Mathematics", marks: 95, maxMarks: 100, grade: "A+" },
      { name: "Physics", marks: 89, maxMarks: 100, grade: "A" },
      { name: "Chemistry", marks: 92, maxMarks: 100, grade: "A+" },
      { name: "English", marks: 96, maxMarks: 100, grade: "A+" },
      { name: "Hindi", marks: 83, maxMarks: 100, grade: "A" },
    ],
  },
};

const gradeColors: Record<string, string> = {
  "A+": "text-green-600 bg-green-50",
  "A": "text-green-600 bg-green-50",
  "B+": "text-blue-600 bg-blue-50",
  "B": "text-blue-600 bg-blue-50",
  "C+": "text-yellow-600 bg-yellow-50",
  "C": "text-yellow-600 bg-yellow-50",
  "D": "text-orange-600 bg-orange-50",
  "F": "text-red-600 bg-red-50",
};

const Results = () => {
  const [selectedExam, setSelectedExam] = useState<string>("finalterm");
  const result = resultsData[selectedExam];

  return (
    <Layout title="Exam Results">
      <div className="space-y-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-xl font-semibold">Exam Results</CardTitle>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="text-sm text-muted-foreground">
                  {studentData.name} • Class {studentData.grade}-{studentData.section}
                </div>
                <Select
                  value={selectedExam}
                  onValueChange={setSelectedExam}
                >
                  <SelectTrigger className="h-8 w-[180px]">
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {examTypes.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Percentage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{result.percentage}%</div>
                  <p className="text-xs text-muted-foreground">Total: {result.totalMarks}/500</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{result.grade}</div>
                  <p className="text-xs text-muted-foreground">
                    {result.grade === "A+" 
                      ? "Outstanding Performance" 
                      : result.grade === "A" 
                      ? "Excellent Performance" 
                      : "Good Performance"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Download</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Get Result Card</div>
                  <p className="text-xs text-muted-foreground">PDF format</p>
                </div>
                <Button size="sm" variant="secondary">
                  <Download className="mr-1 h-3 w-3" />
                  PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="marksheet" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="marksheet">Subject Marks</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="marksheet" className="mt-4">
            <Card className="border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right">Marks</TableHead>
                    <TableHead className="text-right">Max Marks</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                    <TableHead className="text-right">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.subjects.map((subject) => (
                    <TableRow key={subject.name}>
                      <TableCell className="font-medium">{subject.name}</TableCell>
                      <TableCell className="text-right">{subject.marks}</TableCell>
                      <TableCell className="text-right">{subject.maxMarks}</TableCell>
                      <TableCell className="text-right">
                        {Math.round((subject.marks / subject.maxMarks) * 100)}%
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${gradeColors[subject.grade]}`}>
                          {subject.grade}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          
          <TabsContent value="progress" className="mt-4">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Progress Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.subjects.map((subject) => (
                    <div key={subject.name} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{subject.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {subject.marks}/{subject.maxMarks}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
                        <div 
                          className="h-full bg-primary transition-all" 
                          style={{ width: `${(subject.marks / subject.maxMarks) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-center">
          <Button variant="outline" className="w-full sm:w-auto">
            <FileCog className="mr-2 h-4 w-4" />
            View All Academic Records
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Results;
