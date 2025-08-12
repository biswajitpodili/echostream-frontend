import { ThemeProvider } from "@/components/theme-provider";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="poppins-regular">
        <DashboardLayout />
      </div>
      {/* Other components can go here */}
    </ThemeProvider>
  );
}

export default App;
