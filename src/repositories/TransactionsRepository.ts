import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance = this.transactions.reduce(
      (acumulator: Balance, transaction: Transaction) => {
        switch (transaction.type) {
          case 'income':
            acumulator.income += transaction.value;
            break;
          case 'outcome':
            acumulator.outcome += transaction.value;
            break;
          default:
            break;
        }
        return acumulator;
      }, {
        income: 0,
        outcome: 0,
        total: 0
      }
    )
    balance.total = balance.income - balance.outcome;
    return balance;
  }

  public create( { title, type, value }:CreateTransactionDTO ): Transaction {

    const { total } = this.getBalance();

    if (type == 'outcome' && total < value) {
      throw Error('total is insuficient!');
    }
    console.log({total, value})
    const transation = new Transaction({title, type, value});

    this.transactions.push(transation);
    return transation;
  }
}

export default TransactionsRepository;
