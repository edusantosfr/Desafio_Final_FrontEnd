import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function PrivateRoutes() {
    const { isAuthenticated } = useContext(AuthContext);

    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}