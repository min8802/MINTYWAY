import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const colors = {
  boxColor: "#171923", // 900
  backgroundColor: "#1a202c", // 800
  hoverColor: "#2D3748", // 700
};

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors,
  fonts: {
    heading: "PFStardust, sans-serif",
    body: "PFStardust, sans-serif",
  },
  styles: {
    global: {
      "*": {
        // fontStyle: "italic",
      },
    },
  },
});

export default theme;
