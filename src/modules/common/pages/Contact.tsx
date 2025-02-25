import React from 'react'
import Layout from '../../../shared/layouts/Layout'
import './Contact.css'
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';

const Contact: React.FC = () => {
    return (
        <>
            <Layout>
                <div className='contact-container'>
                    <div className='contact-title'>
                        <h1>Contact our friendly team</h1>
                        <p>Let us know how we can help.</p>
                    </div>
                    <div className='contact-options'>
                        <div className='contact-box'>
                            <div className='contact-box-icon'><LiveHelpIcon /></div>
                            <h2>Chat to support</h2>
                            <p className='contact-box-p1'>We're here to help.</p>
                            <p className='contact-box-p2'>support@fptsoftware.com</p>
                        </div>
                        <div className='contact-box'>
                            <div className='contact-box-icon'><RateReviewOutlinedIcon /></div>
                            <h2>Give feedback to us</h2>
                            <p className='contact-box-p1'>Speak to our friendly team.</p>
                            <p className='contact-box-p2'>feedback@fptsoftware.com</p>
                        </div>
                        <div className='contact-box'>
                            <div className='contact-box-icon'><LocationOnOutlinedIcon /></div>
                            <h2>Visit us</h2>
                            <p className='contact-box-p1'>Visit our office HQ.</p>
                            <p className='contact-box-p2'>View on Google Maps</p>
                        </div>
                        <div className='contact-box'>
                            <div className='contact-box-icon'><PhoneIcon /></div>
                            <h2>Call us</h2>
                            <p className='contact-box-p1'>Mon-Sat from 8am to 5pm.</p>
                            <p className='contact-box-p2'>+84 (24) 7307 9999</p>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Contact
