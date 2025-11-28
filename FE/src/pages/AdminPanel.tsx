import { useEffect, useState } from 'react';
import { TopNav } from '../components/TopNav';
import { StatusDropdown } from '../components/Generic/StatusDropdown';
import { QuestCard } from '../components/QuestCard';
import { BlockedTasksChart } from '../components/AdminPanel/BlockedTasksChart';
import { CompletedTasksPerUser } from '../components/AdminPanel/CompletedTasksPerUser';
import { Typography, Box } from '@mui/material';
import { taskApi } from '../api/api';
import { TaskDTOStatusEnum, type TaskDTO } from '../../typescript-client';
import { formatDate } from '../lib/date';
import { formatStatus } from '../lib/status';
import { toast } from 'react-toastify';

export const AdminPanel = () => {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [selected, setSelected] = useState<TaskDTOStatusEnum>(TaskDTOStatusEnum.Backlog);
  const [energyLevel, setEnergyLevel] = useState(6);

  const handleSelect = (status: TaskDTOStatusEnum) => {
    setSelected(status);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const tasks = await taskApi.getAll();

        if (!tasks) {
          toast.error('Failed to load tasks.', { containerId: 'global-toast' });
          return;
        }
        setTasks(tasks);
      } catch (error) {
        toast.error('An error occurred while loading tasks.', { containerId: 'global-toast' });
      }
    };
    load();
  }, []);

  const filteredTasks = tasks.filter(task => task.status === selected);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        bgcolor: '#fff',
        m: 0,
        p: 0,
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <TopNav
        energyLevel={energyLevel}
        onDecrease={() => setEnergyLevel(prev => Math.max(0, prev - 1))}
        onIncrease={() => setEnergyLevel(prev => Math.min(10, prev + 1))}
      />
      <Box
        sx={{
          position: 'relative',
          bgcolor: '#A8B1FF',
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: '8px 0 16px',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Nanum Pen Script', cursive",
                fontWeight: 400,
                fontSize: '36px',
                color: '#111',
                lineHeight: 1,
              }}
            >
              Admin Panel
            </Typography>
          </Box>
          <StatusDropdown selected={selected} handleSelect={handleSelect} />
        </Box>

        {/* Dashboard Section */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: '24px',
            mb: 4,
          }}
        >
          <BlockedTasksChart />
          <CompletedTasksPerUser />
        </Box>

        {/* Tasks Section Header */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#111',
              mb: 1,
            }}
          >
            Tasks by Status
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              color: '#111',
              fontWeight: 600,
            }}
          >
            Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} with status: {formatStatus(selected)}
          </Typography>
        </Box>

        {/* Card Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginTop: '16px',
            width: '100%',
            justifyItems: 'start',
            '& > :nth-of-type(3n+2)': {
              justifySelf: 'center',
            },
            '& > :nth-of-type(3n)': {
              justifySelf: 'end',
            },
          }}
        >
          {filteredTasks.map((task) => (
            <QuestCard
              key={task.id}
              id={task.id || 0}
              title={task?.title || ''}
              created={formatDate(task?.creationDate || new Date())}
              deadline={formatDate(task?.deadline || new Date())}
              count={task?.energyCost || 0}
            />
          ))}
        </Box>

        {filteredTasks.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px',
            }}
          >
            <Typography
              sx={{
                fontSize: '18px',
                color: '#666',
                fontWeight: 500,
              }}
            >
              No tasks found with status: {formatStatus(selected)}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

