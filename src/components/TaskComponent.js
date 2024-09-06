import {IconButton,Button} from "@mui/material"
import { colors } from "../colour_config"
import { useEffect } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {message, theme} from "antd";
import {makeStyles} from "@mui/styles"
import {useState} from "react";
import { useDispatch } from "react-redux";
import { updateTaskById } from "../reducers/tasks";
import { useTheme } from "@mui/material";
import {useMediaQuery} from "@mui/material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import moment from "moment";
import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';

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
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [displayTask, setDisplayTask] = useState(false);
    const dispatch = useDispatch()
    const [messageApi, contextHolder] = message.useMessage()
    const styles = useStyles()
    const theme = useTheme()
    const mobileDevice = useMediaQuery(theme.breakpoints.down("md"))
    const dateObj = new Date(props?.createdAt);
    const dueDateObj  =new Date(props?.dueDate || "");
    const [minDateToStart, setMinDateToStart] = useState("");
    const [taskDueDate, setTaskDueDate] = useState(props?.dueDate || "");
  
    const handleClose = ()=>{
      setTaskFormOpen(false)
    }
  
    const clearTaskForm = ()=>{
      setTasktitle("");
      setTaskDescription("");
      setTaskDueDate("");
    }    


    const formatAndSetTaskDueDate = (e)=>{
      let momentObj = moment(e.target.value);
      setTaskDueDate(momentObj.toDate()) 
    }    

    const fetchFormattedTaskDate = (date)=>{
      let momentObj = moment();
      if(date){
        momentObj = moment(date);
      }
      let formattedDate = momentObj.format("YYYY-MM-DD");
      return formattedDate;
      
    }

    const fetchDueInDaysFormat = (dueDate)=>{
      let momentObj = moment();
      if(dueDate){
        momentObj = moment(dueDate);
      }
      let remainingSeconds = momentObj.diff(moment(),"seconds");
      let remainingDays = 0;
      if(remainingSeconds>0 && remainingSeconds<=(24*60*60)){
        remainingDays = 1;
      }
      else if(remainingSeconds<=-(24*60*60)){
        remainingDays=-1;
      }      
      else if(remainingSeconds<0){
        remainingDays=0;
      }
      else{
        remainingDays = Math.ceil(remainingSeconds/(24*60*60))
      }
      return remainingDays;
    }

    const fetchTaskDueMessage = (dueDate)=>{
      let remainingDays = fetchDueInDaysFormat(dueDate)
      if(remainingDays>1){
        return `Due in ${remainingDays} days`;
      }
      else if(remainingDays === 1){
        return "Due Tomorrow";
      }      
      else if(remainingDays === 0){
        return "Due Today"
      }
      else{
        return "Overdue"
      }
    }

    const fetchTaskDueColor = (dueDate)=>{
      let remainingDays = fetchDueInDaysFormat(dueDate);
      if(remainingDays>1){
        return "success";
      }
      else{
        return "error";
      }
    }

    useEffect(()=>{
      let today = new Date().toISOString().split('T')[0];
      setMinDateToStart(today)  
    },[])


    const updateTask = ()=>{
        handleClose()
        dispatch(updateTaskById({taskId:props?.taskId,updateInfo:{title:taskTitle,description:taskDescription,dueDate:taskDueDate}})).then((action)=>{
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
              <input type="date" value={fetchFormattedTaskDate(taskDueDate)} min={minDateToStart} onChange={(e)=>{formatAndSetTaskDueDate(e)}} className={styles.input}/>
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

      const deleteConfirmationComponent = ()=>{
        return(
        <Dialog
          open={deleteConfirmation}
          onClose={()=>setDeleteConfirmation(false)}
        >
          <DialogTitle>
            Are you sure you want to delete task ?
          </DialogTitle>
          <DialogContent>
                If you are confirm to delete, please click 'Delete.' If you wish to keep the task, click 'Cancel.' This action cannot be undone.            
          </DialogContent>
          <DialogActions>
            <Button style={{textTransform:"capitalize"}} onClick={()=>setDeleteConfirmation(false)}>Cancel</Button>
            <Button style={{textTransform:"capitalize"}} onClick={deleteTask}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>    
      )
      }       

      const showTask = ()=>{
        return(
        <Dialog
          open={displayTask}
          onClose={()=>setDisplayTask(false)}
        >
          <DialogTitle>
            {props?.title || "Task Title"}
          </DialogTitle>
          <DialogContent>
            <div style={{width:"400px",padding:"10px 0px",display:"flex",flexDirection:"column",rowGap:"15px"}}>
                <p>{props?.description || "Task Description"}</p>
            </div>
          </DialogContent>
          <DialogActions>
            <Button style={{textTransform:"capitalize"}} onClick={()=>setDisplayTask(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>    
      )
      }         
    
    return(
        <Badge style={{width:"100%"}} badgeContent={fetchDueInDaysFormat(props?.dueDate).toString()} color={fetchTaskDueColor(props?.dueDate)}>
          <div style={{border:"none",borderRadius:"8px",background:"white",width:'100%',padding:"20px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              {dialogComponent()}
              {deleteConfirmationComponent()}
              {showTask()}
              {contextHolder}            
              <div style={{display:"flex",alignItems:"center",width:"50%", columnGap:"20px"}}>
                  <div style={{display:"flex",flexDirection:"column",rowGap:"3px",width:"100%"}}>
                      <p style={{fontWeight:"600",fontSize:mobileDevice?"15px":"20px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{props?.title || "Task title"}</p>
                      <p title={props?.description || ""} style={{fontSize:mobileDevice?"13px":"initial",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{props?.description || "Task description"}</p>
                      <p title={dateObj.toLocaleString()} style={{width:"100%",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontSize:"12px"}}>Created At: {dateObj.toLocaleString()}</p>
                      {props?.dueDate && <p title={dueDateObj.toLocaleDateString()} style={{width:"100%",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontSize:"12px"}}>Due Date: {dueDateObj.toLocaleDateString()}</p>}
                      <Chip style={{marginTop:"20px"}} label={fetchTaskDueMessage(props?.dueDate)} size={"small"} color={fetchTaskDueColor(props?.dueDate)}/>
                  </div>
              </div>
              <div style={{display:"flex",alignItems:"center",columnGap:"5px"}}>
                  <IconButton onClick={()=>setDisplayTask(true)}><VisibilityIcon fontSize="small"/></IconButton>                
                  <IconButton onClick={()=>setDeleteConfirmation(true)}><DeleteIcon fontSize="small"/></IconButton>
                  <IconButton onClick={()=>setTaskFormOpen(true)} ><ModeEditIcon fontSize="small"/></IconButton>
              </div>
          </div>
        </Badge>
    )
}