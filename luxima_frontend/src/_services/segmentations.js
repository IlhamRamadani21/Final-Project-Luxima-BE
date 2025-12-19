import API from "../_api";

export const getSegmentations = async () => {
  const {data} = await API.get('/segmentations');
  return data.data;
}