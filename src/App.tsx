import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import StandUpItems from "./StandUpItems/Items";
import moment from "moment";

const App = () => {
  const { isLoading, isAuthenticated } = useAuth0();

  const [selectedDate] = useState<Date>(moment().toDate());

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <StandUpItems selectedDate={selectedDate} />;
  }

  return <div>You need to be logged in to use this website :)</div>;
};

export default App;
