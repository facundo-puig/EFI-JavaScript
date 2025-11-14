import { useRef } from 'react';
import { Routes, Route } from "react-router-dom";
import { Toast } from 'primereact/toast';
import Home from "./components/Home";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm"
import PostList from "./components/PostList"
import PostEdit from "./components/PostEdit";
import Admin from "./components/Admin";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile"
import PostDetail from "./components/PostDetail";
import { ToastContext } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  const toast = useRef(null);

  return (
    <ToastContext.Provider value={toast}>
      <Toast ref={toast} />
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registrarse" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/posts/:id/edit" element={<PostEdit />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AuthProvider>
    </ToastContext.Provider>
  );
}