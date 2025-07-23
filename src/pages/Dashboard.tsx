import React from 'react'
import Navbar from '../components/NavBar'
import UserTable from '../components/SignedUpUsersTable'

const Dashboard = () => {
    return (
        <div>
            <Navbar />
            <UserTable />
        </div>

    )
}

export default Dashboard