import {IconButton,Button} from "@mui/material"
import { colors } from "../colour_config"
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

export default function TaskComponent(props){
    const taskSelection = (event)=>{
    }
    
    return(
        <div style={{border:"none",borderRadius:"8px",background:"white",width:'100%',padding:"20px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center", columnGap:"20px"}}>
                <input type="checkbox" style={{width:"20px",height:"20px"}} onChange={taskSelection}/>
                <div style={{display:"flex",flexDirection:"column",rowGap:"3px"}}>
                    <p style={{fontWeight:"600",fontSize:"20px"}}>{props?.title || "Task title"}</p>
                    <p style={{}}>{props?.description || "Task description"}</p>
                    <p style={{fontSize:"12px"}}>Created At: 5:23 AM, 01/06/2022</p>
                </div>
            </div>
            <div style={{display:"flex",alignItems:"center",columnGap:"5px"}}>
                <IconButton ><DeleteIcon fontSize="small"/></IconButton>
                <IconButton ><ModeEditIcon fontSize="small"/></IconButton>
            </div>
        </div>
    )
}