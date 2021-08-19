import express from "express";

const port = 3001;

const app = express();

app.listen(port, () => {
    console.log(`Api started on port ${port}`);
});