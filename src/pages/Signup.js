import React,{useRef, useState} from 'react';
import {Link} from "react-router-dom"
import { Formik } from 'formik';
import * as yup from "yup"
import {colors} from "../colour_config"
import {makeStyles} from "@mui/styles"
import {Button} from "@mui/material"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from "axios"


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

const LoginSchema = yup.object({
    firstName:yup.string().required("Please provide first name"),
    email:yup.string().email().required("Please provide your email"),
    password:yup.string().required("Please provide your password"),
    reEnteredPassword:yup.string().required("Please re enter password")
})

export default function Signup(){
    const styles = useStyles()
    const formRef = useRef("") 
    const [fileName, setFilename] = useState("");
    const [fileObj, setFileObj] = useState({})

    const handleChange = (event)=>{
        console.log("file info",event.target.files)
        let files = event.target.files;
        setFilename(files?.[0]?.name || "");
        setFileObj(files?.[0] || {})
    }

    const handleFormData = async (formValues)=>{
        let formData = new FormData();
        Object.entries(formValues).map(([key,value])=>{
            formData.append(key,value);
        })
        formData.append("avatar",fileObj);
        formData.append("signInType","normal");
        let ret = await axios.post("http://localhost:8080/user/signup",formData);
        console.log("response from signup api",ret.data);
    }

    return(
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%",background:`linear-gradient(340deg,${colors.blueVariant} 50%,white 1%`,height:"max-content",padding:"50px 0px"}}>
            <Formik
            initialValues={{ firstName:"",lastName:"",email: '', password: '',reEnteredPassword:"",avatar:"" }}
            validationSchema={LoginSchema}
            onSubmit={(values, { setSubmitting,resetForm }) => {
                console.log(values,fileObj)
                handleFormData(values)
                resetForm()
            }}
            >
            {(formik) => (
                <form ref={formRef} style={{background:"white",width:"350px",rowGap:"15px",border:"1px solid #aaaaaa99",borderRadius:"10px",display:"flex",flexDirection:"column",padding:"30px 30px 50px 30px"}} onSubmit={formik.handleSubmit}>
                <p style={{fontSize:"30px",fontWeight:"600",padding:"0px 0px 20px 0px"}}>Signup</p>    
                <input
                    className={`${styles.input}`}
                    type="text"
                    name="firstName"
                    placeholder="Firstname*"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                />
                {formik.touched.firstName && formik.errors.firstName?<p className={`${styles.errorMessage}`}>{formik.errors.firstName}</p>:""}
                <input
                    className={`${styles.input}`}
                    type="text"
                    name="lastName"
                    placeholder="Lastname"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                /> 
                <label htmlFor="file-upload" style={{display:"flex",alignItems:"center",columnGap:"5px"}}>Upload Avatar <CloudUploadIcon/></label>
                <input type="file" name="avatar" style={{position:"absolute",zIndex:-1,opacity:0}} onChange={handleChange} id="file-upload"/>
                {fileName && <p style={{fontSize:"12px",color:"lime"}}>{fileName}</p>}
                 <input
                    className={`${styles.input}`}
                    type="text"
                    name="email"
                    placeholder="email*"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email?<p className={`${styles.errorMessage}`}>{formik.errors.email}</p>:""}
                <input
                    className={`${styles.input}`}
                    type="password"
                    name="password"
                    placeholder="password*"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password?<p className={`${styles.errorMessage}`}>{formik.errors.password}</p>:""}
                <input
                    className={`${styles.input}`}
                    type="password"
                    name="reEnteredPassword"
                    placeholder="re-enter password*"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.reEnteredPassword}
                />
                {formik.touched.reEnteredPassword && formik.errors.reEnteredPassword?<p className={`${styles.errorMessage}`}>{formik.errors.reEnteredPassword}</p>:""}                
                <div style={{display:"flex",justifyContent:"center"}}>
                    <Button variant={"contained"} type='submit' style={{padding:"5px 20px",background:`${colors.blueVariant}`,color:"white"}} disabled={formik.isSubmitting}>
                        Submit
                    </Button>
                </div>
                <div style={{marginTop:"20px",display:"flex",rowGap:"5px",flexDirection:"column",alignItems:"center"}}>
                    <p style={{fontSize:"15px"}}>Already have an account?</p>
                    <Link style={{fontSize:"15px"}} to="/login">Login</Link>
                </div>
                </form>
            )}
            </Formik>
        </div>
    )
}