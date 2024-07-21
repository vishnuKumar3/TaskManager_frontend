import {IconButton,Button} from "@mui/material"
import { colors } from "../colour_config"
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {message} from "antd";
import {makeStyles} from "@mui/styles"
import {useState} from "react";
import { useDispatch } from "react-redux";
import { updateTaskById } from "../reducers/tasks";

const useStyles = makeStyles((theme)=>({
    input:{
        width:"100%",
        padding:"10px",
        fontSize:"15px",
        borderRadius:"5px",
        border:`1px solid ${colors.borderGrayColor}`
    },
    errorMessage:{
        color:"red",
        fontSize:"12px"
    }
  }))

export default function TaskComponent(props){

    const [taskTitle, setTasktitle] = useState(props?.title);
    const [taskDescription, setTaskDescription] = useState(props?.description);
    const [taskFormOpen, setTaskFormOpen] = useState(false)
    const dispatch = useDispatch()
    const [messageApi, contextHolder] = message.useMessage()
    const styles = useStyles()
  
    const handleClose = ()=>{
      setTaskFormOpen(false)
    }
  
    const clearTaskForm = ()=>{
      setTasktitle("");
      setTaskDescription("");
    }    

    const taskSelection = (event)=>{
    }

    const updateTask = ()=>{
        handleClose()
        dispatch(updateTaskById({taskId:props?.taskId,updateInfo:{title:taskTitle,description:taskDescription}})).then((action)=>{
          if(action?.error){
            messageApi.open({content:action?.payload?.message,type:"error",duration:5})
          }
          else{
            messageApi.open({content:action?.payload?.message,type:"success",duration:5})
            if(props.fetchAllTasks){
                props?.fetchAllTasks()
            }
          }
        }).catch((err)=>{
          messageApi.open({content:err?.message,type:"error",duration:5})
        })
      }   
      
      const deleteTask = ()=>{
        handleClose()
        dispatch(updateTaskById({taskId:props?.taskId,updateInfo:{state:'delete'}})).then((action)=>{
          if(action?.error){
            messageApi.open({content:action?.payload?.message,type:"error",duration:5})
          }
          else{
            messageApi.open({content:action?.payload?.message,type:"success",duration:5})
            if(props.fetchAllTasks){
                props?.fetchAllTasks()
            }
          }
        }).catch((err)=>{
          messageApi.open({content:err?.message,type:"error",duration:5})
        })
      }        

      const dialogComponent = ()=>{
        return(
        <Dialog
          open={taskFormOpen}
          onClose={handleClose}
        >
          <DialogTitle>
            Update Task
          </DialogTitle>
          <DialogContent>
            <div style={{width:"400px",padding:"10px 0px",display:"flex",flexDirection:"column",rowGap:"15px"}}>
              <input type="text" value={taskTitle} onChange={(e)=>setTasktitle(e.target.value)} placeholder="Task title*" className={styles.input}/>
              <input type="text" value={taskDescription} onChange={(e)=>setTaskDescription(e.target.value)} placeholder="Task description*" className={styles.input}/>
            </div>
          </DialogContent>
          <DialogActions>
            <Button style={{textTransform:"capitalize"}} onClick={handleClose}>Cancel</Button>
            <Button style={{textTransform:"capitalize"}} onClick={updateTask}>
              update
            </Button>
          </DialogActions>
        </Dialog>    
      )
      }      
    
    return(
        <div style={{border:"none",borderRadius:"8px",background:"white",width:'100%',padding:"20px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            {dialogComponent()}
            {contextHolder}            
            <div style={{display:"flex",alignItems:"center", columnGap:"20px"}}>
                <input type="checkbox" style={{width:"20px",height:"20px"}} onChange={taskSelection}/>
                <div style={{display:"flex",flexDirection:"column",rowGap:"3px"}}>
                    <p style={{fontWeight:"600",fontSize:"20px"}}>{props?.title || "Task title"}</p>
                    <p style={{}}>{props?.description || "Task description"}</p>
                    <p style={{fontSize:"12px"}}>Created At: 5:23 AM, 01/06/2022</p>
                </div>
            </div>
            <div style={{display:"flex",alignItems:"center",columnGap:"5px"}}>
                <IconButton onClick={deleteTask}><DeleteIcon fontSize="small"/></IconButton>
                <IconButton onClick={()=>setTaskFormOpen(true)} ><ModeEditIcon fontSize="small"/></IconButton>
            </div>
        </div>
    )
}