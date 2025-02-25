import { useEffect, useState } from "react";
import loading from "../../assets/loading.gif";
import './LoadingScreen.css'

const LoadingScreen = () => {
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setFadeIn(true);
        }, 1500);
    }, []);

    return (
        <div className="loading-container">
            <img src={loading} alt="Loading..." className="loading-img" />
            <h3 className={`loading-text ${fadeIn ? "fade-in" : ""}`}>
                Please wait a second
            </h3>
        </div>
    );
};

export default LoadingScreen;
