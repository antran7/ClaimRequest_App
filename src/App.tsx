import "./App.css";
import ToastProvider from "./shared/components/ToastProvider";
import AppRoutes from "./shared/routes/routes";
import "animate.css/animate.min.css";
import CustomCursor from "./shared/components/CustomCursor";

function App() {
  return (
    <>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
      <CustomCursor />
    </>
  );
}

export default App;
