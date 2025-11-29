import "react";

declare module "react-native" {
  import { ComponentType, ReactElement } from "react";

  // Fix React Native components to return ReactElement instead of ReactNode
  // This makes them compatible with React 19's stricter JSX.Element type
  interface Component<P = {}> {
    (props: P): ReactElement | null;
  }
}

