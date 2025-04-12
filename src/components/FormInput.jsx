import Button from "../ui/Button";
import { useState, useRef, useActionState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../util/http.js";

export default function FormInput() {
  //const accountCtx = use(accountAndStocksContext);
  const [values, setValues] = useState({
    accounts: {},
    stocks: {},
    transactions: {},
    accountId: null,
    stockId: null,
    identifier: null,
  });

  const { data } = useQuery({
    queryKey: ["form-inputs"],
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

  const accountMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("http://localhost:5000/accounts", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Account creation failed");
      
      return res.json();
    }
  });
  
  const stockMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("http://localhost:5000/stocks", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error(" STOCK error response:", errorText);
        throw new Error("Stock creation failed");
      }
      console.log(" stock data, ",data)
      return res.json();
    }
  });
  
  const transactionMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("http://localhost:5000/transactions", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Transaction creation failed");
      console.log(" transition data, ",data)
      return res.json();
    }
  });

  /*
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ extension, data }) => {
      const res = await fetch(`http://localhost:5000/${extension}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const resData = await res.json();

      return resData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetched-list"] });

      console.log("on sucess entered");
      /**
       *     const extension = variables.extension;
       *      if (extension === "accounts") {
        setValues((prev) => {
          const updated = { ...prev, accountId: res.user_id };
       
          if (updated.stockId && updated.transactions?.type_of_transaction) {
            mutate({
              extension: "transactions",
              data: {
                ...updated.transactions,
                user_id: res.user_id,
                stock_id: updated.stockId,
              },
            });
          }
          return updated;
        });
      }

      if (extension  === "stocks") {
        setValues((prev) => {
          const updated = { ...prev, stockId: res.stock_id };
          
          if (updated.accountId && updated.transactions?.type_of_transaction) {
            mutate({
              extension: "transactions",
              data: {
                ...updated.transactions,
                user_id: updated.accountId,
                stock_id: res.stock_id,
              },
            });
          }
          return updated;
        });
      }
   

      //  refresh();
       * 
       * 
       */

  //    },

  async function signUpAction(prevFormState, formData) {
    const accountData = {
      user_full_name: formData.get("user_full_name"),
      type_of_account: formData.get("type_of_account"),
      amount: formData.get("amount"),
    };
    const stockData = {
      stock_symbol: formData.get("stock_symbol"),
      sector: formData.get("sector"),
    };

    const transData = {
      type_of_transaction: formData.get("type_of_transaction"),
      price_transacion: formData.get("price_transacion"),
    };

    //  const identifier = formData.get("buttonSubmission");

    let errors = [];
    if (
      !accountData.type_of_account ||
      accountData.type_of_account.length < 3
    ) {
      errors.push("invalid type of account");
    }
    if (!accountData.user_full_name || accountData.user_full_name.length < 5) {
      errors.push("invalid full name of account");
    }
    if (!stockData.stock_symbol) {
      errors.push("invalid stock symbol");
    }
    if (!stockData.sector) {
      errors.push("invalid sector");
    }
    if (!transData.price_transacion) {
      errors.push("invalid price transaction");
    }
    if (!transData.type_of_transaction) {
      errors.push("invalid type of transaction");
    }

    /*
    let cleanedData;


    if (identifier === "accounts") {
      cleanedData = {
        user_full_name: fD.user_full_name,
        type_of_account: fD.type_of_account,
        amount: fD.amount,
      };
    } else if (identifier === "stocks") {
      cleanedData = {
        stock_symbol: fD.stock_symbol,
        sector: fD.sector,
      };
    } else if (identifier === "transactions") {
      cleanedData = {
        type_of_transaction: fD.type_of_transaction,
        price_transacion: fD.price_transacion,
        user_id: values.accountId,
        stock_id: values.stockId,
      };
    }


    if (identifier === "transactions") {
      setValues((prev) => ({
        ...prev,
        transactions: {
          type_of_transaction: fD.type_of_transaction,
          price_transacion: fD.price_transacion,
        },
      }));
    }


*/

try{
  const accRes = await accountMutation.mutateAsync(accountData);
  if(!accRes?.user_id) throw new Error("account response missing user id")
   console.log(stockData)
  const stockRes = await stockMutation.mutateAsync(stockData);
  if(!stockRes?.stock_id) throw new Error("account response missing user id")


  await transactionMutation.mutateAsync({
    ...transData,
    user_id:accRes.user_id,
    stock_id:stockRes.stock_id
  })
}
catch(e)
{
  console.error("mutation failed   ", e.message)
}
  

    if (errors.length > 0) {
      return { errors };
    }

    return { errors: null };
  }

  const [formState, formAction, pending] = useActionState(signUpAction, {
    errors: null,
  });

  return (
    <form className="flex flex-col gap-4 w-full" action={formAction}>
      <div className="flex flex-row gap-4 justify-center px-6">
        {
          //account info
        }
        <div id="account" className="account flex flex-col gap-4">
          <input
            className="border-2 border-white rounded-md"
            autoComplete="off"
            placeholder="account name"
            name="user_full_name"
          />
          <div className="flex flex-row gap-4">
            <input
              className="border-2 border-white rounded-md"
              autoComplete="off"
              name="type_of_account"
              placeholder="account type"
            />
            <input
              className="border-2 border-white rounded-md"
              autoComplete="off"
              name="amount"
              placeholder="amount"
            />
          </div>
        </div>

        {
          //transaction
        }

        <>
          <input placeholder="type of transaction" autoComplete="off" name="type_of_transaction" />

          <input placeholder="how much" autoComplete="off" name="price_transacion" />
        </>

        {
          //stock info
        }

        <div className="stock-info flex flex-row">
          <input
          autoComplete="off"
            className="border-2 border-white rounded-md"
            name="stock_symbol"
            placeholder="stock symbol"
          />
          <input
          autoComplete="off"
            className="border-2 border-white rounded-md"
            name="sector"
            placeholder="sector"
          />
        </div>
      </div>

      <Button
        className="bg-indigo-100  text-indigo-800 px-8 cursor-pointer hover:bg-indigo-700 hover:text-indigo-100 duration-700 transition-all  p-4 rounded-lg"
        name="buttonSubmission"
        value="transactions"
        title={"Submit Finance" }
      />
    </form>
  );
}
