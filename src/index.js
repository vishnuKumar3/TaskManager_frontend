import React from 'react';
import ReactDOM from 'react-dom/client';
import "./global.css"
import App from './App';
import {BrowserRouter, Route} from "react-router-dom"
import Routes from './Routes';
import reportWebVitals from './reportWebVitals';
import {GoogleOAuthProvider} from "@react-oauth/google"
import store from './Store/store';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { CookiesProvider } from 'react-cookie';


const persistor = persistStore(store)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>    
        <PersistGate persistor={persistor}>
            <CookiesProvider>            
                <GoogleOAuthProvider clientId='595540796921-m3csasrb56jk6iheq9s4cq7etvdft4m3.apps.googleusercontent.com' >    
                        <BrowserRouter>
                            <Routes/>
                        </BrowserRouter>
                </GoogleOAuthProvider> 
            </CookiesProvider>
        </PersistGate> 
    </Provider>      
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
