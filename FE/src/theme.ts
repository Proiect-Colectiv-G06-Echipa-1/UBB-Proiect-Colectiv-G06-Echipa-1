import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          width: "208px",
          height: "35px",
          borderRadius: "24px",
          paddingTop: "8px",
          paddingBottom: "8px",
          color: "white",
          textTransform: "none",
          fontDecoration: "none",
          fontFamily: "Inter",
          fontStyle: "Italic",
          alignItems: "center",
          fontSize: "14px",
          textAlign: "center",
        },
      },
    },
  },
});

export default theme;
