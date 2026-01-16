import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Box, Typography } from '@mui/material';
import { fontFamilyStyle } from '../../lib/style';

interface ChartData {
  name: string;
  value: number;
}

interface TasksChartProps {
  title: string;
  mainStatistic: number;
  comparedStatistic: number;
  mainLabel: string;
  comparedLabel: string;
}

const COLORS = ['#FFD46A', '#5A6BFF'];

export const TasksChart = (props: TasksChartProps) => {
  const { mainStatistic: firstCount, comparedStatistic: secondCount, mainLabel: firstLabel, comparedLabel: secondLabel, title } = props;

  const data: ChartData[] = [
    { name: firstLabel, value: firstCount },
    { name: secondLabel, value: secondCount },
  ];

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 0 #cfc7d8',
      }}
    >
      <Typography
        variant="h6"
        sx={[fontFamilyStyle, 
        {
          fontSize: '36px',
          fontWeight: 700,
          color: '#111',
          mb: 2,
        }]}
      >
        {title} : {firstCount}
      </Typography>
      <ResponsiveContainer width="100%" height={245}>
        <PieChart style={fontFamilyStyle}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            fontSize={30}
            color="#000"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
           <Tooltip contentStyle={{ color: '#000', fontSize: '30px' }} itemStyle={{ color: '#000', fontSize: '30px' }} />
          <Legend formatter={(value: any) => <span style={{ color: '#000', fontSize: 30 }}>{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};