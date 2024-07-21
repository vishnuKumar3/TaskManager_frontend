import React, { useEffect, useState ,useRef} from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskComponent from "../TaskComponent";
import ColumnGroup from "antd/es/table/ColumnGroup";
import {Button} from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import { createTask,fetchTasks,updateTaskById } from "../../reducers/tasks";
import { colors } from "../../colour_config";
import {makeStyles} from "@mui/styles"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {message} from "antd";
import Tasks from "../../pages/Tasks";

const data={
  "todo":[{"taskId":"669c017fb49303fcedaeb","state":"todo","title":"task1","description":"task1 description","createdAtUnixTime":1721500031016.0},
  {"taskId":"669c017fb49303fcedaeb22","state":"todo","title":"task4","description":"task1 description","createdAtUnixTime":1721500031016.0}
  ],
  inProgress:[{"taskId":"669c017fb4303fcedaeb292","state":"in-progress","title":"task2","description":"task1 description","createdAtUnixTime":1721500031016.0}],
  "completed":[{"taskId":"669c017fb49303cedaeb292","state":"completed","title":"task3","description":"task1 description","createdAtUnixTime":1721500031016.0}],
}


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

// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `item ${k + offset}`
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  console.log("source",source,"\ndestination",destination,"\ndroppable source",droppableSource,"\ndestination",droppableDestination)
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "initial",
  width:"100%",

  // styles we need to apply on draggables
  ...draggableStyle
});
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "initial",
  display:"flex",
  flexDirection:"column",
  alignItems:"flex-start",
  rowGap:"15px",
  border:"none",
  width: "30%"
});


export default function DNDNewComponent(props) {
  const [state, setState] = useState([[], [], []]);
  const taskStateheadings = ["Todo","In-progress","Completed"]
  const taskStates = ["todo","in-progress","completed"]
  const [taskTitle, setTasktitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const styles = useStyles()
  const [keyword, setKeyword] = useState("")
  const dispatch = useDispatch()
  const [messageApi, contextHolder] = message.useMessage()

  const handleClose = ()=>{
    setTaskFormOpen(false)
  }

  const clearTaskForm = ()=>{
    setTasktitle("");
    setTaskDescription("");
  }

  useEffect(()=>{
    fetchAllTasks()
  },[])

  const updateTask = (taskId, updateInfo)=>{
    handleClose()
    dispatch(updateTaskById({taskId:taskId,updateInfo:updateInfo})).then((action)=>{
      clearTaskForm()
      if(action?.error){
        messageApi.open({content:action?.payload?.message,type:"error",duration:5})
      }
      else{
        messageApi.open({content:action?.payload?.message,type:"success",duration:5})
        fetchAllTasks()
      }
    }).catch((err)=>{
      clearTaskForm()
      messageApi.open({content:err?.message,type:"error",duration:5})
    })
  } 

  const taskCreation = ()=>{
    handleClose()
    dispatch(createTask({title:taskTitle,description:taskDescription})).then((action)=>{
      clearTaskForm()
      if(action?.error){
        messageApi.open({content:action?.payload?.message,type:"error",duration:5})
      }
      else{
        messageApi.open({content:action?.payload?.message,type:"success",duration:5})
        fetchAllTasks()
      }
    }).catch((err)=>{
      clearTaskForm()
      messageApi.open({content:err?.message,type:"error",duration:5})
    })

  }

  const fetchAllTasks = ()=>{
    dispatch(fetchTasks({keyword:keyword})).then((action)=>{
      setKeyword("")
      if(action?.error){
        messageApi.open({content:action?.payload?.message,type:"error",duration:5})
      }
      else{
        let tasks = action?.payload?.tasks;
        let allTasks = [[],[],[]];
        taskStates.map((taskState,index)=>{
          if(tasks[taskState]){
            allTasks[index] = tasks[taskState]
          }
        })
        console.log(allTasks)
        setState(allTasks)
        messageApi.open({content:action?.payload?.message,type:"success"})
      }
    }).catch((err)=>{
      setKeyword("")
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
        Create Task
      </DialogTitle>
      <DialogContent>
        <div style={{width:"400px",padding:"10px 0px",display:"flex",flexDirection:"column",rowGap:"15px"}}>
          <input type="text" onChange={(e)=>setTasktitle(e.target.value)} placeholder="Task title*" className={styles.input}/>
          <input type="text" onChange={(e)=>setTaskDescription(e.target.value)} placeholder="Task description*" className={styles.input}/>
        </div>
      </DialogContent>
      <DialogActions>
        <Button style={{textTransform:"capitalize"}} onClick={handleClose}>Cancel</Button>
        <Button style={{textTransform:"capitalize"}} onClick={taskCreation}>
          Create
        </Button>
      </DialogActions>
    </Dialog>    
  )
  }

  function onDragEnd(result) {
    const { source, destination } = result;
    console.log(source,destination,result)
    let resultData = {...result}
    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;
    console.log(sInd,dInd)
    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {

      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];
      setState(newState);
      let destinationIndex = resultData?.destination?.droppableId;
      if(resultData?.destination && resultData?.destination?.hasOwnProperty("droppableId") && destinationIndex>=0){
        updateTask(resultData?.draggableId,{
          state:taskStates[destinationIndex]
        })
      }
    }
  }

  return (
    <div style={{width:"100%",display:"flex",flexDirection:"column",rowGap:"20px",padding:"30px 20px"}}>
      {dialogComponent()}
      {contextHolder}
      <Button onClick={()=>setTaskFormOpen(true)} style={{textTransform:"capitalize",width:"max-content"}} variant={"contained"}>
        New task +
      </Button>
      <div style={{display:"flex",alignItems:"center",columnGap:"10px"}}>
        <input onChange={(e)=>setKeyword(e.target.value)} style={{width:"80%"}} type="text" placeholder="enter keyword to search" className={styles.input}/>
        <Button onClick={fetchAllTasks} variant={"contained"} style={{textTransform:"capitalize"}}>Search</Button>
      </div>
      <div style={{ display: "flex",minHeight:"400px",maxHeight:"max-content",width:"100%",justifyContent:"space-between",background:`${colors.grayVariant}`,padding:"30px 50px",borderRadius:"10px" }}>
        <DragDropContext onDragEnd={onDragEnd} style={{width:"100%"}}>
          {state.map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  <p style={{fontSize:"20px",marginBottom:"20px",textTransform:"capitalize",fontWeight:600}}>{taskStateheadings[ind]}</p>
                  {el.map((item, index) => (
                    <Draggable
                      key={item.taskId}
                      draggableId={item.taskId}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                              width:"100%"
                            }}
                          >
                            <TaskComponent fetchAllTasks={fetchAllTasks} title={item?.title} taskId={item?.taskId} description={item?.description}/>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}
