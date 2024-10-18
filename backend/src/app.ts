import express from 'express'

const app = express();



app.get('/gay', (req, res) => {
  res.send('hello worl');
});



app.listen(8080, () => {
  console.log('backend running on port 8080');
});