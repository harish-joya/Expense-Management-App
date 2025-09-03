import { Progress } from 'antd'
import '../styles/Analytics.css'

const Analytics = ({ allTransaction }) => {
  const categories = ['salary','tip','project','food','movie','bills','medical','fee','tax','others'];

  const totalTransaction = allTransaction.length;
  const totalIncome = allTransaction.filter(t => t.type === 'income');
  const totalExpense = allTransaction.filter(t => t.type === 'expense');
  const totalIncomePercent = (totalIncome.length / totalTransaction) * 100;
  const totalExpensePercent = (totalExpense.length / totalTransaction) * 100;

  const totalTurnover = allTransaction.reduce((acc,t) => acc + t.amount, 0);
  const totalIncomeTurnover = totalIncome.reduce((acc,t) => acc + t.amount, 0);
  const totalExpenseTurnover = totalExpense.reduce((acc,t) => acc + t.amount, 0);
  const remainingBalance = totalIncomeTurnover-totalExpenseTurnover;
  const totalIncomeTurnoverPercent = (totalIncomeTurnover / totalTurnover) * 100;
  const totalExpenseTurnoverPercent = (totalExpenseTurnover / totalTurnover) * 100;

  return (
    <div className="row m-3 g-3">

      <div className="col-12 col-md-3">
        <div className="card">
          <div className="card-header">Total Transactions : {totalTransaction}</div>
          <div className="card-body text-center">
            <h5 className='text-success'>Income : {totalIncome.length}</h5>
            <h5 className='text-danger'>Expense : {totalExpense.length}</h5>
            <Progress type='circle' strokeColor="green" percent={totalIncomePercent.toFixed(0)} />
            <Progress type='circle' strokeColor="red" percent={totalExpensePercent.toFixed(0)} />
          </div>
        </div>
      </div>

      <div className="col-12 col-md-3">
        <div className="card">
          <div className="card-header">Remaining Balance : {remainingBalance}</div>
          <div className="card-body text-center">
            <h5 className='text-success'>Income : {totalIncomeTurnover}</h5>
            <h5 className='text-danger'>Expense : {totalExpenseTurnover}</h5>
            <Progress type='circle' strokeColor="green" percent={totalIncomeTurnoverPercent.toFixed(0)} />
            <Progress type='circle' strokeColor="red" percent={totalExpenseTurnoverPercent.toFixed(0)} />
          </div>
        </div>
      </div>

      <div className="col-12 col-md-3">
        <div className="card card-category">
          <div className="card-category-header">Category Wise Income</div>
          {categories.map(category => {
            const amount = allTransaction
              .filter(t => t.type === 'income' && t.category === category)
              .reduce((acc, t) => acc + t.amount, 0);
            return (
              amount > 0 && (
                <div className="card" key={category}>
                  <div className="card-body">
                    <h5>{category}</h5>
                    <Progress percent={((amount / totalIncomeTurnover) * 100).toFixed(0)} />
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>

      <div className="col-12 col-md-3">
        <div className="card card-category">
          <div className="card-category-header">Category Wise Expense</div>
          {categories.map(category => {
            const amount = allTransaction
              .filter(t => t.type === 'expense' && t.category === category)
              .reduce((acc, t) => acc + t.amount, 0);
            return (
              amount > 0 && (
                <div className="card" key={category}>
                  <div className="card-body">
                    <h5>{category}</h5>
                    <Progress percent={((amount / totalExpenseTurnover) * 100).toFixed(0)} />
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Analytics;