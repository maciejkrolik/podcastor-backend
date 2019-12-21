const express = require('express');
const app = express();
require('./db/db');

const port = process.env.PORT;

const userRouter = require('./routers/users');

app.use(express.json());
app.use(userRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
