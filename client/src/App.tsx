import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SolarTrackingProvider } from "./contexts/SolarTrackingContext";
import { DashboardDataProvider } from "./contexts/DashboardDataContext";
import { DashboardLayout } from "./layouts/DashboardLayout";
import Alerts from "./pages/Alerts";
import CriticalLoads from "./pages/CriticalLoads";
import Energy from "./pages/Energy";
import EnergySharing from "./pages/EnergySharing";
import Feature1 from "./pages/Feature1";
import Intelligence from "./pages/Intelligence";
import Overview from "./pages/Overview";
import DepartmentsRooms from "./pages/DepartmentsRooms";
import Settings from "./pages/Settings";
import SolarGridIntro from "./pages/SolarGridIntro";
import LandingPage from "./pages/LandingPage";
import { usePageTitle } from "./hooks/usePageTitle";

function DashboardRoutes() {
  return (
    <DashboardDataProvider>
      <DashboardLayout>
        <Switch>
          <Route path="/" component={Overview} />
          <Route path="/overview" component={Overview} />
          <Route path="/dashboard"><Redirect to="/overview" /></Route>
          <Route path="/home"><Redirect to="/overview" /></Route>
          <Route path="/departments" component={DepartmentsRooms} />
          <Route path="/rooms"><Redirect to="/departments" /></Route>
          <Route path="/energy" component={Energy} />
          <Route path="/energy-sharing" component={EnergySharing} />
          <Route path="/sharing"><Redirect to="/energy-sharing" /></Route>
          <Route path="/critical-loads" component={CriticalLoads} />
          <Route path="/loads"><Redirect to="/critical-loads" /></Route>
          <Route path="/intelligence" component={Intelligence} />
          <Route path="/alerts" component={Alerts} />
          <Route path="/metering" component={Feature1} />
          <Route path="/feature-1"><Redirect to="/metering" /></Route>
          <Route path="/fleet"><Redirect to="/metering" /></Route>
          <Route path="/settings" component={Settings} />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </DashboardLayout>
    </DashboardDataProvider>
  );
}

function Router() {
  usePageTitle();

  return (
    <Switch>
      <Route path="/landing" component={LandingPage} />
      <Route path="/intro" component={SolarGridIntro} />
      <Route path="/twin" component={SolarGridIntro} />
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
            <Toaster position="bottom-right" richColors />
            <Router />
          </TooltipProvider>
        </SolarTrackingProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
