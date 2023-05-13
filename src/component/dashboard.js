import React, { useState, useEffect } from 'react'
import Navbar from './navbar'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const [name, setName] = useState('')
  const [token, setToken] = useState('')
  const [users, setUsers] = useState([])
  const [expToken, setExpToken] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    refreshToken()
    getUsers()
  }, [])

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token')
      setToken(response.data.accessToken)
      const decoded = jwtDecode(response.data.accessToken)
      setName(decoded.name)
      setExpToken(decoded.exp)
    } catch (error) {
      if(error.response){
        navigate('/')
      }
    }
  }

  const axiosJWT = axios.create()

  axiosJWT.interceptors.request.use(async(config) => {
    const currentDate = new Date();
    if(expToken * 1000 < currentDate.getTime()) {
      const response = await axios.get('http://localhost:5000/token')
      config.headers.Authorization = `bearer ${response.data.accessToken}`
      setToken(response.data.accessToken)
      const decoded = jwtDecode(response.data.accessToken)
      setName(decoded.name)
      setExpToken(decoded.exp)
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  const getUsers = async () => {
    const response = await axiosJWT.get('http://localhost:5000/users', {
      headers: {
        Authorization: `bearer ${token}`
      }
    })
    setUsers(response.data)
  }
  return (
    <div>
        <Navbar/>
        <div className="container mt-5">
            <h1 className='title'>WELCOME BACK {name} </h1>
            <button onClick={getUsers} className='button is-info'>Get Users</button>
            <table className='table is-striped is-fullwidth'>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((User, index) => (
                  <tr key={User.id}>
                    <td>{index + 1}</td>
                    <td>{ User.name }</td>
                    <td>{ User.email }</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
    </div>
  )
}

export default Dashboard