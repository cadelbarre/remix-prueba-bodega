import mysql from 'mysql2/promise'

// const credencial = {
//   host: '192.168.1.6',
//   user: 'ossadosystem',
//   password: 'ossadoprogram',
//   database: 'ossado',
//   waitForConnections: true
// }

const credencial = {
  host: 'localhost',
  user: 'root',
  password: 'IE40coth$$',
  database: 'ossado',
  waitForConnections: true
}

const connection = async () => {
  const connect = await mysql.createConnection(credencial)
  return connect
}

// const connection = (async () => await mysql.createConnection(credencial))()
// const connection = (async () => await mysql.createPool(credencial))()

export default connection
