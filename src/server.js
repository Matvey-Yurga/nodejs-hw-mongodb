import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import router from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import { swaggerDocs } from './middlewares/swaggerDocs.js';


dotenv.config();
export default function setupServer() {

    
  const app = express();
    
  app.use(express.json());
    
  app.use(cors());
  app.use(cookieParser());
  app.use('/api-docs', swaggerDocs());
    
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
    
  const PORT = Number(process.env.PORT) || 3000;

  app.use(router);
      
  app.use(notFoundHandler);
  
  app.use(errorHandler);
      
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
}
