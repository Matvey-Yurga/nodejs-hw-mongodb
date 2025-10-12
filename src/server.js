import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

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

  app.use('/contacts', contactsRouter);
      
  app.use(notFoundHandler);
  
  app.use(errorHandler);
      
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
}
