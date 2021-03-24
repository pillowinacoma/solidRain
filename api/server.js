const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send('Hello world !!');
});

app.get('/static', (req, res) => {
    app.use(express.static('public'));
});

app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})