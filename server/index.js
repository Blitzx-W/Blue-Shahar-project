import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import InstrumentData from './models/InstrumentData';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("connection to MongoDb was successfull"))
    .catch((err) => console.error('connection to MongoDb Failed',err));

app.use('/api/indicators',async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { altitude, hsi, adi } = req.body;

            const newData = new InstrumentData({ altitude, hsi, adi });
            await newData.save();
            return res.status(201).json({ Message: 'Data saved!', data: newData})
        }
        catch (error){
            return res.status(500).json({error: error.Message});
        }
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`server running on port ${PORT}`);
    console.log(`accessible in private network!`);
    
})