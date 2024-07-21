import { Outlet, useNavigate } from "react-router-dom"
import { colors } from "../colour_config"
import { useCookies } from "react-cookie"
import {Button,IconButton} from "@mui/material"
import LogoutIcon from '@mui/icons-material/Logout';
import { useEffect, useState } from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useSelector } from "react-redux";
import { setUser } from "../reducers/user";



export default function HeaderComponent(){
    const [cookies, setCookie, removeCookie] = useCookies()
    const [anchorElement, setAnchorElement] = useState(null);
    const user = useSelector((state)=>state.user);
    const navigate = useNavigate()
    const open = Boolean(anchorElement);
    const handleClose = () => {
        setAnchorElement(null);
      };    

    const logout = ()=>{
        removeCookie("accessToken");
        setUser({})        
        navigate("/login")
    }

    const handleClick = (event) => {
        setAnchorElement(event.currentTarget);
      };

    return(
        <>
            <div style={{display:"flex",flexDirection:"column",rowGap:"20px",alignItems:"center",width:"100%"}}>
                <div style={{columnGap:"10px",zIndex:10,display:"flex",flexDirection:"row-reverse",alignItems:"center",width:"100%",height:"50px",border:"none",background:`#1976D2`,padding:"0px 20px",position:"fixed",top:0,left:0}}>
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                >
                 {user?.userData?.avatarInfo?.Location?
                    <img style={{width:"40px",height:"40px",borderRadius:"100%"}} src={`${user?.userData?.avatarInfo?.Location || ""}`}/> :
                    <AccountCircleIcon/>
                    }  
                </IconButton>  
                <p style={{fontSize:"20px",fontWeight:"500"}}>{(user?.userData?.firstName || "")+" "+(user?.userData?.lastName || "")}</p>    
                <Menu
                    disableScrollLock={true}
                    anchorEl={anchorElement}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                    style:{
                        width:150
                    },
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                        width: 320,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                        },
                        '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                        },
                    },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <AccountCircleIcon/>
                        </ListItemIcon>
                                 Profile
                    </MenuItem>
                    <MenuItem onClick={logout}>
                        <ListItemIcon>
                            <LogoutIcon/>
                        </ListItemIcon>                        
                        Logout
                    </MenuItem>
                </Menu>                                
                </div>
                <div style={{width:"100%",transform:"translateY(50px)"}}>
                    <Outlet/>
                </div>
            </div>
        </>
    )
}