import Grid from "@mui/material/Grid";
import moment from "moment";
import StandUpItemsList from "./ItemsList";
import { getUserData, IStandUpItem } from "./Data";
import { useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { MobileDatePicker } from "@mui/lab";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterMoment from "@mui/lab/AdapterMoment";

const StandUpItems = ({ selectedDate }: { selectedDate: Date }) => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [yesterday, setYesterday] = useState<IStandUpItem[]>([]);
  const [today, setToday] = useState<IStandUpItem[]>([]);
  const [blockers, setBlockers] = useState<IStandUpItem[]>([]);
  const [value, setValue] = useState<Date | null>(new Date());

  const getData = async () => {
    if (isAuthenticated && user) {
      const token = await getAccessTokenSilently();
      const userData = await getUserData(user.sub, token);
      setYesterday(
        userData.filter(
          (d) =>
            d.type === "yesterday" &&
            moment(selectedDate).isBetween(
              moment().startOf("day"),
              moment().endOf("day")
            )
        )
      );
      setToday(
        userData.filter(
          (d) =>
            d.type === "today" &&
            moment(selectedDate).isBetween(
              moment().startOf("day"),
              moment().endOf("day")
            )
        )
      );
      setBlockers(
        userData.filter(
          (d) =>
            d.type === "blocker" &&
            moment(selectedDate).isBetween(
              moment().startOf("day"),
              moment().endOf("day")
            )
        )
      );
    }
  };

  const updateData = (item: IStandUpItem) => {
    if (item.type === "yesterday") {
      setYesterday((prevState) => [...prevState, item]);
      return;
    }

    if (item.type === "today") {
      setToday((prevState) => [...prevState, item]);
      return;
    }

    if (item.type === "blocker") {
      setBlockers((prevState) => [...prevState, item]);
      return;
    }
  };

  useMemo(() => {
    getData();
  }, []);

  const handleDateChange = (newDate: Date | null) => {
    if (!newDate) {
      newDate = new Date();
    }

    setValue(newDate);
  };

  return (
    <Grid container>
      <StandUpItemsList
        onItemInserted={updateData}
        data={yesterday}
        type="yesterday"
      />
      <StandUpItemsList onItemInserted={updateData} data={today} type="today" />
      <StandUpItemsList
        onItemInserted={updateData}
        data={blockers}
        type="blocker"
      />
    </Grid>
  );
};

export default StandUpItems;
