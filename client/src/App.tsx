import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SolarTrackingProvider } from "./contexts/SolarTrackingContext";
import { DashboardLayout } from "./layouts/DashboardLayout";
import Alerts from "./pages/Alerts";
import Energy from "./pages/Energy";
import Feature1 from "./pages/Feature1";
import Intelligence from "./pages/Intelligence";
import Overview from "./pages/Overview";
/** Grid Atlas: root redirects to the guided overview route while every screen shares the operating shell. */
function Router() { return <DashboardLayout><Switch><Route path="/"><Redirect to="/overview" /></Route><Route path="/overview" component={Overview} /><Route path="/energy" component={Energy} /><Route path="/intelligence" component={Intelligence} /><Route path="/alerts" component={Alerts} /><Route path="/feature-1" component={Feature1} /><Route path="/fleet"><Redirect to="/feature-1" /></Route><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch></DashboardLayout>; }
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <SolarTrackingProvider>
          <TooltipProvider>
            <Toaster theme="dark" position="bottom-right" />
            <Router />
          </TooltipProvider>
        </SolarTrackingProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
