import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { PrivateRoutes } from './PrivateRouts';
import { Login } from "../pages/Login";
import { Profile } from "../pages/Profile";

import { Feed } from "../pages/ProfilePages/Feed";
import { Friends } from "../pages/ProfilePages/Friends";
import { ProfileSec } from "../pages/ProfilePages/ProfileSec";
import { Settings } from "../pages/ProfilePages/Settings";
import { CreatePost } from "../pages/ProfilePages/CreatePost.tsx";

import { UserProvider } from "../context/UserContext";
import { AuthProvider } from '../context/AuthContext';

export function AppRoutes() {
    return (
        <AuthProvider>
            <UserProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Login />} />

                        <Route element={<PrivateRoutes />}>
                            <Route path="/Profile" element={<Profile />}>
                                <Route path="feed" element={<Feed />} />
                                <Route path="friends" element={<Friends />} />
                                <Route path="profilesec" element={<ProfileSec />} />
                                <Route path="settings" element={<Settings />} />
                                <Route path="create" element={<CreatePost />} />
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </UserProvider>
        </AuthProvider>
    )
}