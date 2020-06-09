import express from 'express';

const app = express();
app.use(express.json());

const users = [
  'Itachi',
  'Madara',
  'Hashirama',
  'Tobirama'
];

app.get('/users', (req, res) => {
  const search = String(req.query.search);
  const filteredUsers = search ? users.filter(user => user.includes(search)) : users;
  return res.json(filteredUsers);
});

app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  return res.json(users[id]);
});

app.post('/users', (req, res) => {
  const data = req.body;
  return res.json(data);
});

app.listen(3333);