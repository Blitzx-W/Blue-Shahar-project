import React,{ useState} from "react"; // ייבוא ספריית ריאקט ושימוש בסטייט על מנת ליצור משתמשים דינמיים
import { type InstrumentData } from "../services/api"; // מייבאים את הטייפ

interface DataDialogProps { // חוזה להפעלת החלון 
    isOpen: boolean; // משתנה הבודק אם החלון פתוח
    onClose: () => void;// פונקציה שמופעלת בסגירת החלון
    onSave: (data: InstrumentData) => void;// פונקציה לשמירת הנתונים שמחזירה כלום
}

export const DataDialog: React.FC<DataDialogProps>= ({isOpen, onClose, onSave}) => { // קומפננטה שמייצאת נתונים שנוכל להשתמש בו בקבצים אחרים ובנוסף פירוק אובייקט למשתנים נוחים לשימוש
    const [altitude, setAltitude] = useState<string>(''); //שמירת ההקלדה בתיבת הגובה בהתחלה זה סטרינג ריק ובהמשך מספר
    const [hsi, setHsi] = useState<string>(''); // תיבת המצפן
    const [adi, setAdi] = useState<string>(''); //  תיבת האופק
    const [error, setError] = useState<string>('');// הודעת שגיאה אם מוקלד מספר מחוץ לטווח
    
    if (!isOpen) return null; // אם החלון סגור כלום לא יעשה רינדור

    const handleSubmit = (e: React.FormEvent) => { //  פונקציה הרצה ברגע שהמשמש לוחץ על שליחה המקבלת איבנט
        e.preventDefault(); // כששולחים פורם הדפדפן מתרענן אוטומטית ומוחק נתונים וזה מונע את זה
        setError(''); // ניקוי המסך משגיאות קודמות
        const altNum = Number(altitude); // הפיכת הטקסט למספרים כי תיבות קלט תמיד מחזירות טקסט
        const hsiNum = Number(hsi); //
        const adiNum = Number(adi);
    
        // וואלידציה על פי הנתונים שניתנו לפני שפונים לשרת
        if(altNum<0 || altNum>3000) return setError('altitude must be between 0 and 3000'); // במידה והמספר לא בטווח מפעילים את הפונקציה סט ארור
        if(hsiNum<0 || hsiNum>360) return setError('HSI must be between 0 and 360'); 
        if(adiNum<0 || adiNum>100) return setError('ADI must be between 0 and 100');

        onSave({ altitude: altNum, hsi: hsiNum, adi: adiNum}); // אם הכל תקין קוראים לפונקציית השמירה ומאפסים את השדות
        setAltitude('');
        setHsi('');
        setAdi('');
        onClose(); // סגירת החלון וחזרה למסך המחוונים הראשי
    };
    return ( // פתיחת הקוד HTML של ריאקט
        <div className="modal-overlay">  {/* משתמשים בקלאס ניים במקום קלאס כי המילה קלאס שמורה לאובייקטים JS */}
            <div className="modal-content"> {/* התיבה הלבנה של החלון עצמו */}
                <h3>Insert Flight Data</h3> {/*  */}
                {error && <p className="error-msg">{error}</p>} {/* אם יש טקסט בתוך משתנה ארור מוסיף טקסט עם עיצוב שגיאה */}
                <form onSubmit={handleSubmit}> {/* יצירת פורם וחיבור שלו לפונקציית שליחה ברגע שלוחצים סאבמיט */}
                    <div className="input-group"> {/* יצירת דיב לאינפוט */}
                        <label>Altitude (0-3000)</label>
                        <input type="number" value={altitude} onChange={(e) => setAltitude(e.target.value)} required />
                        {/* סוג האינפוט הוא מקלדת נומרית התיבה מציגה מה ששמור במשתנה סטייט בכל הקשה האירוע לוקח את מה שיש בתיבה ומעדכן את הסטייט והמסך נשאר מעודכן ומניעת ללחיצה א םהתיבה ריקה */}
                    </div>

                    <div className="input-group">
                        <label>HSI / Compass (0-360)</label>
                        <input type="number" value={hsi} onChange={(e) => setHsi(e.target.value)} required/>
                    </div>

                    <div className="input-group">
                        <label>ADI / horizon (0-100)</label>
                        <input type="number" value={adi} onChange={(e) => setAdi(e.target.value)} required />
                    </div>

                    <div className="modal-actions"> 
                        <button type="button" onClick={onClose} className="cancel-btn">Cancel</button> {/* הגדרת כפתור בלחיצה עליו סוגרת את החלון */}
                        <button type="submit" className="send-btn">SEND</button> {/* כפתור שליחה שמפעיל את הסאבמיט של הטופס כולו */}
                    </div>
                </form> 
            </div>
        </div>
    );
};