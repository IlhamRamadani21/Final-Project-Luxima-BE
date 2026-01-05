import API from "../_api";

export const getCart = async ()=>{
  const {data} = await API.get('/carts');
  return data.data;
}