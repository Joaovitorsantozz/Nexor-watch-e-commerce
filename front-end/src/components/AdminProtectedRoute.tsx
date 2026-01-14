import { Navigate } from "react-router-dom";
import React from "react";
export default function AdminProtectedRoute({children}:{children: React.ReactElement}){
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if(!token || role !="ADMIN" ){
        return <Navigate to="/"></Navigate>
    }

    return children;
}