/**
 * This file exists so the React Native Reusables CLI doctor check can
 * detect the expected root layout structure when running outside Expo Router.
 */
import "../../global.css";
import { PortalHost } from "@rn-primitives/portal";

export default function RootLayoutPortalHost() {
  return <PortalHost />;
}



