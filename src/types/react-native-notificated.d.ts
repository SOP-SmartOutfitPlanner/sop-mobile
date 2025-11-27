declare module "react-native-notificated/lib/commonjs/defaultConfig/choseDefaultIcon" {
  import type { ImageSourcePropType } from "react-native";

  type NotificatedDefaultType = "success" | "error" | "warning" | "info";
  type IconVisualStyle = "color" | "monochromatic" | "no-icon";

  export function chooseDefaultIcon(
    notificationType: NotificatedDefaultType,
    darkMode: boolean,
    defaultIconType?: IconVisualStyle
  ): ImageSourcePropType | undefined;
}

declare module "react-native-notificated/lib/commonjs/defaultConfig/stylesUtils" {
  type NotificatedDefaultType = "success" | "error" | "warning" | "info";

  export function chooseDefaultAccentColor(
    notificationType: NotificatedDefaultType
  ): string | undefined;
}

declare module "react-native-notificated/lib/commonjs/defaultConfig/components/theme" {
  export const themeBase: {
    spacing: {
      xs: number;
      s: number;
      m: number;
      l: number;
      xl: number;
    };
    fontSize: {
      messageFontSize: number;
      headerFontSize: number;
    };
    borderRadius: {
      regular: number;
      rounded: number;
    };
    bgColor: {
      regular: string;
      dark: string;
    };
    fontColor: {
      regular: string;
      dark: string;
    };
    color: {
      success: string;
      error: string;
      info: string;
      warning: string;
      darkGray: string;
      lightGray: string;
      shadow: string;
    };
    fontWeight: {
      title: string;
      description: string;
    };
  };
}

