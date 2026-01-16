/**
 * @file TaskGraph.tsx
 * @brief Component for visualizing task dependencies in a 2D force-directed graph.
 */
import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Box, CircularProgress, Typography } from '@mui/material';
import type { TaskDTO } from '../../../typescript-client';
import { taskApi } from '../../api/api';
import { toast } from 'react-toastify';

/**
 * @interface GraphNode
 * @brief Graph node structure combining task data with graph properties.
 */
interface GraphNode {
    id: number;
    task: TaskDTO; ///< Embedded task data.
    isCurrent: boolean; ///< Whether this is the task currently being viewed.
    level: number; ///< Hierarchical level for graph layout.
    fx?: number; ///< Fixed x position.
    fy?: number; ///< Fixed y position.
}

/**
 * @interface GraphLink
 * @brief Represents a directed link between two nodes in the graph.
 */
interface GraphLink {
    source: number;
    target: number;
}

/**
 * @interface GraphData
 * @brief Structure of the data used by the force graph.
 */
interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

/**
 * @interface TaskGraphProps
 * @brief Props for the TaskGraph component.
 */
interface TaskGraphProps {
    currentTaskId: number;
}

/**
 * @interface TaskGraphRef
 * @brief Imperative handle for the TaskGraph component.
 */
export interface TaskGraphRef {
    regenerateGraph: () => void;
}

