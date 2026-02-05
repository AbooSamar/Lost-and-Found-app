import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from ".//ProtectedRoute";

// Layout & Pages
import Navbar from "../components/layout/Navbar";
import Landing from "../components/pages/Landing";
import Login from "../components/pages/Login";
import Signup from "../components/pages/Signup";
import AllPosts from "../components/pages/AllPosts";
import Details from "../components/pages/Details";
import Lost from "../components/pages/Lost";
import Found from "../components/pages/Found";
import Resolved from "../components/pages/Resolved";
import MyPosts from "../components/pages/MyPosts";
import CreatePost from "../components/pages/CreatePost";
import Profile from "../components/pages/Profile";
import Connect from "../components/pages/Connect";
import EditPost from "../components/pages/EditPost";

// This wrapper component handles the logic
const AppContent = () => {
  const location = useLocation();

  // Define paths where the Navbar should NOT appear
  const hideNavbarPaths = ["/", "/login", "/signup", "/connect"];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/connect" element={<Connect />} />

        <Route
          path="/all-posts"
          element={
            <ProtectedRoute>
              <AllPosts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/details/:id"
          element={
            <ProtectedRoute>
              <Details />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lost"
          element={
            <ProtectedRoute>
              <Lost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/found"
          element={
            <ProtectedRoute>
              <Found />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resolved"
          element={
            <ProtectedRoute>
              <Resolved />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-posts"
          element={
            <ProtectedRoute>
              <MyPosts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-post/:id"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
 
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default AppRoutes;
