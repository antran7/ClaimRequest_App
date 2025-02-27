import Layout from "../../../shared/layouts/Layout"

const About = () => {
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
    <Layout>
     <div className="flex  h-screen items-center  bg-[#F5EFE6]">
      <div className="max-w-6xl p-10 grid grid-cols-4 gap-6 ">
        {/* Side Text */}
        <div className=" flex items-center ">
        <h1 className="!text-[100px]  font-bold rotate-[-90deg] ">
  ABOUT
</h1>
        </div>

        {/* Main Content */}
        <div className="col-span-2 ">
          <h2 className="text-xl text-gray-700 font-serif">Hi! Our name is FinancePro and we provide trusted financial services.</h2>
          <p className="text-gray-600 mt-4">
            We specialize in delivering reliable accounting solutions for businesses of all sizes. 
            Our goal is to provide professional and comprehensive financial support, ensuring 
            stability and growth for your company.
          </p>
          <p className="text-gray-600 mt-2">
            With a strong foundation in finance and years of expertise, we aim to help businesses 
            navigate complex financial landscapes with confidence and ease.
          </p>

          
        </div>
        <div className="col-span-1 flex justify-center items-center">
        <img 
          src="https://fpt.com/Images/images/tin-tuc-2021/toa-nha/Toan-canh-toa-nha.jpg" 
          className="w-full h-full object-cover rounded-lg shadow-lg "
        />
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
    </Layout>
  )
}

export default About