import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LottieOptions {
    loop: boolean;
    autoplay: boolean;
    animationData?: any;
}

const HomepageTitle = ({ lottieOptions }: { lottieOptions: LottieOptions }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center mt-12 mb-96">
            <h2 className="text-4xl font-bold">Financial Services You Can Trust</h2>
            <p className="text-lg">Delivering trusted accounting services to businesses,</p>
            <p className="text-lg">Focusing on reliability and professional financial support.</p>
            <Button
                className="border border-black rounded-full text-sm text-black px-8 py-2 mt-8 transition-all duration-400 hover:bg-black hover:text-white"
                variant="outlined"
                onClick={() => navigate('/contact')}
            >
                Contact Us
            </Button>
            
            <div className="w-full lg:w-1/2 flex justify-center items-center order-1 lg:order-2 mt-10 sm:mt-16 md:mt-0">
                <div className="relative top-15 w-[250px] sm:w-[300px] md:w-[400px] lg:w-[600px] xl:w-[700px]">
                    <DotLottieReact {...lottieOptions} />
                </div>
            </div>
        </div>
    );
};

export default HomepageTitle;