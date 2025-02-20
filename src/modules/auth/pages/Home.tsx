import React from "react";
import Layout from "../../../shared/layouts/Layout";
import './Home.css';
import { Button } from "antd";

const Home: React.FC = () => {
    return (
        <>
            <Layout>
                <div className="homepage-container">
                    <div className="homepage-title">
                        <h2>Financial Services You Can Trust</h2>
                        <p>Delivering trusted accounting services to businesses,</p>
                        <p>Focusing on reliability and professional financial support.</p>
                        <Button className="homepage-title-button">Contact Us</Button>
                    </div>
                </div>
                <div className="homepage-services">
                    <h2>Comprehensive Services</h2>
                    <div className="homepage-services-articles">
                        <div>
                            <div></div>
                            <div></div>
                        </div>
                        <div>
                            <div></div>
                            <div></div>
                        </div>
                        <div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Home;