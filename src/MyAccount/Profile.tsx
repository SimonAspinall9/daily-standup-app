import { useAuth0 } from "@auth0/auth0-react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const Profile = () => {
  const { isLoading, user } = useAuth0();

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

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Card
        sx={{ maxWidth: 345 }}
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexFlow: "column",
          display: "flex",
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              alt={user?.name}
              src={user?.picture}
              sx={{ width: 140, height: 140 }}
            />
          }
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="p">
            {user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
