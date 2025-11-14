import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1>Bienvenido al Miniblog</h1>
            <div className="">
                <p>Interactuá con otros usuarios</p>
            </div>
        </div>
    );
}