import express from "express";
import cors from 'cors';
import { getUsers, createUser, isExistUser, deleteAll, blockAndUnblockUsers, checkLogin, checkBlock } from './database.js'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/users', async (req, res) => {
  const users = await getUsers();
  res.send(users);
  res.end();
})

app.post('/login', async (req, res) => {
  const user = req.body;
  const existUser = await isExistUser(user.login, user.password);
  const blockCh = await checkBlock(user.login, 'blocked');
  if (existUser) {
    if (blockCh.length < 1) {
    res.json({ message: 'OK' });
    res.end();
    } else {
      res.json({ message: 'block'});
      res.end();
    }
  } else {
    res.json({message: 'notExist' });
    res.end();
  }
});

app.post('/registration', async (req, res) => {
  const newUser = req.body;
  const currentLogin = newUser.login;
  const check = await checkLogin(currentLogin);
  if (check.length > 0) {
    res.json({ message: false});
    res.end();
  } else {
    res.json({ message: true});
    await createUser(newUser.name, newUser.login, status.active, newUser.password);
    res.end();
  }
});

app.post('/table/delete', async (req, res) => {
  const users = req.body;
  const id = users.map((el) => el.id);
  const update = await deleteAll(id);
  res.send(update);
  res.end();
});

app.post('/table/block', async (req, res) => {
  const users = req.body;
  const idUsers = users.map((el) => Number(el.id));
  await blockAndUnblockUsers('blocked', idUsers);
  const update = getUsers();
  res.send(update);
  res.end();
});

app.post('/table/unlock', async (req, res) => {
  const users = req.body;
  const idUsers = users.map((el) => Number(el.id));
  await blockAndUnblockUsers('active', idUsers);
  const update = getUsers();
  res.send(update);
  res.end();
});

app.listen(PORT, () => {
  console.log(`server is running on: http://localhost:${PORT}`);
});
