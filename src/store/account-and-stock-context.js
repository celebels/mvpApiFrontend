import { createContext } from "react";

export const accountAndStocksContext = createContext(
   { account:{
        name:'',
        accountType:'',
        ammount:0.0
    },
    stock:{
        symbol:'',
        sector:'',
        stock_price:''
    },
    fetchDatas,
   
    updateList:()=>{},
    addToState:()=>{}

  
}
);

export  async function  fetchDatas(extension)
{
    
    const url = "http://localhost:5000/"
    const res = await fetch(url+extension)
    

    if(!res.ok)
    {
        throw new Error(res.status)
    }

    const resData= await res.json();
   
    return resData;

}



