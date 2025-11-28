import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Card } from '@mui/material';
import { taskApi } from '../../api/api';
import type { TaskDTO } from '../../../typescript-client';
import { toast } from 'react-toastify';

interface UserCompletedTasks {
  userId: number;
  username: string;
  completedCount: number;
}

export const CompletedTasksPerUser = () => {
  const [userData, setUserData] = useState<UserCompletedTasks[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get all tasks to extract unique user IDs
        const allTasks = await taskApi.getAll();
        
        // Extract unique user IDs from assignees
        const userIds = new Set<number>();
        allTasks.forEach(task => {
          if (task.assignees) {
            task.assignees.forEach(userId => {
              userIds.add(Number(userId));
            });
          }
        });

        // For each user, get completed tasks count
        const userCompletedTasks: UserCompletedTasks[] = [];
        
        for (const userId of userIds) {
          try {
            const completedTasksResponse = await fetch(`http://localhost:8080/tasks/user/${userId}/completed`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt') || ''}`,
              },
            });
            
            if (completedTasksResponse.ok) {
              const completedTasks: TaskDTO[] = await completedTasksResponse.json();
              
              // Get username from backend
              let username = `User ${userId}`;
              try {
                const usernameResponse = await fetch(`http://localhost:8080/api/auth/user/${userId}/username`, {
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt') || ''}`,
                  },
                });
                
                if (usernameResponse.ok) {
                  username = await usernameResponse.json();
                }
              } catch (error) {
                console.error(`Failed to load username for user ${userId}:`, error);
              }
              
              userCompletedTasks.push({
                userId: userId,
                username: username,
                completedCount: completedTasks.length,
              });
            }
          } catch (error) {
            // Skip users that fail to load
            console.error(`Failed to load completed tasks for user ${userId}:`, error);
          }
        }

        // Sort by completed count descending
        userCompletedTasks.sort((a, b) => b.completedCount - a.completedCount);
        
        setUserData(userCompletedTasks);
      } catch (error) {
        toast.error('Failed to load completed tasks data.', { containerId: 'global-toast' });
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
          mb: 3,
        }}
      >
        Completed Tasks per User
      </Typography>
      
      {userData.length === 0 ? (
        <Typography
          sx={{
            fontSize: '14px',
            color: '#666',
            textAlign: 'center',
            py: 4,
          }}
        >
          No users with completed tasks found.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {userData.map((user) => (
            <Card
              key={user.userId}
              elevation={0}
              sx={{
                bgcolor: '#f5f5f5',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #e0e0e0',
              }}
            >
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#111',
                }}
              >
                {user.username}
              </Typography>
              <Box
                sx={{
                  bgcolor: '#6F6471',
                  color: '#fff',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '16px',
                  fontWeight: 700,
                  minWidth: '60px',
                  textAlign: 'center',
                }}
              >
                {user.completedCount}
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

