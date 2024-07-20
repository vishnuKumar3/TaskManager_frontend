import TaskComponent from "../components/TaskComponent"

export default function Tasks(){
    return(
        <div style={{width:"max-content",display:"flex",flexDirection:"column",rowGap:"10px",padding:"30px 50px",background:"#CCCEDF",borderRadius:"10px"}}>
            <TaskComponent/>
            <TaskComponent/>
            <TaskComponent/>
            <TaskComponent/>                                    
        </div>
        
    )
}