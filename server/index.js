import express from 'express'; // מייבאים את תיקיית אקספרס שתעזור לנו עם הניתוב והמידלוור
import mongoose from 'mongoose'; // מייבאים ספרייה המקשרת בין הקוד לדאטה בייס
import cors from 'cors'; // מייבאים תוסף אבטחה שעוזר לאתר ריאקט לדבר עם השרת מונגו
import dotenv from 'dotenv'; //ספריה היודעת לקרוא קבצי הגדרות סודיים שאצלנו זה הכתובת והפורט של הבסיס
import InstrumentData from './models/InstrumentData.js'; //מייבאים את מבנה הנתונים בקובץ המודל שהשרת ידע אילו שדות וטווחים קיימים

dotenv.config(); // פקודה המחפשת את הקובץ הסודי בתיקייה שנוכל להשתמש במשתנים שם

const app = express();  // יצירת אובייקט מסוג אקספרס ושמירת במילה אפ
const PORT = process.env.PORT || 5000; // לקיחת הפורט שרשום בקובץ אנב או שימוש בברירת מחדל

app.use(cors()); //מפעילים את התוסף אבטחה על מנת שיהיה תקשורת בין האתר לשרת שבברירת מחדל דפדפנים חוסמים
app.use(express.json()); //הפיכת הטקסט שמגיע מהרשת לאובייקט שנוח לקרוא אותו 

// שימוש במונגוס ליצירת קשר עם הדאטה בייס עם היואראיי שרשום בקובץ אנב
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connection to MongoDB was successful")) // פעולה אסינכרונית שימוש בםרומיס והדפסה במידה ומצליח
    .catch((err) => console.error('Connection to MongoDB Failed:', err)); // אם לא מצליח תופסים את השגיאה והיא מודפסת באדום
// יצירת נתיב בדיקה
app.get('/test', (req, res) => {  // הרק מכילה את כל המידע שהגיע מהדפדפן והרס מכיל פונקציות שמחזירים איתן תשובה
    res.send('The server is alive and kicking!'); // שימוש בפונקציית שליחה לשלוח טקסט פשוט
});

// שימוש בגט על מנת לקבל את המידע האחרון מהשרת
app.get('/api/indicators', async (req, res) => { // פונקציה אסינכרונית 
    try { //קוד הגנה על מנת שאם משהו ישתבש  יעבור לקאץ
         // הקוד עוצר פונים למודל נתונים ומבקשים למצוא שורה אחת מתוך הבסיס ומיון על ידי תאריך היצירה מהחדש לישן ומציאת הנתון האחרון
        const latestData = await InstrumentData.findOne().sort({ createdAt: -1 });
        return res.status(200).json(latestData || { altitude: 0, hsi: 0, adi: 0 }); //קוד הצלחה מאתיים שמחזיר המידע האחרון או במקרה ואין עדיין מידע נחזיר אובייקט זמני
    } catch (error) { // אם קרתה תקלה הקאץ מקבל ארור מהשרת
        return res.status(500).json({ error: error.message }); // הסטטוס תשובה קבע לחמש מאות שגיאת שרת ומחזיר אובייקט עם השגיאה
    }
});
// הגדרת נתיב שליחת נתונים בכתובת הזאת אסינכרוני
app.post('/api/indicators', async (req, res) => { 
    try { // שכבת הגנה
        const { altitude, hsi, adi } = req.body; // שליפת הנתונים מתוך הבקשה על ידי פירוק אובייקט מהנתונים שהובאו מהאתר

        const newData = new InstrumentData({ altitude, hsi, adi }); // מייצרים מסמך חדש על פי המודל נתונים שלנו מהנתונים ששלפנו
        await newData.save(); // מונגוס אומר למונגו שישמור את המסמך שיצרנו ומחכים שהמידע ישמר
        
        return res.status(201).json({ message: 'Data saved!', data: newData });// קוד מאתיים ואחד שאומר שהמסמך נוצר ומחזירים לריאקט הודעת הצלחה והעתק של המידע
    } catch (error) {
        return res.status(500).json({ error: error.message });// במידה ויש שגיאה מחזיר מה השרת אמר
    }
});

// הפעלת השרת והאזנה לבקשות
app.listen(PORT, '0.0.0.0', () => { //הפעלת השרת והאזנה לבקשות בפורט שהצבנו ובכתובת פרטית שניתן לגשת ממנה מכל מחשב ברשת הפרטית
    console.log(`Server running on port ${PORT}`); //הדפסות שהשרת למעלה ונגיש ברשת הפרטית
    console.log(`Accessible in private network!`);
});