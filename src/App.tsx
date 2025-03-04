import "./App.css";
import ToastProvider from "./shared/components/ToastProvider";
import AppRoutes from "./shared/routes/routes";


function App() {

  return (
    <>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>

    </>
  );
}

export default App;
