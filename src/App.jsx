import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm"
import PostList from "./components/PostList"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registrarse" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/posts" element={<PostList />} />
    </Routes>
  );
}
