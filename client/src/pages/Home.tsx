import { Redirect } from "wouter";

/**
 * SolarGrid Home route redirect.
 * Directs incoming entrypoints to the operational dashboard overview.
 */
export default function Home() {
  return <Redirect to="/overview" />;
}
