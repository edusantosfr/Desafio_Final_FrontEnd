import logo from "../assets/logo-blue.png";
import arrow from "../assets/arrow.svg";

// import { ReposCard } from "../components/reposCard";
import { useUser } from "../context/UserContext";
import { LoadingSpinner } from "../components/loadingSpinner";

import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function Profile() {
    const { user } = useUser()
    const navigate = useNavigate();
    const { setIsAuthenticated } = useContext(AuthContext);

    const carousel = useRef<HTMLDivElement | null>(null)

    const [count, setCount] = useState(0)
    const [status, setStatus] = useState(false)
    const [modalCard, setModalCard] = useState(false);
    const [modalOpen, setModalOpen] = useState<number | null>(null)


}