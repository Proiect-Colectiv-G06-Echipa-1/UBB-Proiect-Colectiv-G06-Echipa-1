import Box from "@mui/material/Box";
import { TopNav } from "../components/TopNav";
import { useState, useRef } from "react";
import notesIcon from "../assets/notes.png"
import treeIcon from "../assets/tree.png"
import TaskCard from "../components/TaskDetails/TaskCard";
import TaskGraph from "../components/TaskDetails/TaskGraph";
import { useParams } from "react-router-dom";

export function TaskDetailPage() {
  const [energyLevel, setEnergyLevel] = useState(6);
  const graphRef = useRef<any>(null);

  const {id} = useParams<{id: string}>();

    const handleTreeIconClick = () => {
        if (graphRef.current) {
            graphRef.current.regenerateGraph();
        }
    };

    return (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#9FAFFF',
          margin: 0,
          padding: 0,
          overflow: 'hidden'
        }}>
            <TopNav
                energyLevel={energyLevel}
                onDecrease={() => setEnergyLevel(prev => Math.max(0, prev - 1))}
                onIncrease={() => setEnergyLevel(prev => Math.min(10, prev + 1))}
            />
            
            <Box sx={{ 
                display: 'flex', 
                flex: 1, 
                position: 'relative', 
                overflow: 'hidden',
                flexDirection: { xs: 'column', md: 'row' }
            }}>
                
                <Box sx={{ 
                    width: { xs: '100%', md: '600px' }, 
                    height: { xs: '50%', md: 'auto' },
                    display: 'flex', 
                    flexDirection: 'column', 
                    paddingTop: 2
                }}>
                    <Box sx={{ px: 3, pb: 2 }}>
                        <img src={notesIcon} alt="Notes" height={60} width={60}/>
                    </Box>
                    <Box sx={{ 
                        flex: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        paddingRight: { xs: 0, md: 2 }, 
                        overflowY: 'auto',
                        px: { xs: 2, md: 0 }
                    }}>
                        <TaskCard id={Number(id)} />
                    </Box>
                </Box>

                <Box sx={{
                    width: { xs: '100%', md: '2px' },
                    height: { xs: '2px', md: 'auto' },
                    bgcolor: '#000000', 
                    alignSelf: 'stretch'
                }} />

                <Box sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    paddingTop: 2, 
                    minWidth: 0,
                    height: { xs: '50%', md: 'auto' }
                }}>
                    <Box sx={{ px: 3, pb: 2, cursor: 'pointer' }} onClick={handleTreeIconClick}>
                        <img src={treeIcon} alt="Tree" height={60} width={60} />
                    </Box>
                    <Box sx={{ flex: 1, overflow: 'hidden', px: 2, pb: 2 }}>
                        <TaskGraph ref={graphRef} currentTaskId={Number(id)} />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}