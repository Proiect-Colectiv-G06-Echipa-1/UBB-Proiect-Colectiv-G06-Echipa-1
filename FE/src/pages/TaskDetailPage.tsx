import Box from "@mui/material/Box";
import { TopNav } from "../components/TopNav";
import { useState } from "react";
import notesIcon from "../assets/notes.png"
import treeIcon from "../assets/tree.png"
import TaskCard from "../components/TaskDetails/TaskCard";
import { useParams } from "react-router-dom";

export function TaskDetailPage() {
  const [energyLevel, setEnergyLevel] = useState(6);

  const {id} = useParams<{id: string}>();

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
            
            <Box sx={{ display: 'flex', flex: 1, position: 'relative', overflow: 'auto'}}>
                <Box sx={{ width: '600px', display: 'flex', flexDirection: 'column', paddingTop: 2}}>
                    <Box sx={{ px: 3, pb: 2 }}>
                        <img src={notesIcon} alt="Notes" height={60} width={60}/>
                    </Box>
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 2}}>
                        <TaskCard id={Number(id)} />
                    </Box>
                </Box>

                <Box sx={{width: '2px', bgcolor: '#000000', alignSelf: 'stretch'}} />

                <Box sx={{ paddingTop: 2}}>
                    <Box sx={{ px: 3, pb: 2 }}>
                        <img src={treeIcon} alt="Tree" height={60} width={60} />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}