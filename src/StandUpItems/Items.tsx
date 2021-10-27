import Grid from "@mui/material/Grid";
import moment from "moment";
import StandUpItemsList from "./ItemsList";
import { getUserData, IStandUpItem } from "./Data";
import { useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const StandUpItems = ({ selectedDate }: { selectedDate: Date }) => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [yesterday, setYesterday] = useState<IStandUpItem[]>([]);
  const [today, setToday] = useState<IStandUpItem[]>([]);
  const [blockers, setBlockers] = useState<IStandUpItem[]>([]);

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

  const removeItem = async (id: string) => {
    if (yesterday.find((d) => d._id === id)) {
      setYesterday(yesterday.filter((d) => d._id !== id));
      return;
    }

    if (today.find((d) => d._id === id)) {
      setToday(today.filter((d) => d._id !== id));
      return;
    }

    if (blockers.find((d) => d._id === id)) {
      setBlockers(blockers.filter((d) => d._id !== id));
      return;
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
    // eslint-disable-next-line
  }, []);

  return (
    <Grid container>
      <StandUpItemsList
        onItemInserted={updateData}
        onItemDeleted={removeItem}
        data={yesterday}
        type="yesterday"
      />
      <StandUpItemsList
        onItemDeleted={removeItem}
        onItemInserted={updateData}
        data={today}
        type="today"
      />
      <StandUpItemsList
        onItemDeleted={removeItem}
        onItemInserted={updateData}
        data={blockers}
        type="blocker"
      />
    </Grid>
  );
};

export default StandUpItems;
