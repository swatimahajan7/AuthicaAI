import React from 'react'
import Navbar from '../components/NavBar'
import UserTable from '../components/SignedUpUsersTable'
import SeverityAuthTable from '../components/AuthSettings'

const Dashboard = () => {
    return (
        <div>
            <Navbar />
            <UserTable />
            {/* <SeverityAuthTable /> */}
        </div>

    )
}

export default Dashboard