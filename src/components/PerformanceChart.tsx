
import { Subject } from '../utils/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PerformanceChartProps {
  subjects: Subject[];
}

const PerformanceChart = ({ subjects }: PerformanceChartProps) => {
  // Format data for the chart
  const data = subjects.map((subject) => ({
    name: subject.name,
    grade: subject.grade,
    recentScore: subject.recentScore,
  }));

  // Average of all grades
  const averageGrade = Math.round(
    subjects.reduce((sum, subject) => sum + subject.grade, 0) / subjects.length
  );

  // Calculate attendance percentage for all subjects
  const overallAttendance = Math.round(
    (subjects.reduce((sum, subject) => sum + subject.attendedClasses, 0) /
      subjects.reduce((sum, subject) => sum + subject.totalClasses, 0)) *
      100
  );

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border text-sm">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p>Overall: <span className="font-semibold">{payload[0].value}%</span></p>
          {payload[1] && (
            <p>Recent: <span className="font-semibold">{payload[1].value}%</span></p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl card-shadow p-5 border animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">Academic Performance</h3>
          <p className="text-sm text-muted-foreground">Subject-wise scores</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Average</p>
            <p className="font-semibold text-lg">{averageGrade}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Attendance</p>
            <p className="font-semibold text-lg">{overallAttendance}%</p>
          </div>
        </div>
      </div>

      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            barGap={2}
          >
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.substring(0, 3)}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              domain={[0, 100]}
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0.2 }} />
            <Bar dataKey="grade" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fillOpacity={0.8} />
              ))}
            </Bar>
            <Bar dataKey="recentScore" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center mt-2 space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
          <span className="text-xs text-muted-foreground">Overall</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
          <span className="text-xs text-muted-foreground">Recent</span>
        </div>
      </div>
      
      <button className="w-full mt-4 text-center text-sm text-primary font-medium py-2 hover:underline">
        View Detailed Report
      </button>
    </div>
  );
};

export default PerformanceChart;
