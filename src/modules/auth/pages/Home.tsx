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
                    <div className="homepage-intro">
                        <div className="intro-aboutus">
                            <h2>About Us</h2>
                            <p>TrustVault Accounting is dedicated to delivering reliable accounting services to businesses, ensuring financial stability and growth. With a focus on trust and transparency, we aim to build long-lasting relationships with our clients by providing expert financial guidance and support.</p>
                        </div>
                    </div>
                    <div className="homepage-services">
                        <h2>Comprehensive Services</h2>
                        <div className="services-articles-container">
                            <div className="services-articles">
                                <div className="services-article-img">
                                    <img
                                        src="https://static.wixstatic.com/media/11062b_f0010cf224904e5383ed94bd38b873ab~mv2.jpg/v1/fill/w_470,h_295,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_f0010cf224904e5383ed94bd38b873ab~mv2.jpg"
                                    />
                                </div>
                                <div className="services-article-content">
                                    <p>Financial Statements</p>
                                    <br />
                                    <p>Our financial consulting services provide expert guidance on budgeting, financial planning, and investment strategies tailored to your business needs.</p>
                                </div>
                            </div>
                            <div className="services-articles">
                                <div className="services-article-img">
                                    <img
                                        src="https://static.wixstatic.com/media/11062b_aa4665bc130a49728ebf3c1e65dd90e6~mv2.jpg/v1/fill/w_470,h_295,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/02.jpg"
                                    />
                                </div>
                                <div className="services-article-content">
                                    <p>Tax Preparation</p>
                                    <br />
                                    <p>We specialize in tax preparation services, ensuring compliance with tax regulations and maximizing deductions to optimize your financial position.</p>
                                </div>
                            </div>
                            <div className="services-articles">
                                <div className="services-article-img">
                                    <img
                                        src="https://static.wixstatic.com/media/11062b_d8c8c150557a41fb986c6162f2556939~mv2.jpg/v1/fill/w_470,h_295,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/03.jpg"
                                    />
                                </div>
                                <div className="services-article-content">
                                    <p>Bookkeeping Services</p>
                                    <br />
                                    <p>Efficient and accurate bookkeeping services to keep your financial records organized and up-to-date, enabling informed business decisions.</p>
                                </div>
                            </div>
                            <div className="services-articles">
                                <div className="services-article-img">
                                    <img
                                        src="https://static.wixstatic.com/media/11062b_7ffbcc1b69df473a86873f09a429a709~mv2.jpg/v1/fill/w_470,h_295,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/04.jpg"
                                    />
                                </div>
                                <div className="services-article-content">
                                    <p>Financial Advising</p>
                                    <br />
                                    <p>Comprehensive audit support services to assist your business in preparing for audits and ensuring compliance with financial regulations.</p>
                                </div>
                            </div>
                        </div>
                        <h1>Being There Wherever, Whenever You Need Us</h1>
                        <div className="homepage-statistics">
                            <div className="statistics-field">
                                <div className="statistics-data-1">86</div>
                                <div className="statistics-info">Branches & Representative offices</div>
                            </div>
                            <div className="statistics-field">
                                <div className="statistics-data-2">1,100+</div>
                                <div className="statistics-info">Global Clients</div>
                            </div>
                            <div className="statistics-field">
                                <div className="statistics-data-3">33,000+</div>
                                <div className="statistics-info">Employees</div>
                            </div>
                            <div className="statistics-field">
                                <div className="statistics-data-4">30</div>
                                <div className="statistics-info">Countries & Territories</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Home;