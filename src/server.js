import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import { getAllContacts, getContactById } from './services/contacts.js';

dotenv.config();
export default function setupServer() {

    
  const app = express();
    
  app.use(express.json());
    
  app.use(cors());
    
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
    
  const PORT = Number(process.env.PORT) || 3000;
  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: contacts,
    });
  });
          
    app.get("/contacts/:contactId", async (req, res) => {
      const { contactId } = req.params;
      const student = await getContactById(contactId);

      if (!student) {
        res.status(404).json({
          status: 404,
          message: "Student not found",
        });
        return;
      }

      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: student,
      });
    });
      
  app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
  });
  
      
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
}
