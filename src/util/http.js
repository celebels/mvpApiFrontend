import { QueryClient } from "@tanstack/react-query";
import { fetchDatas } from "../store/account-and-stock-context";

export const queryClient = new QueryClient();

export default async function fetchingData() {
  const accounts = await fetchDatas("accounts");

  const stocks = await fetchDatas("stocks");
  const convertionMal = {};

  const priceMal = {};
  /*
  await Promise.all(
    stocks.map(async (s) => {
      const stock_price = await fetchDatas(`stocks/${s.stock_id}/price`);
      priceMal[s.stock_id] = stock_price.stock_price;

      await Promise.all(
        accounts.map(async (a) => {
          
          try{
            const transaction = await fetchDatas(`transactions/${a.user_id}`);
            return [a.user_id,trans];

          }
          catch {
            return[a.user_id, null];
          }
          

          if(!transaction || transaction.length === 0)
          {
            console.log("EMPTY TRANSACTIONS")
            return;
          }

          try {
            const convertionTrans = await fetchDatas(
              `transactions/${a.user_id}/${s.stock_id}/convertions`
            );
            if (!convertionMal[a.user_id]) {
              convertionMal[a.user_id] = {};
            }

            convertionMal[a.user_id][s.stock_id] = convertionTrans;
          } catch (e) {
            console.warn(
              `❌ No convertion found for user ${a.user_id} and stock ${s.stock_id}`
            );
          }

          transactionMal[a.user_id] = transaction;
           
        })
      );
    })
  );
  */

  const transactionsEntries = await Promise.all(
    accounts.map(async (a) => {
      const t = await fetchDatas(`transactions/${a.user_id}`);
      return [a.user_id, t];
    })
  );

  const transactionMal = Object.fromEntries(transactionsEntries);

  await Promise.all(
    stocks.map((s) => 
      Promise.all(
        accounts.map(async (a) => {
          
          try {
            const convertionTrans = await fetchDatas(
              `transactions/${a.user_id}/${s.stock_id}/convertions`
            );
  
            if (!convertionMal[a.user_id]) {
              convertionMal[a.user_id] = {};
            }
            convertionMal[a.user_id][s.stock_id] = convertionTrans;
            if(convertionTrans)
            {
              console.log("working convertionTrans", convertionTrans)
            }
           
          } catch (e) {
            console.warn(e.info);
          }
        })
      )

    )
  );


  return { stocks, accounts, transactionMal, convertionMal, priceMal };
}
