import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Box, Typography, CircularProgress } from '@mui/material';
import { taskApi } from '../../api/api';
import { toast } from 'react-toastify';

interface BlockedTasksData {
  name: string;
  value: number;
}

const COLORS = ['#6F6471', '#A8B1FF'];

export const BlockedTasksChart = () => {
  const [data, setData] = useState<BlockedTasksData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get blocked tasks count
        const blockedCountResponse = await fetch('http://localhost:8080/tasks/count-blocked', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt') || ''}`,
          },
        });
        const blockedCount: number = await blockedCountResponse.json();

        // Get total tasks count
        const totalCountResponse = await fetch('http://localhost:8080/tasks/count', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt') || ''}`,
          },
        });
        const totalCount: number = await totalCountResponse.json();

        const notBlockedCount = totalCount - blockedCount;
        setTotalTasks(totalCount);

        setData([
          { name: 'Blocked', value: blockedCount },
          { name: 'Not Blocked', value: notBlockedCount },
        ]);
      } catch (error) {
        toast.error('Failed to load blocked tasks data.', { containerId: 'global-toast' });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

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
        sx={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#111',
          mb: 2,
        }}
      >
        Task Blocking Status
      </Typography>
      <Typography
        sx={{
          fontSize: '14px',
          color: '#666',
          mb: 3,
        }}
      >
        Total Tasks: {totalTasks}
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

