import API from "../_api";

export const getBooks = async ()=>{
  const {data} = await API.get('/books');
  return data.data;
}

// export const createBook = async (data)=>{
//   try{
//     const response = await API.post('/books', data);
//     return response.data;
//   }catch(error){
//     console.log(error);
//     throw error;
//   }
// }

// export const showBooks = async (id) => {
//   try{
//     const {data} = await API.get(`/books/${id}`)
//     return data.data;
//   }catch(error){
//     console.log(error);
//     throw error
//   }
// }

// export const updateBook = async (id, data) => {
//   try {
//     // untuk update
//     const response = await API.put(`/books/${id}`, data); 
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating book with ID ${id}:`, error);
//     throw error;
//   }
// }
 
// export const deleteBook = async (id) => {
//   try {

//     const response = await API.delete(`/books/${id}`);
//     // cek respons sukses ato engga
//     return response.data; 
//   } catch (error) {
//     console.error(`Error deleting book with ID ${id}:`, error);
//     throw error;
//   }
// }