import mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.host,
  user: 'root',
  password: 'admin123',
  database: 'usersTable',
}).promise()

export const isExistUser = async (login, password) => {
  const [result] = await pool.query(
  `SELECT * 
  FROM users
  WHERE login = ?
  AND password = ?`,
  [login, password])
  return result.length === 0 ? false : true
}

export const getUsers = async () => {
  const [data] = await pool.query(`SELECT * FROM users`);
  return data;
} 

export const getUser = async (id) => {
  const [data] = await pool.query(
  `SELECT * 
  FROM users
  WHERE id = ?`,
  [id])
  return data;
}

export const createUser = async (name, login, status, password) => {
  const [newUser] = await pool.query(
   `INSERT INTO users (name, login, status, password)
  VALUES (?, ?, ?, ?)`,
   [name, login, status, password])
  return newUser;
}

export const deleteUser = async (id) => {
    await pool.query(
      `DELETE FROM users
      WHERE id = ?`,
      [id])
    return deleted;
}
export const deleteAll = async (users) => {
    await pool.query(
    `DELETE FROM users
    WHERE id IN (?)`
    , [users]);
    return await getUsers();
}

export const blockAndUnblockUsers = async (status, usersId) => {
    for (const item of usersId) {
      await pool.execute(
    `UPDATE users SET status = ?
    WHERE id IN (?)`, 
    [status, item]);
    }
    return;
}

export const checkLogin = async (login) => {
    const [data] = await pool.query(
      `SELECT * 
      FROM users
      WHERE login = ?`
      , [login])
      return data;
}

export const checkBlock = async (login, status) => {
  const [data] = await pool.query(
    `SELECT * 
    FROM users
    WHERE login = ? 
    && status = ?`
    , [login, status])
    return data;
}
