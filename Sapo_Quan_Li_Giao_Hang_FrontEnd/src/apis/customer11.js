import axiosService from '../utils/axoisService';
export const apifetchListCustomer = (page,limit,name) => {
    return axiosService.get(`http://localhost:8080/api/customers?page=`+page+`&limit=`+limit+`&name=`+name+``);
};

export const apiaddCustomer = (data) => {
    return axiosService.post(
      `http://localhost:8080/api/customers/`,
      data,
    )
 };