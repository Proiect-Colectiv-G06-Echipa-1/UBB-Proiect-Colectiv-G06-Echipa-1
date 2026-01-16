import {useEffect, useState} from 'react';
import {StatusDropdown} from '../components/Generic/StatusDropdown';
import {Typography, Box} from '@mui/material';
import {taskApi, userApi} from '../api/api';
import {
    type UserDTO,
    type TaskDTO,
    TaskDTOStatusEnum,
    type GetTasksAssignedToUserRequest,
    type UnassignTaskFromUser1Request
} from '../../typescript-client';
import {toast} from 'react-toastify';
import PermanentDrawerLeft, {type DrawerItem} from '../components/Generic/PermanentDrawer';
import UserIcon from '../assets/drawer-image.png';
import UserManagementIcon from '../assets/group 1.png';
import StatisticsIcon from '../assets/bar-chart 1.png';
import UnAssignIcon from '../assets/remove-user 1.png';
import {QuestCard} from '../components/QuestCard';
import {formatDate} from '../lib/date';
import {TasksChart} from '../components/AdminPanel/TasksChart';
import {unAssignableCategories} from '../lib/status';
import {fontFamilyStyle} from '../lib/style';

export const AdminPanel = () => {
    const [drawerItems, setDrawerItems] = useState<DrawerItem[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [currentUserData, setCurrentUserData] = useState<UserDTO | undefined>(undefined);
    const [averageEnergy, setAverageEnergy] = useState<number | undefined>(undefined);
    const [selected, setSelected] = useState<TaskDTOStatusEnum>(TaskDTOStatusEnum.InProgress);

    const [selectedUserTasks, setSelectedUserTasks] = useState<TaskDTO[]>([]);

    const [blockedTasks, setBlockedTasks] = useState<number>(0);
    const [totalTasks, setTotalTasks] = useState<number>(0);

    const [userCompletedTasks, setUserCompletedTasks] = useState<number>(0);
    const [userTotalTasks, setUserTotalTasks] = useState<number>(0);

    const handleSelect = (status: TaskDTOStatusEnum) => {
        setSelected(status);
    };

    const onItemClick = (item: DrawerItem) => {
        const id = Number(item.id);

        if (isNaN(id)) {
            setUserId(null);
            return;
        }
        setUserId(id);
    }

    const onUnassignTask = async (taskId: number) => {
        try {
            const request: UnassignTaskFromUser1Request = {
                taskId: taskId,
                userId: userId!,
            }

            await taskApi.unassignTaskFromUser1(request)

            const updatedTasks = selectedUserTasks.filter(task => task.id !== taskId);
            setSelectedUserTasks(updatedTasks);

            toast.success('Task unassigned successfully.', {containerId: 'global-toast'});
        } catch (error) {
            toast.error('An error occurred while unassigning the task.', {containerId: 'global-toast'});
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // I don't know why it's generated as getAll1
                // NOTE(MC): Even the OpenAPI generator is vibecoded I cannot 😭
                const users = await userApi.getAll1();
                const totalEnergy = users.reduce((acc, user) => acc + user.energy!, 0);
                setAverageEnergy(totalEnergy / users.length);

                const drawerItems: DrawerItem[] = users
                    .filter(user => user.id != null && user.username != null)
                    .map((user) => ({
                        id: user.id!,
                        text: user.username!,
                        icon: <img src={UserIcon} alt="User Icon"/>,
                    }));

                setDrawerItems(drawerItems);
            } catch (error) {
                toast.error('An error occurred while fetching users.', {containerId: 'global-toast'});
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchUserTasks = async () => {
            try {
                if (userId === null) {
                    setSelectedUserTasks([]);
                    return;
                }

                const request: GetTasksAssignedToUserRequest = {
                    userId: userId,
                    status: selected,
                }

                const userTasks = await taskApi.getTasksAssignedToUser(request);
                setCurrentUserData(await userApi.getUserData({id: userId}));

                setSelectedUserTasks(userTasks);
            } catch (error) {
                toast.error('An error occurred while fetching user tasks.', {containerId: 'global-toast'});
            }
        }
        fetchUserTasks();
    }, [userId, selected]);

    useEffect(() => {
        const fetchBlockedTasksStatistics = async () => {
            try {
                const blockedTasks = await taskApi.getBlockedTaskCount();
                const totalTasks = await taskApi.getTotalCount();

                setBlockedTasks(blockedTasks);
                setTotalTasks(totalTasks);

                console.log(blockedTasks, totalTasks);
            } catch (error) {
                toast.error('An error occurred while fetching blocked tasks statistics.', {containerId: 'global-toast'});
            }
        }
        fetchBlockedTasksStatistics();

        const interval = setInterval(fetchBlockedTasksStatistics, 300000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchUserCompletedTasksStatistics = async () => {
            try {
                if (userId === null) {
                    return;
                }

                const request: GetTasksAssignedToUserRequest = {
                    userId: userId,
                    status: TaskDTOStatusEnum.Backlog,
                }

                // TODO: Change this to 2 calls at most when backend has a proper endpoints
                const tasksInBacklog = await taskApi.getTasksAssignedToUser(request);

                request.status = TaskDTOStatusEnum.InProgress;

                const tasksInProgress = await taskApi.getTasksAssignedToUser(request);

                request.status = TaskDTOStatusEnum.OnHold;

                const tasksOnHold = await taskApi.getTasksAssignedToUser(request);

                request.status = TaskDTOStatusEnum.Completed;

                const completedTasks = await taskApi.getTasksAssignedToUser(request);

                setUserCompletedTasks(completedTasks.length);
                setUserTotalTasks(tasksInBacklog.length + tasksInProgress.length + tasksOnHold.length + completedTasks.length);
            } catch (error) {
                toast.error('An error occurred while fetching user completed tasks statistics.', {containerId: 'global-toast'});
            }
        }
        fetchUserCompletedTasksStatistics();

        const interval = setInterval(fetchUserCompletedTasksStatistics, 300000);

        return () => clearInterval(interval);
    }, [userId]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 'var(--navbar-height)',
            height: 'calc(100vh - var(--navbar-height))',
            width: '100vw',
            bgcolor: '#A8B1FF',
            m: 0,
            p: 0
        }}>
            <Box sx={{display: 'flex', flex: 1, overflow: 'hidden'}}>
                <PermanentDrawerLeft items={drawerItems} onItemClick={onItemClick} selectedItemId={userId}>
                    <Box sx={{display: 'flex', bgcolor: '#A8B1FF', flex: 1, height: '100%'}}>
                        <Box sx={{display: 'flex', flexDirection: 'column', flex: 1, padding: '24px 24px 24px 24px'}}>
                            {/* Energy Level Container */}
                            {currentUserData && <Box
                                sx={{
                                    bgcolor: '#fff',
                                    borderRadius: 3,
                                    padding: 2,
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                    alignSelf: 'center',
                                    width: '75%',
                                }}
                            >
                                {/* Header */}
                                <Box
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 500,
                                        mb: 1,
                                    }}
                                >
                                    <Typography sx={[fontFamilyStyle, {
                                        fontWeight: 200,
                                        fontSize: '28px',
                                        color: '#111',
                                        lineHeight: 1
                                    }]}>
                                        Current Energy Level Of{' '}
                                        <Typography component='span' sx={[fontFamilyStyle, {
                                            fontWeight: 700,
                                            fontSize: '28px',
                                        }]}>
                                            {currentUserData.username}
                                        </Typography>
                                    </Typography>
                                </Box>

                                {/* Energy Level */}
                                <Box
                                    role="meter"
                                    aria-valuemin={0}
                                    aria-valuemax={10}
                                    aria-valuenow={4}
                                    sx={{
                                        display: 'flex',
                                        height: 32,
                                        borderRadius: '14px',
                                        padding: 0,
                                        bgcolor: 'transparent',
                                        overflow: 'hidden',
                                        minWidth: 220,
                                        border: '1px solid #000',
                                        position: 'relative',
                                    }}
                                >
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <Box
                                            component="span"
                                            key={i}
                                            sx={{
                                                flex: 1,
                                                height: '100%',
                                                bgcolor: i < currentUserData.energy! ? '#05f90d' : '#fff',
                                                boxSizing: 'border-box',
                                                borderRight: i === 9 ? 'none' : '1px solid #000',
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>}

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 3,
                                gap: 4,
                                flexShrink: 0
                            }}>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0 16px'}}>
                                    <img src={UserManagementIcon} alt="User Management Icon"/>
                                    <Typography variant="h5" sx={[fontFamilyStyle, {
                                        fontWeight: 400,
                                        fontSize: '36px',
                                        color: '#111',
                                        lineHeight: 1
                                    }]}>
                                        Users Management
                                    </Typography>
                                </Box>
                                <StatusDropdown categories={unAssignableCategories} selected={selected}
                                                handleSelect={handleSelect}/>
                            </Box>
                            <Box sx={{flex: 1, overflowY: 'auto'}}>
                                {/* Card Grid */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-between',
                                        rowGap: '16px',
                                        marginTop: '16px',
                                        width: '100%',
                                    }}
                                >
                                    {selectedUserTasks.map((item) => (
                                        <QuestCard
                                            key={item.id}
                                            id={item.id || 0}
                                            title={item?.title || ''}
                                            created={formatDate(item?.creationDate || new Date())}
                                            deadline={formatDate(item?.deadline || new Date())}
                                            width='320px'
                                            count={item?.energyCost || 0}
                                            onClick={onUnassignTask}
                                            image={UnAssignIcon}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{width: '3px', bgcolor: '#000000', flexShrink: 0, height: '100%'}}/>

                        <Box sx={{display: 'flex', flexDirection: 'column', flex: 1, padding: '24px 24px 24px 24px'}}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                margin: '8px 0 16px',
                                mb: 3,
                                flexShrink: 0
                            }}>
                                <img src={StatisticsIcon} alt="Statistics Icon"/>
                                <Typography variant="h5" sx={[fontFamilyStyle, {
                                    fontWeight: 400,
                                    fontSize: '36px',
                                    color: '#111',
                                    lineHeight: 1
                                }]}>
                                    Statistics
                                </Typography>
                            </Box>
                            <Box sx={{flex: 1, gap: 3, display: 'flex', flexDirection: 'column'}}>
                                <TasksChart mainStatistic={blockedTasks} comparedStatistic={totalTasks - blockedTasks}
                                            mainLabel="Blocked" comparedLabel="Not Blocked" title="Blocked Tasks"/>
                                {currentUserData && <TasksChart mainStatistic={currentUserData.energy!} comparedStatistic={averageEnergy!}
                                            mainLabel={currentUserData.username + "'s Energy"} comparedLabel="Average Energy" title={currentUserData.username + "'s Energy Relative To The Team"}/>}
                                {userId && <TasksChart mainStatistic={userCompletedTasks}
                                                       comparedStatistic={userTotalTasks - userCompletedTasks}
                                                       mainLabel="Completed" comparedLabel="Not Completed"
                                                       title="Completed Tasks per User"/>}
                            </Box>
                        </Box>

                    </Box>
                </PermanentDrawerLeft>
            </Box>
        </Box>
    );
};