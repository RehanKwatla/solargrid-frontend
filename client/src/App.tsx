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
import SolarGridIntro from "./pages/SolarGridIntro";

function DashboardRoutes() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/overview" component={Overview} />
        <Route path="/dashboard"><Redirect to="/overview" /></Route>
        <Route path="/energy" component={Energy} />
        <Route path="/intelligence" component={Intelligence} />
        <Route path="/alerts" component={Alerts} />
        <Route path="/feature-1" component={Feature1} />
        <Route path="/fleet"><Redirect to="/feature-1" /></Route>
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function Router() { 
  return (
    <Switch>
      <Route path="/" component={SolarGridIntro} />
      <Route component={DashboardRoutes} />
    </Switch>
  ); 
}
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable={true}>
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
