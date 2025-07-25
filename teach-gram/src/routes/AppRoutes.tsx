import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { PrivateRoutes } from './PrivateRouts';

import { Login } from "../pages/Login";
import { Profile } from "../pages/Profile";
import { Feed } from "../pages/ProfilePages/Feed";
import { ProfileSec } from "../pages/ProfilePages/ProfileSec";
import { UserProfileSec } from '../pages/ProfilePages/UserProfileSec.tsx';

import { Settings } from "../pages/Settings.tsx";
import { Menu } from '../pages/SettingsPages/Menu.tsx';
import { ProfileInfo } from '../pages/SettingsPages/ProfileInfo.tsx';
import { EditProfile } from '../pages/SettingsPages/EditProfile.tsx';

import { UserProvider } from "../context/UserContext";
import { AuthProvider } from '../context/AuthContext';
import { PostProvider } from '../context/PostContext.tsx';

export function AppRoutes() {
    return (
        <AuthProvider>
            <UserProvider>
                <PostProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Login />} />

                            <Route element={<PrivateRoutes />}>
                                <Route path="/Profile" element={<Navigate to="/Profile/feed" replace />} />
                                <Route path="/Profile" element={<Profile />}>
                                    <Route path="feed" element={<Feed />} />
                                    <Route path="profilesec" element={<ProfileSec />} />
                                    <Route path="profilesec/:userId" element={<UserProfileSec />} />

                                </Route>

                                <Route path="/Settings" element={<Settings />}>
                                    <Route index element={<Navigate to="menu" replace />} />
                                    <Route path="menu" element={<Menu />} />
                                    <Route path="edit" element={<EditProfile />} />
                                    <Route path="info" element={<ProfileInfo />} />
                                </Route>
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </PostProvider>
            </UserProvider>
        </AuthProvider>
    )
}