
/**
 * 
 *  
    transaction_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('accounts.user_id'), nullable=False)
    stock_id = db.Column(db.Integer, db.ForeignKey('stocks.stock_id'), nullable=False)
    type_of_transaction = db.Column(db.String(3), unique=False, nullable=False)
    price_transacion = db.Column(db.Float(), unique=False, nullable=False)
    
 */

    export default function TransactionInfo({transaction, onChange}){
        function handleChange(e)
        {
          const {name} = e.target;
          const typeValue = e.target.value;
          onChange({...transaction, [name]:typeValue})

        }

        return(
           
        );
    }