'use client';
import { Archive, DollarSignIcon, User,Box } from 'lucide-react';
import React from 'react'
import CountUp from 'react-countup';
const DashboardTopStats = ({ stats = {} }) => {
  const { revenue = 0, ordersCount = 0, usersCount = 0, productsCount = 0 } = stats;
  return (
    <div className="stats bg-base-100 w-full  stats-vertical md:stats-horizontal overflow-hidden shadow">
      
  <div className="stat ">
    <div className="stat-figure  bg-base-300 rounded-md  p-2">
      <DollarSignIcon className='w-8 h-8   text-[var(--primary)]'/>
    </div>
    <div className=" pb-1  ">Revenue</div>
    <div className="stat-value">
      $<CountUp start={0} end={revenue} duration={2.75} decimals={2}></CountUp>
      </div>
   
  </div>

  <div className="stat">
   
       <div className="stat-figure  bg-base-300 rounded-md  p-2">
      <Box className='w-8 h-8 text-[var(--primary)]'/>
  
    </div>
    <div className="pb-1">Orders</div>
    <div className="stat-value">
        <CountUp start={0} end={ordersCount} duration={2.75}></CountUp>
    </div>
    
  </div>
   

<div className="stat">
    <div className="stat-figure ">
      <div className="stat-figure  bg-base-300 rounded-md  p-2">
      <User className='w-8 h-8   text-[var(--primary)]'/>
    </div>
    </div>
    <div className="pb-1">Users</div>
    <div className="stat-value">
        <CountUp start={0} end={usersCount} duration={2.75}></CountUp>
    </div>
   
  </div>

  <div className="stat">
    <div className="stat-figure text-base-content ">
       <div className="stat-figure  bg-base-300 rounded-md p-2">
      <Archive className='w-8 h-8   text-[var(--primary)]'/>
    </div>
    </div>
    <div className="pb-1">Products</div>
    <div className="stat-value">
        <CountUp start={0} end={productsCount} duration={2.75}></CountUp>
    </div>
   
  </div>
  {/* </div> */}
</div>
  )
}

export default DashboardTopStats