import { Navigate } from "react-router-dom";
import React from "react";
export default function ProtectedRoute({children}:{children: React.ReactElement}){
    const token = localStorage.getItem("token");
    if(!token){
        return <Navigate to="/login"></Navigate>
    }

    return children;
}