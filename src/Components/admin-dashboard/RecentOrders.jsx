import React from 'react'
import OrdersTable from './OrdersTable'

const RecentOrders = ({ orders = [] }) => {
  return (
   <div className="w-full bg-base-100 rounded-xl overflow-x-auto shadow-lg p-4 lg:p-6 mb-20">
    <h3 className='text-lg font-semibold mb-6'>Recent Orders</h3>
    <OrdersTable orders={orders}/>
   </div>
  )
}

export default RecentOrders