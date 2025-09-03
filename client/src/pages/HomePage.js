import { useState, useEffect } from 'react'
import { Form, Input, message, Modal, Select, Table, DatePicker } from 'antd'
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import axios from 'axios'
import moment from 'moment'
import Analytics from '../components/Analytics'
import '../styles/Homepage.css'
const { RangePicker } = DatePicker

const HomePage = () => {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [allTransaction, setAllTransaction] = useState([])
  const [frequency, setFrequency] = useState('all')
  const [selectedDate, setSelectedDate] = useState([])
  const [type, setType] = useState('all')
  const [viewData, setViewData] = useState('table')
  const [editable, setEditable] = useState(null)

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>,
      align: "center",
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      align: "center",
      render: (text, record) => (
        <span className={record.type === 'income' ? 'income-cell' : 'expense-cell'}>
          {text} ₹
        </span>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      align: "center",
      render: (text) => (
        <span className={`tag ${text === 'income' ? 'income-cell' : 'expense-cell'}`}>
          {text.charAt(0).toUpperCase() + text.slice(1)}
        </span>
      )
    },
    { 
      title: 'Category', 
      dataIndex: 'category',
      align: "center",
      render: text => <span className="capitalize">{text}</span>
    },
    { 
      title: 'Discription', 
      align: "center",
      dataIndex: 'discription' 
    },
    {
      title: 'Actions',
      align: "center",
      render: (text, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <EditOutlined
            onClick={() => {
              setEditable(record)
              setShowModal(true)
            }}
          />
          <DeleteOutlined
            onClick={() => handleDelete(record)}
          />
        </div>
      )
    }
  ]

  const getAllTransaction = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);

      const res = await axios.post(
        "/api/v1/user/transactions/get-transaction",
        {
          userid: user.user._id,
          frequency,
          selectedDate,
          type,
        }
      );

      setLoading(false);

      const sortedTransactions = res.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setAllTransaction(sortedTransactions);
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("Fetch issue with transaction");
    }
  };


  useEffect(() => {
    getAllTransaction()
  }, [frequency, selectedDate, type])

  const handleDelete = async (record) => {
    try {
      setLoading(true)
      await axios.post("/api/v1/user/transactions/delete-transaction", {
        transactionId: record._id
      })
      setLoading(false)
      message.success('Transaction Deleted')
      getAllTransaction()
    } catch (error) {
      setLoading(false)
      message.error('Unable to Delete')
      console.log(error)
    }
  }

  // Add/Edit transaction
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      setLoading(true)
      if (editable) {
        await axios.post("/api/v1/user/transactions/edit-transaction", {
          payload: { ...values, userid: user.user._id },
          transactionId: editable._id
        })
        message.success('Transaction Updated Successfully')
      } else {
        await axios.post("/api/v1/user/transactions/add-transaction", {
          ...values, userid: user.user._id
        })
        message.success('Transaction Added Successfully')
      }
      setShowModal(false)
      setEditable(null)
      setLoading(false)
      getAllTransaction()
    } catch (error) {
      setLoading(false)
      message.error('Failed to add/edit transaction')
      console.log(error)
    }
  }

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value='all'>All</Select.Option>
            <Select.Option value='7'>Last 1 Week</Select.Option>
            <Select.Option value='30'>Last 1 Month</Select.Option>
            <Select.Option value='365'>Last 1 Year</Select.Option>
            <Select.Option value='custom'>Custom</Select.Option>
          </Select>
          {frequency === 'custom' && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedDate(values)}
            />
          )}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value='all'>All</Select.Option>
            <Select.Option value='income'>Income</Select.Option>
            <Select.Option value='expense'>Expense</Select.Option>
          </Select>
        </div>
        <div className="switch-icon mx-2">
          <UnorderedListOutlined
            className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`}
            onClick={() => setViewData('table')}
          />
          <AreaChartOutlined
            className={`mx-2 ${viewData === 'analytics' ? 'active-icon' : 'inactive-icon'}`}
            onClick={() => setViewData('analytics')}
          />
        </div>
        <button
          className='btn btn-primary'
          onClick={() => setShowModal(true)}
        >
          Add New+
        </button>
      </div>

      <div className="content">
        {viewData === 'table' ?
          <Table columns={columns} dataSource={allTransaction} pagination={{ pageSize: 8 }}
  rowKey="_id"/> :
          <Analytics allTransaction={allTransaction} />}
      </div>

      <Modal
        title={editable ? 'Edit Transaction' : 'Add Transaction'}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
      >
        <Form layout='vertical' onFinish={handleSubmit} initialValues={editable}>
          <Form.Item label='Amount' name='amount'>
            <Input type='text' />
          </Form.Item>

          <Form.Item label='Type' name='type'>
            <Select>
              <Select.Option value='income'>Income</Select.Option>
              <Select.Option value='expense'>Expense</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label='Category' name='category'>
            <Select>
              <Select.Option value='salary'>Salary</Select.Option>
              <Select.Option value='tip'>Tip</Select.Option>
              <Select.Option value='project'>Project</Select.Option>
              <Select.Option value='food'>Food</Select.Option>
              <Select.Option value='movie'>Movie</Select.Option>
              <Select.Option value='bills'>Bills</Select.Option>
              <Select.Option value='medical'>Medical</Select.Option>
              <Select.Option value='fee'>Fee</Select.Option>
              <Select.Option value='tax'>Tax</Select.Option>
              <Select.Option value='other'>Others</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label='Discription' name='discription'>
            <Input type='text' />
          </Form.Item>

          <Form.Item label='Date' name='date'>
            <Input type='date' />
          </Form.Item>

          <div className="d-flex justify-content-end">
            <button type='submit' className='btn btn-secondary'>SAVE</button>
          </div>
        </Form>
      </Modal>
    </Layout>
  )
}

export default HomePage