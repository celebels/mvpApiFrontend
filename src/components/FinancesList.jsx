import { useEffect, useState } from "react";
import fetchingData from "../util/http.js";
import LoadingScreen from "../ui/LoadingScreen";
import { useQuery } from "@tanstack/react-query";

export default function FinancesList() {
  let content;
  const {
    data: values,
    isPending,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["fetched-list"],
    queryFn: async () => {
      const { stocks, accounts, transactionMal, convertionMal, priceMal } =
        await fetchingData();

      return {
        accounts,
        stocks,
        stock_id: Object.keys(priceMal),
        stockPrice: priceMal,
        transactions: transactionMal,
        convertion: convertionMal,
      };
    },
  });

  if (isPending) {
    content = <LoadingScreen />;
  }
  if (isError) {
    content = <h2>{error.info?.message}</h2>;
  }
  let convertedAccountStocks = [];

 

  if (values) {
    
    const combinedData = values.accounts.map((account) => {
      const userTransactions = values.transactions?.[account.user_id] || [];
      const accountStocks = values.stocks.filter((stock) =>
        userTransactions.some(
          (t) => String(t.stock_id) === String(stock.stock_id)
        )
      );
  
      const stockDetails = accountStocks.map((stock) => {
        const transaction = userTransactions.find(
          (trans) => String(trans.stock_id) === String(stock.stock_id)
        );
        const conversionValue =
          values.conversions?.[account.user_id]?.[stock.stock_id]?.converted_value;
  
        return {
          stock_symbol: stock.stock_symbol,
          type_of_transaction: transaction?.type_of_transaction || "-",
          price_transacion : transaction?.price_transacion  || "-",
          conversion: conversionValue || null,
        };
      });
  
      return {
        user_id: account.user_id,
        user_full_name: account.user_full_name,
        type_of_account: account.type_of_account,
        stocks: stockDetails,
      };
    });


    content = (
      <div className="grid grid-cols-5 text-white gap-2 text-left">    
 
      {[...values.accounts].reverse().map((a) => {
        const mainStock = values.stocks.find((s) =>
          values.transactions?.[a.user_id]?.some((t) => String(t.stock_id) === String(s.stock_id))
        );
    
        const transaction = mainStock
          ? values.transactions?.[a.user_id]?.find((t) => String(t.stock_id) === String(mainStock.stock_id))
          : null;
    
        const convertion = mainStock
          ? values.convertion?.[a.user_id]?.[mainStock.stock_id]
          : null;
          
    
        return (
          <div key={a.user_id} className="flex flex-col rounded-sm p-6 bg-indigo-100 border-indigo-200 shadow-sm border-2 text-indigo-700  justify-start gap-4">
            <span className="font-bold"><span className="text-sm italic text-zinc-500 font-light">account name</span> {a.user_full_name}</span>
            <span className="font-bold"><span className="text-sm italic text-zinc-500 font-light">type of accoint</span> {a.type_of_account}</span> 
            <div className="bg-indigo-700 p-6 rounded-md text-indigo-100 flex-col flex">
            <span className="font-bold"><span className="text-sm font-light">symbol </span>{mainStock ? `${mainStock.stock_symbol}:${transaction?.price_transacion ?? "-"}` : "-"}</span>
            <span  className="font-bold"><span className="text-sm font-light">stock price </span>{mainStock && transaction ? `${transaction.price_transacion} USD` : "-"}</span>
            <span className="font-bold"><span className="text-sm font-light" >transaction </span>{transaction ? transaction.type_of_transaction : "-"}</span>
            <span className="font-bold "><span className="text-sm font-light" >convertion </span>{convertion ? `${convertion.converted_value?.toFixed(2)} USD` : "-"}</span>
         
              </div>           
             </div>
        );
      })}
    </div>
    );
  }

  return <>{content}</>;
}

/**
 * 
 *   <div className="flex flex-col">
        {values.accounts &&
          values.accounts.map((a) => {
            values.stock_id.map((s,index)=>{
            convertedAccountStocks.push({userId: a.user_id, stockId:s,value:values.convertion?.[a.user_id]?.[s]})
              
            })
           

           return <li key={a[0]}>{a.user_full_name}</li>
})}
      </div>
      <div className="flex flex-col">
        {values.accounts &&
          values.accounts.map((a) => (
            <li key={a[0]}>{a.type_of_account}</li>
          ))}
      </div>
      {!values.accounts && <p>nothing to see here</p>}
      <div className="flex flex-col">
        {values.stocks &&
          values.stocks.map((a) => <li key={a[0]}>{a.stock_symbol}</li>)}
      </div>
      <div className="flex flex-col">
        {values.stockPrice &&
          Object.entries(values.stockPrice).map(([id, price]) => (
            <li key={id}>{price}</li>
          ))}
      </div>
      <div className="flex flex-col">
        {values.transactions &&
          Object.entries(values.transactions).map(([userId, transArray]) =>
            transArray.map((t, index) => (
              <li key={index}>
                {t.price_transacion === "buy" ? "+" : "-"}{" "}
                {t.price_transacion}
              </li>
            ))
          )}
      </div>
      <div className="flex flex-col">
        {values.convertion &&
          Object.entries(values.convertion).map(([id, stockObj]) =>
            Object.entries(stockObj).map(([stockId, data]) => {
              const accountName = values.accounts.find(
                (a) => String(a.user_id) === id
              );
              const stockName = values.stocks.find(
                (a) => String(a.stock_id) == stockId
              );
             
              // 
              const foundVal = convertedAccountStocks.find((myId)=>myId.userId === id && myId.stockId === stockId);
              const value = foundVal?.value?.converted_value;

              if (foundVal.value)
              {
                return (
                  <li key={`${foundVal.userId}-${foundVal.stockId}`}>
                    {value ? `${accountName.user_full_name} - ${stockName.stock_symbol}` : ""} :
                    {value ? `${value.toFixed(2)} USD`: ""}
                  </li>
                );

              }
                

              
              
            })
          )}
      </div>
      
 * 
 * 
 */
