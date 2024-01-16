import express from 'express'
import {  Request, Response } from "express";
import { Note, Prisma, PrismaClient } from '@prisma/client'; 
import cors from 'cors';
import NoteController from './Endpoints/NoteController'

const app = express();
app.use(cors());
const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:3000', 
  methods: 'GET,PUT,POST,DELETE',
  optionsSuccessStatus: 200 
};
app.use(express.json())
app.use("/Note", NoteController);

const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} `)
})