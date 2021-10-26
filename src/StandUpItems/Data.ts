import axios from "axios";
import config from "../config.json";

const myAxios = axios.create({ baseURL: config.baseApiUrl });

export interface IStandUpItem {
  _id?: string;
  title: string;
  description?: string;
  dateCreated?: Date;
  isActive?: boolean;
  userId: String;
  type: "yesterday" | "today" | "blocker";
}

export const getUserData = async (
  userId: string | undefined,
  token: string
) => {
  const resp = await myAxios.get<IStandUpItem[]>(`standups/${userId}/today`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (resp && resp.status === 200 && resp.data) {
    return resp.data;
  }

  return [];
};

export const addItem = async (
  token: string,
  item: IStandUpItem
): Promise<IStandUpItem> => {
  console.log(item);
  const resp = await myAxios.post<IStandUpItem>("standups/", item, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (resp && (resp.status === 200 || resp.status === 201) && resp.data) {
    return resp.data;
  }

  return item;
};
