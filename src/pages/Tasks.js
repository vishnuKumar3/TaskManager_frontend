import TaskComponent from "../components/TaskComponent"
import DNDNewComponent from "../components/DNDComponent/DNDNewComponent"

export default function Tasks(){

    return(
        <div style={{width:"100%",display:"flex",rowGap:"10px"}}>
            <DNDNewComponent/>                         
        </div>
        
    )
}