import app from './app';
import express from 'express';
import path from 'path';

app.use(express.static(path.join(__dirname, "./frontend/views")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

