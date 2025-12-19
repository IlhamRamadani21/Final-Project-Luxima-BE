import API from "../_api";

export const getCategories = async () => {
  const {data} = await API.get('/genres');
  return data.data;
}