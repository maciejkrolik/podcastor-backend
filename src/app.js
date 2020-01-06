const express = require('express');
const cors = require('cors');
const app = express();
require('./db/db');

const port = process.env.PORT;

const userRouter = require('./routers/users');

app.use(cors());
app.use(express.json());
app.use(userRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
