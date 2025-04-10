import { useState } from 'react';
import './App.css';
import FormInput from './components/FormInput.jsx';
import { fetchDatas } from './store/account-and-stock-context.js';
import FinancesList from './components/FinancesList.jsx';
import {  QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './util/http.js';



function App() {

  
  const [enteredVal, setEnteredVal]=useState({
    account:{
      user_full_name:'',
      type_of_account:'',
        amount:0.0
    },
    stock:{
        symbol:'',
        sector:''
    }
})
const {account,stock} = enteredVal;
 
  const ctxVal={
    account,
    stock,
    fetchDatas,
    addToState:setEnteredVal,
  }

  

  return (
   
    <QueryClientProvider client={queryClient}>
    <div className="h-full flex flex-col justify-center bg-gradient ">
      <div className=" flex flex-col gap-24  items-center">
      <div className='border-4 h-auto w-auto flex justify-center p-32 rounded-md border-white'>
      <FormInput />
        </div>
         <div className='border-4 h-auto w-auto p-16 rounded-md border-white'>
     
         <FinancesList />
      
   
 
     
     

      
      </div>
      
    </div>
    </div>
      </QueryClientProvider>
    
  );
}

export default App;

/*0<accountAndStocksContext.Provider value={ctxVal}>
   
   
    <div className=" flex flex-col gap-24  items-center">
      <div className='border-4 h-auto w-auto flex justify-center p-32 rounded-md border-white'>
      <FormInput />
        </div>



      <div className='border-4 h-auto w-auto p-16 rounded-md border-white'>
      <ul className='flex gap-32 flex-row justify-between text-white'> 
        <li>account name</li>
        <li>type account</li>
        <li>stock symbol</li>
        <li>stock  price</li>
        <li> transactions </li>
        <li>stock convertion (USD)</li>
      </ul>
      <ul>
      <FinancesList />
      </ul>
     

      
      </div>
      
    </div>
    </div>
    </accountAndStocksContext.Provider> 
    
    


    
    
    */
