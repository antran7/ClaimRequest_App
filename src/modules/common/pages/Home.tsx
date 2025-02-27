import React from "react";
import Layout from "../../../shared/layouts/Layout";
import './Home.css';
import { Box, Button } from "@mui/material";
import EastIcon from '@mui/icons-material/East';
import { useNavigate } from "react-router";

const Home: React.FC = () => {
    const navigate = useNavigate();

    const itemData = [
        {
            img: 'https://fpt.com/Images/images/tin-tuc-2021/toa-nha/Toan-canh-toa-nha.jpg',
            title: 'Camera',
            height: '550px',
        },
        {
            img: 'https://funix.edu.vn/wp-content/uploads/2023/09/fsoft.jpg',
            title: 'Burger',
            height: '400px',
        },
        {
            img: 'https://channel.mediacdn.vn/428462621602512896/2023/8/17/photo-2-1692246092193179071629.jpg',
            title: 'Coffee',
            height: '550px',
        },
        {
            img: 'https://static.wixstatic.com/media/84770f_75e268e4225a4dca8ca0bbfc3c5b4042~mv2.jpg/v1/fill/w_515,h_460,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/84770f_75e268e4225a4dca8ca0bbfc3c5b4042~mv2.jpg',
            title: 'Breakfast',
            height: '400px',
        },
    ];

    const partners = [
        { name: "Adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Adobe_Corporate_logo.svg" },
        { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
        { name: "Dataiku", logo: "https://upload.wikimedia.org/wikipedia/fr/9/91/Dataiku_logo.png" },
        { name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" },
        { name: "LandingAI", logo: "https://app.circle.so/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCS3BXeEFJPSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--2c1eb9632ec3537b7353b368867823a414174b27/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNITUdrQ09BUTZDbk5oZG1WeWV3WTZDbk4wY21sd1ZBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--cfda350175ba87e768b4e96e935a8171fc679bec/LandingAI-logo-stacked-color-RGB.png" },
        { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
        { name: "NVIDIA", logo: "https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg" },
        { name: "OutSystems", logo: "https://upload.wikimedia.org/wikipedia/commons/8/82/OS-logo-color_500x108.png" },
        { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
        { name: "SAP", logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg" },
        { name: "ServiceNow", logo: "https://mma.prnewswire.com/media/1316642/ServiceNow_Logo.jpg?p=facebook" },
        { name: "Sitecore", logo: "https://seeklogo.com/images/S/sitecore-logo-D5387ED3C7-seeklogo.com.png" }
    ];



    return (
        <>
            <Layout>
                <div className="homepage-container">
                    <div className="homepage-title">
                        <h2>Financial Services You Can Trust</h2>
                        <p>Delivering trusted accounting services to businesses,</p>
                        <p>Focusing on reliability and professional financial support.</p>
                        <Button
                            className="homepage-title-button"
                            variant="outlined"
                            onClick={() => navigate('/contact')}
                        >
                            Contact Us
                        </Button>
                    </div>
                    <div className="homepage-intro">
                        <Box className="intro-image"
                            sx={{
                                display: "flex",
                                justifyContent: "space-evenly",
                                alignItems: "flex-end",
                                gap: 2,
                                overflowX: "auto",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {itemData.map((item) => (
                                <Box key={item.img} component="img"
                                    src={item.img}
                                    alt={item.title}
                                    sx={{ width: 450, height: `${item.height}`, objectFit: "cover" }}
                                />
                            ))}
                        </Box>
                        <div className="intro-aboutus">
                            <div className="aboutus-leftside">
                                <h2>ABOUT US
                                    <EastIcon style={{ fontSize: '50px', marginLeft: '20px' }} />
                                </h2>
                                <p>
                                    Our platform is designed to streamline payroll processing and attendance management for FPT employees, ensuring accuracy,
                                    efficiency, and transparency. We simplify the entire workflow, from tracking working hours to approving and processing payments,
                                    reducing administrative burdens and minimizing errors.
                                    <br />
                                    With an intuitive and user-friendly interface, employees can easily submit attendance records, request adjustments,
                                    and track payment statuses in real time. Meanwhile, managers can efficiently review and approve requests,
                                    ensuring that payroll calculations are accurate and compliant with company policies.
                                    We prioritize automation and efficiency, integrating smart features that help businesses optimize timekeeping,
                                    salary calculations, and reporting.
                                </p>
                            </div>
                            <Box
                                className="aboutus-rightside"
                                sx={{
                                    backgroundImage: "url('https://career.fpt-software.com/wp-content/themes/jobcareer/fpt_landing_page/landing-fpt-affiliate-2024/assets/img/slider-img.jpg')",
                                    backgroundAttachment: "fixed",
                                    backgroundPosition: "center",
                                    backgroundSize: "cover",
                                    height: "100%",
                                }}
                            />
                        </div>
                    </div>

                    <div className="homepage-quotes" >
                        <div className="quotes-leftside">
                            <img
                                src="https://ictv.1cdn.vn/2023/04/26/chu-tich-hdqt-fpt-truong-gia-binh.jpg"
                            />
                        </div>
                        <div className="quotes-rightside">
                            <p className="quotes-content">
                                Việt Nam đã thành lập các tập đoàn lớn, nhưng câu hỏi đặt ra là
                                chúng ta có chung sức để làm những việc lớn hơn nữa không?
                                <b>
                                    Bài học lịch sử trả lời rằng, chỉ khi nào đối diện thử thách lớn thì chúng
                                    ta mới có thể chung tay, chung sức đồng lòng.
                                </b>
                                <div className="quotes-divider"></div>
                                <p className="quotes-quoter">
                                    Doanh nhân <b>TRƯƠNG GIA BÌNH</b>
                                    <br />
                                    <i>Chủ tịch FPT</i>
                                </p>
                            </p>
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

                    <div className="homepage-partners">
                        <h1>Our Partners & Alliances</h1>
                        <p>We partnered with global leaders to drive innovative technology solutions with excellence</p>
                        <div className="partners-container">
                            {partners.map((partner, index) => (
                                <div
                                    key={index}
                                    className="partners-logo"
                                >
                                    <img src={partner.logo} alt={partner.name} draggable='false' width='100px' />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Home;