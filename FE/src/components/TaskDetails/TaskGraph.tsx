import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Box, CircularProgress, Typography } from '@mui/material';
import type { TaskDTO } from '../../../typescript-client';
import { taskApi } from '../../api/api';
import { toast } from 'react-toastify';

interface GraphNode {
    id: number;
    title: string;
    description: string;
    createdDate?: Date;
    deadline?: Date;
    isCurrent: boolean;
    status?: string;
    level: number;
    fx?: number;
    fy?: number;
}

interface GraphLink {
    source: number;
    target: number;
}

interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

interface TaskGraphProps {
    currentTaskId: number;
}

export interface TaskGraphRef {
    regenerateGraph: () => void;
}

const TaskGraph = forwardRef<TaskGraphRef, TaskGraphProps>(({ currentTaskId }, ref) => {
    const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
    const [loading, setLoading] = useState(true);
    const graphRef = useRef<any>(null);

    const loadGraph = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchAllRelatedTasks(currentTaskId);
            setGraphData(data);
        } catch (error) {
            toast.error('Failed to load task dependencies', { containerId: 'global-toast' });
        } finally {
            setLoading(false);
        }
    }, [currentTaskId]);

    useImperativeHandle(ref, () => ({
        regenerateGraph: () => {
            loadGraph();
        }
    }), [loadGraph]);

    // Recursively fetch all dependencies (parents) and dependees (children)
    const fetchAllRelatedTasks = useCallback(async (rootTaskId: number) => {
        const visitedTasks = new Set<number>();
        const tasksMap = new Map<number, TaskDTO>();
        const taskLevels = new Map<number, number>(); // Track level of each task
        const links: GraphLink[] = [];

        // Fetch all tasks to find children efficiently
        let allTasks: TaskDTO[] = [];
        try {
            allTasks = await taskApi.getAll();
        } catch (error) {
            console.error('Failed to fetch all tasks:', error);
            return { nodes: [], links: [] };
        }

        // Create a map for quick lookup
        const allTasksMap = new Map<number, TaskDTO>();
        allTasks.forEach(task => {
            if (task.id !== undefined) {
                allTasksMap.set(task.id, task);
            }
        });

        // Helper function to find children of a task
        const findChildren = (taskId: number): number[] => {
            const children: number[] = [];
            allTasks.forEach(task => {
                if (task.parents && task.parents.has(taskId) && task.id !== undefined) {
                    children.push(task.id);
                }
            });
            return children;
        };

        // BFS to traverse the dependency graph (both backward to parents and forward to children)
        const queue: { taskId: number; level: number }[] = [{ taskId: rootTaskId, level: 0 }];

        while (queue.length > 0) {
            const { taskId, level } = queue.shift()!;

            if (visitedTasks.has(taskId)) {
                continue;
            }

            visitedTasks.add(taskId);
            taskLevels.set(taskId, level);
            const task = allTasksMap.get(taskId);

            if (!task) {
                continue;
            }

            tasksMap.set(taskId, task);

            // Add parent dependencies (backward - tasks that this task depends on)
            if (task.parents && task.parents.size > 0) {
                task.parents.forEach((parentId) => {
                    links.push({
                        source: parentId,
                        target: taskId,
                    });

                    if (!visitedTasks.has(parentId)) {
                        queue.push({ taskId: parentId, level: level - 1 });
                    }
                });
            }

            // Add children (forward - tasks that depend on this task)
            const children = findChildren(taskId);
            children.forEach((childId) => {
                links.push({
                    source: taskId,
                    target: childId,
                });

                if (!visitedTasks.has(childId)) {
                    queue.push({ taskId: childId, level: level + 1 });
                }
            });
        }

        // Group nodes by level
        const nodesByLevel = new Map<number, Array<{ id: number; task: TaskDTO }>>();
        tasksMap.forEach((task, id) => {
            const level = taskLevels.get(id) || 0;
            if (!nodesByLevel.has(level)) {
                nodesByLevel.set(level, []);
            }
            nodesByLevel.get(level)!.push({ id, task });
        });

        // Convert to graph data with level-based positioning
        const nodes: GraphNode[] = [];
        nodesByLevel.forEach((levelNodes, level) => {
            const numNodesInLevel = levelNodes.length;
            const spacing = 150;
            
            levelNodes.forEach((nodeData, indexInLevel) => {
                // Center nodes around y=0, spreading them symmetrically
                const yOffset = (indexInLevel - (numNodesInLevel - 1) / 2) * spacing;
                
                nodes.push({
                    id: nodeData.id,
                    title: nodeData.task.title || 'Untitled',
                    description: nodeData.task.description || '',
                    createdDate: nodeData.task.creationDate,
                    deadline: nodeData.task.deadline,
                    isCurrent: nodeData.id === rootTaskId,
                    status: nodeData.task.status,
                    level: level,
                    // Set initial positioning based on level
                    fx: undefined, // Let DAG mode handle x positioning
                    fy: yOffset, // Center nodes vertically around parent
                });
            });
        });

        return { nodes, links };
    }, [currentTaskId]);

    useEffect(() => {
        loadGraph();
    }, [loadGraph]);

    // Auto-zoom to fit graph on mount
    useEffect(() => {
        if (graphRef.current && graphData.nodes.length > 0) {
            setTimeout(() => {
                graphRef.current?.zoomToFit(400, 50);
            }, 100);
        }
    }, [graphData]);

    const nodeCanvasObject = (node: any, ctx: CanvasRenderingContext2D) => {
        const fontSize = 12;
        const padding = 12;
        const cardWidth = 180;
        const cardHeight = 80;
        const circleRadius = 18;
        const isCompleted = node.status === 'COMPLETED';
        
        // Card position
        const x = node.x - cardWidth / 2;
        const y = node.y - cardHeight / 2;
        const radius = 12;

        // Draw card background
        ctx.fillStyle = isCompleted ? '#D4EDDA' : '#FFFFFF';
        ctx.strokeStyle = node.isCurrent ? '#000000' : (isCompleted ? '#28A745' : 'transparent');
        ctx.lineWidth = 2;

        // Draw rounded rectangle for card
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + cardWidth - radius, y);
        ctx.quadraticCurveTo(x + cardWidth, y, x + cardWidth, y + radius);
        ctx.lineTo(x + cardWidth, y + cardHeight - radius);
        ctx.quadraticCurveTo(x + cardWidth, y + cardHeight, x + cardWidth - radius, y + cardHeight);
        ctx.lineTo(x + radius, y + cardHeight);
        ctx.quadraticCurveTo(x, y + cardHeight, x, y + cardHeight - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        
        // Add shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        
        ctx.fill();
        if (node.isCurrent) {
            ctx.stroke();
        }
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw ID circle
        const circleX = x + padding + circleRadius;
        const circleY = y + cardHeight / 2;
        
        ctx.fillStyle = isCompleted ? '#28A745' : '#9FAFFF';
        ctx.beginPath();
        ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
        ctx.fill();

        // Draw ID number
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${fontSize}px 'Nanum Pen Script', cursive`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(node.id), circleX, circleY);

        // Draw text content
        const textX = x + padding * 2 + circleRadius * 2 + 8;
        const titleFontSize = 13;
        const dateFontSize = 10;
        
        // Title
        ctx.fillStyle = '#000000';
        ctx.font = `bold ${titleFontSize}px 'Nanum Pen Script', cursive`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        const title = node.title.length > 15 ? node.title.substring(0, 15) + '...' : node.title;
        ctx.fillText(title, textX, y + padding);

        // Created date
        ctx.fillStyle = '#666666';
        ctx.font = `${dateFontSize}px 'Nanum Pen Script', cursive`;
        const createdText = node.createdDate 
            ? `Created: ${new Date(node.createdDate).toLocaleDateString('en-GB')}`
            : 'Created: N/A';
        ctx.fillText(createdText, textX, y + padding + titleFontSize + 4);

        // Deadline
        const deadlineText = node.deadline 
            ? `Deadline: ${new Date(node.deadline).toLocaleDateString('en-GB')}`
            : 'Deadline: N/A';
        ctx.fillText(deadlineText, textX, y + padding + titleFontSize + dateFontSize + 8);

        // Store node dimensions for interaction
        node.__width = cardWidth;
        node.__height = cardHeight;
    };

    const linkCanvasObject = (link: any, ctx: CanvasRenderingContext2D) => {
        const start = link.source;
        const end = link.target;
        
        if (!start || !end) return;

        const cardWidth = 180;
        
        // Start point: right edge of source card
        const startX = start.x + cardWidth / 2;
        const startY = start.y;
        
        // End point: left edge of target card
        const endX = end.x - cardWidth / 2;
        const endY = end.y;
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw arrow head
        const arrowLength = 10;
        const headAngle = Math.atan2(endY - startY, endX - startX);
        
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
            endX - arrowLength * Math.cos(headAngle - Math.PI / 6),
            endY - arrowLength * Math.sin(headAngle - Math.PI / 6)
        );
        ctx.lineTo(
            endX - arrowLength * Math.cos(headAngle + Math.PI / 6),
            endY - arrowLength * Math.sin(headAngle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = '#000000';
        ctx.fill();
    };

    const handleNodeClick = (node: any) => {
        if (node.id !== currentTaskId) {
            window.location.href = `/task/${node.id}`;
        }
    };

    if (loading) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    width: '100%', 
                    height: '100%' 
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (graphData.nodes.length === 0) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    width: '100%', 
                    height: '100%',
                    p: 4
                }}
            >
                <Typography variant="body1" sx={{ fontFamily: "'Nanum Pen Script', cursive", color: '#666' }}>
                    No dependencies found for this task
                </Typography>
            </Box>
        );
    }

    return (
        <Box 
            sx={{ 
                width: '100%', 
                height: '100%',
                position: 'relative',
                '& canvas': {
                    cursor: 'default !important'
                }
            }}
        >
            <ForceGraph2D
                ref={graphRef}
                graphData={graphData}
                nodeLabel={(node: any) => {
                    const title = node.title.length > 20 ? node.title.substring(0, 20) + '...' : node.title;
                    const description = node.description.length > 20 ? node.description.substring(0, 20) + '...' : node.description;
                    return `${title}\n${description}`;
                }}
                nodeCanvasObject={nodeCanvasObject}
                linkCanvasObject={linkCanvasObject}
                nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
                    ctx.fillStyle = color;
                    const cardWidth = 180;
                    const cardHeight = 80;
                    ctx.fillRect(node.x - cardWidth / 2, node.y - cardHeight / 2, cardWidth, cardHeight);
                }}
                nodeRelSize={90}
                backgroundColor="#9FAFFF"
                enableNodeDrag={true}
                enableZoomInteraction={true}
                enablePanInteraction={true}
                onNodeClick={handleNodeClick}
                d3VelocityDecay={0.3}
                cooldownTicks={0}
                dagMode="lr"
                dagLevelDistance={300}
                d3AlphaDecay={1}
                d3AlphaMin={0}
            />
        </Box>
    );
});

TaskGraph.displayName = 'TaskGraph';

export default TaskGraph;