/**
 * @brief TaskGraph component that renders a dependency graph using react-force-graph-2d.
 */
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

    /**
     * Builds a lookup map of all tasks by their ID
     * @param tasks - Array of all tasks
     * @returns Map of task ID to TaskDTO for O(1) lookups
     */
    const buildTaskMap = (tasks: TaskDTO[]): Map<number, TaskDTO> => {
        const taskMap = new Map<number, TaskDTO>();
        tasks.forEach(task => {
            if (task.id !== undefined) {
                taskMap.set(task.id, task);
            }
        });
        return taskMap;
    };

    /**
     * Finds all child tasks that depend on the given task
     * @param taskId - ID of the parent task
     * @param allTasks - Array of all tasks to search through
     * @returns Array of child task IDs
     */
    const findChildTasks = (taskId: number, allTasks: TaskDTO[]): number[] => {
        const children: number[] = [];
        allTasks.forEach(task => {
            if (task.parents && task.parents.has(taskId) && task.id !== undefined) {
                children.push(task.id);
            }
        });
        return children;
    };

    /**
     * Processes a single task in the BFS traversal, adding its relationships to the graph
     * @param taskId - ID of task to process
     * @param level - Hierarchical level in the graph
     * @param allTasksMap - Map of all tasks for lookups
     * @param allTasks - Array of all tasks (for finding children)
     * @param visitedTasks - Set of already visited task IDs
     * @param tasksMap - Map to store processed tasks
     * @param taskLevels - Map to store task levels
     * @param links - Array to accumulate graph links
     * @param queue - BFS queue for traversal
     */
    const processTask = (
        taskId: number,
        level: number,
        allTasksMap: Map<number, TaskDTO>,
        allTasks: TaskDTO[],
        visitedTasks: Set<number>,
        tasksMap: Map<number, TaskDTO>,
        taskLevels: Map<number, number>,
        links: GraphLink[],
        queue: { taskId: number; level: number }[]
    ) => {
        if (visitedTasks.has(taskId)) {
            return;
        }

        visitedTasks.add(taskId);
        taskLevels.set(taskId, level);
        const task = allTasksMap.get(taskId);

        if (!task) {
            return;
        }

        tasksMap.set(taskId, task);

        // Process parent dependencies (tasks this task depends on)
        if (task.parents && task.parents.size > 0) {
            task.parents.forEach((parentId) => {
                links.push({ source: parentId, target: taskId });
                if (!visitedTasks.has(parentId)) {
                    queue.push({ taskId: parentId, level: level - 1 });
                }
            });
        }

        // Process child dependencies (tasks that depend on this task)
        const children = findChildTasks(taskId, allTasks);
        children.forEach((childId) => {
            links.push({ source: taskId, target: childId });
            if (!visitedTasks.has(childId)) {
                queue.push({ taskId: childId, level: level + 1 });
            }
        });
    };

    /**
     * Converts processed tasks into positioned graph nodes
     * @param tasksMap - Map of processed tasks
     * @param taskLevels - Map of task levels
     * @param rootTaskId - ID of the root task (current task being viewed)
     * @returns Array of positioned graph nodes
     */
    const buildGraphNodes = (
        tasksMap: Map<number, TaskDTO>,
        taskLevels: Map<number, number>,
        rootTaskId: number
    ): GraphNode[] => {
        // Group nodes by hierarchical level for layout
        const nodesByLevel = new Map<number, Array<{ id: number; task: TaskDTO }>>();
        tasksMap.forEach((task, id) => {
            const level = taskLevels.get(id) || 0;
            if (!nodesByLevel.has(level)) {
                nodesByLevel.set(level, []);
            }
            nodesByLevel.get(level)!.push({ id, task });
        });

        // Create graph nodes with calculated vertical positions
        const nodes: GraphNode[] = [];
        const VERTICAL_SPACING = 150; // Pixels between nodes on same level

        nodesByLevel.forEach((levelNodes, level) => {
            const numNodesInLevel = levelNodes.length;
            
            levelNodes.forEach((nodeData, indexInLevel) => {
                // Center nodes symmetrically around y=0
                const yOffset = (indexInLevel - (numNodesInLevel - 1) / 2) * VERTICAL_SPACING;
                
                nodes.push({
                    id: nodeData.id,
                    task: nodeData.task,
                    isCurrent: nodeData.id === rootTaskId,
                    level: level,
                    fx: undefined, // Let DAG mode handle x positioning
                    fy: yOffset, // Set y position for vertical distribution
                });
            });
        });

        return nodes;
    };

    /**
     * Fetches and builds a graph of all tasks related to the root task
     * Traverses both parent dependencies (upward) and child dependencies (downward)
     * using breadth-first search to build a complete dependency graph
     * @param rootTaskId - ID of the task to center the graph around
     * @returns Graph data with nodes and links, or empty graph on error
     */
    const fetchAllRelatedTasks = useCallback(async (rootTaskId: number) => {
        // Fetch all tasks from the API
        let allTasks: TaskDTO[] = [];
        try {
            allTasks = await taskApi.getAll();
        } catch (error) {
            console.error('Failed to fetch all tasks:', error);
            return { nodes: [], links: [] };
        }

        const allTasksMap = buildTaskMap(allTasks);

        // Initialize data structures for BFS traversal
        const visitedTasks = new Set<number>();
        const tasksMap = new Map<number, TaskDTO>();
        const taskLevels = new Map<number, number>();
        const links: GraphLink[] = [];
        const queue: { taskId: number; level: number }[] = [{ taskId: rootTaskId, level: 0 }];

        // Breadth-first search to traverse dependency graph
        while (queue.length > 0) {
            const { taskId, level } = queue.shift()!;
            processTask(
                taskId,
                level,
                allTasksMap,
                allTasks,
                visitedTasks,
                tasksMap,
                taskLevels,
                links,
                queue
            );
        }

        // Convert processed data into positioned graph nodes
        const nodes = buildGraphNodes(tasksMap, taskLevels, rootTaskId);

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

    // Canvas drawing constants
    const CARD_WIDTH = 180;
    const CARD_HEIGHT = 80;
    const CARD_RADIUS = 12;
    const CIRCLE_RADIUS = 18;
    const PADDING = 12;
    const FONT_SIZE_ID = 12;
    const FONT_SIZE_TITLE = 13;
    const FONT_SIZE_DATE = 10;

    /**
     * Draws a rounded rectangle path on the canvas
     * @param ctx - Canvas rendering context
     * @param x - Top-left x coordinate
     * @param y - Top-left y coordinate
     * @param width - Rectangle width
     * @param height - Rectangle height
     * @param radius - Corner radius
     */
    const drawRoundedRect = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
    ) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    };

    /**
     * Draws the card background with appropriate styling based on task status
     * @param ctx - Canvas rendering context
     * @param x - Card x position
     * @param y - Card y position
     * @param isCompleted - Whether the task is completed
     * @param isCurrent - Whether this is the current task
     */
    const drawCardBackground = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        isCompleted: boolean,
        isCurrent: boolean
    ) => {
        // Set fill and stroke styles based on task state
        ctx.fillStyle = isCompleted ? '#D4EDDA' : '#FFFFFF';
        ctx.strokeStyle = isCurrent ? '#000000' : (isCompleted ? '#28A745' : 'transparent');
        ctx.lineWidth = 2;

        // Draw the rounded rectangle
        drawRoundedRect(ctx, x, y, CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS);
        
        // Apply shadow for depth
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        
        ctx.fill();
        if (isCurrent) {
            ctx.stroke();
        }
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    };

    /**
     * Draws the ID circle badge on the card
     * @param ctx - Canvas rendering context
     * @param circleX - Circle center x coordinate
     * @param circleY - Circle center y coordinate
     * @param taskId - Task ID to display
     * @param isCompleted - Whether the task is completed
     */
    const drawIdCircle = (
        ctx: CanvasRenderingContext2D,
        circleX: number,
        circleY: number,
        taskId: number,
        isCompleted: boolean
    ) => {
        // Draw circle background
        ctx.fillStyle = isCompleted ? '#28A745' : '#9FAFFF';
        ctx.beginPath();
        ctx.arc(circleX, circleY, CIRCLE_RADIUS, 0, 2 * Math.PI);
        ctx.fill();

        // Draw ID number
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${FONT_SIZE_ID}px 'Nanum Pen Script', cursive`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(taskId), circleX, circleY);
    };

    /**
     * Draws the task text content (title and dates)
     * @param ctx - Canvas rendering context
     * @param x - Card x position
     * @param y - Card y position
     * @param task - Task data to display
     */
    const drawTaskText = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        task: TaskDTO
    ) => {
        const textX = x + PADDING * 2 + CIRCLE_RADIUS * 2 + 8;
        
        // Draw title
        ctx.fillStyle = '#000000';
        ctx.font = `bold ${FONT_SIZE_TITLE}px 'Nanum Pen Script', cursive`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        const title = (task.title || 'Untitled').length > 15 
            ? (task.title || 'Untitled').substring(0, 15) + '...' 
            : (task.title || 'Untitled');
        ctx.fillText(title, textX, y + PADDING);

        // Draw dates
        ctx.fillStyle = '#666666';
        ctx.font = `${FONT_SIZE_DATE}px 'Nanum Pen Script', cursive`;
        
        const createdText = task.creationDate
            ? `Created: ${new Date(task.creationDate).toLocaleDateString('en-GB')}`
            : 'Created: N/A';
        ctx.fillText(createdText, textX, y + PADDING + FONT_SIZE_TITLE + 4);

        const deadlineText = task.deadline
            ? `Deadline: ${new Date(task.deadline).toLocaleDateString('en-GB')}`
            : 'Deadline: N/A';
        ctx.fillText(deadlineText, textX, y + PADDING + FONT_SIZE_TITLE + FONT_SIZE_DATE + 8);
    };

    /**
     * Renders a task node as a card on the canvas
     * Displays task ID, title, creation date, and deadline
     * Applies different styling for completed and current tasks
     * @param node - Graph node containing task data and position
     * @param ctx - Canvas rendering context
     */
    const nodeCanvasObject = (node: any, ctx: CanvasRenderingContext2D) => {
        const isCompleted = node.task.status === 'COMPLETED';
        
        // Calculate card position (centered on node)
        const x = node.x - CARD_WIDTH / 2;
        const y = node.y - CARD_HEIGHT / 2;

        // Draw card components
        drawCardBackground(ctx, x, y, isCompleted, node.isCurrent);
        
        const circleX = x + PADDING + CIRCLE_RADIUS;
        const circleY = y + CARD_HEIGHT / 2;
        drawIdCircle(ctx, circleX, circleY, node.id, isCompleted);
        
        drawTaskText(ctx, x, y, node.task);

        // Store dimensions for interaction detection
        node.__width = CARD_WIDTH;
        node.__height = CARD_HEIGHT;
    };

    /**
     * Draws an arrowhead at the end of a link
     * @param ctx - Canvas rendering context
     * @param endX - Arrow tip x coordinate
     * @param endY - Arrow tip y coordinate
     * @param angle - Angle of the arrow direction
     */
    const drawArrowHead = (
        ctx: CanvasRenderingContext2D,
        endX: number,
        endY: number,
        angle: number
    ) => {
        const ARROW_LENGTH = 10;
        const ARROW_ANGLE = Math.PI / 6; // 30 degrees
        
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
            endX - ARROW_LENGTH * Math.cos(angle - ARROW_ANGLE),
            endY - ARROW_LENGTH * Math.sin(angle - ARROW_ANGLE)
        );
        ctx.lineTo(
            endX - ARROW_LENGTH * Math.cos(angle + ARROW_ANGLE),
            endY - ARROW_LENGTH * Math.sin(angle + ARROW_ANGLE)
        );
        ctx.closePath();
        ctx.fillStyle = '#000000';
        ctx.fill();
    };

    /**
     * Renders a directed link between two task nodes
     * Draws from right edge of source card to left edge of target card
     * Includes an arrowhead pointing to the target
     * @param link - Link data with source and target nodes
     * @param ctx - Canvas rendering context
     */
    const linkCanvasObject = (link: any, ctx: CanvasRenderingContext2D) => {
        const start = link.source;
        const end = link.target;
        
        if (!start || !end) return;
        
        // Calculate link endpoints (from right edge of source to left edge of target)
        const startX = start.x + CARD_WIDTH / 2;
        const startY = start.y;
        const endX = end.x - CARD_WIDTH / 2;
        const endY = end.y;
        
        // Draw the connecting line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw arrowhead at the target end
        const angle = Math.atan2(endY - startY, endX - startX);
        drawArrowHead(ctx, endX, endY, angle);
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
                    const title = node.task.title || 'Untitled';
                    const description = node.task.description || '';
                    const shortTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;
                    const shortDesc = description.length > 20 ? description.substring(0, 20) + '...' : description;
                    return `${shortTitle}\n${shortDesc}`;
                }}
                nodeCanvasObject={nodeCanvasObject}
                linkCanvasObject={linkCanvasObject}
                nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
                    ctx.fillStyle = color;
                    ctx.fillRect(node.x - CARD_WIDTH / 2, node.y - CARD_HEIGHT / 2, CARD_WIDTH, CARD_HEIGHT);
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
