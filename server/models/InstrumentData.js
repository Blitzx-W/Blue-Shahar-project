import mongoose from 'mongoose';

const instrumentDataSchema = new mongoose.Schema({
  // ערך גובה בין 0 ל-3000
  altitude: {
    type: Number,
    required: true,
    min: [0, 'Altitude must be at least 0'],
    max: [3000, 'Altitude cannot exceed 3000']
  },
  // ערך מצפן בין 0 ל-360
  hsi: {
    type: Number,
    required: true,
    min: [0, 'HSI must be at least 0'],
    max: [360, 'HSI cannot exceed 360']
  },
  // ערך זווית אופק בין 0 ל-100
  adi: {
    type: Number,
    required: true,
    min: [-100, 'ADI must be at least -100'],
    max: [100, 'ADI cannot exceed 100']
  },
  // שמירת זמן קבלת הנתונים באופן אוטומטי
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('InstrumentData', instrumentDataSchema);