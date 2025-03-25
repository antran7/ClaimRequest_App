import React, { useState, lazy, Suspense } from "react";
import { useInView } from "react-intersection-observer";
import Layout from "../../../../shared/layouts/Layout";
import Footer from "../../../../shared/components/layoutComponent/Footer";
import HomepageTitle from "./HomePageTitle";
import { CircularProgress } from "@mui/material";

// Sử dụng React.lazy để lazy load các component
const HomepageServices = lazy(() => import("./HomePageServices"));
const HomepageQuotes = lazy(() => import("./HomePageQuotes"));
const PartnersSection = lazy(() => import("./HomePagePartners"));
const AboutUs = lazy(() => import("./HomePageIntro"));

const LazyComponent = ({ component: Component }: { component: React.FC }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <div ref={ref} className="min-h-[300px] w-full max-w-[100vw] overflow-hidden"> 
            {inView ? (
                <Suspense fallback={
                    <div className="flex justify-center items-center h-[300px]">
                        <CircularProgress size={50} />
                    </div>
                }>
                    <Component />
                </Suspense>
            ) : null}
        </div>
    );
};

const Home: React.FC = () => {
    const [isHovering] = useState(false);

    const lottieOptions = {
        src: "https://lottie.host/cf3d618d-23bd-45f0-a5ac-6297e8c30f66/S14zCVEM98.lottie",
        loop: true,
        autoplay: true,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
            progressiveLoad: true,
        },
        style: { width: "100%", height: "100%" },
        className: `w-full h-full transition-all duration-500 ${isHovering
            ? "scale-[180%] sm:scale-[160%] md:scale-[150%] lg:scale-[145%] rotate-2"
            : "scale-[175%] sm:scale-[155%] md:scale-[145%] lg:scale-[140%]"
            }`,
    };

    return (
        <>
            <Layout>
                <HomepageTitle lottieOptions={lottieOptions} />
                <LazyComponent component={AboutUs} />
                <LazyComponent component={HomepageQuotes} />
                <LazyComponent component={HomepageServices} />
                <LazyComponent component={PartnersSection} />
            </Layout>
            <Footer />
        </>
    );
};

export default Home;