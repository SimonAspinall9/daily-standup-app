import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import StandUpItems from "./StandUpItems/Items";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import moment from "moment";
import Typography from "@mui/material/Typography";

const App = () => {
  const { isLoading, isAuthenticated, loginWithPopup } = useAuth0();

  const [selectedDate] = useState<Date>(moment().toDate());

  if (isLoading) {
    return (
      <Box
        sx={{ display: "flex", flexGrow: 1 }}
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated) {
    return <StandUpItems selectedDate={selectedDate} />;
  }

  return (
    <Box
      sx={{ display: "flex", flexGrow: 1, flexFlow: "column" }}
      alignItems="center"
      justifyContent="center"
      marginX={2}
    >
      <Typography
        variant="h5"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        marginBottom={2}
      >
        You need to be logged in to use this website :)
      </Typography>
      <Button
        variant="contained"
        sx={{ maxWidth: 250 }}
        disableElevation
        onClick={loginWithPopup}
      >
        Login
      </Button>
    </Box>
  );
};

export default App;
