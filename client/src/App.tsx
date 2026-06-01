// ייבוא של ספריית ריאקט
// והכלים יוז סטייט לניהול משתנים דינמיים שרצים למשתמש על המסך
// ויוז אפקט להרצת פעולה אוטומטית ברקע כשרכיב עולה או משתנה
import { useState, useEffect } from "react";
import { FlightIndicators } from "./components/FlightIndicators"; // ייבוא קומפננטת המחוונים
import { DialogBox } from "./components/DialogBox"; // קופסת יישום הנתונים
import { getLatestD, saveFData, type FData } from "./services/api"; //ייבוא פונקציית התקשורת מול הapi
import "./App.css"; // ייבוא קובץ העיצוב

function App() {
  //ניהול המשתנים הדינמיים של האפליקציה

  // סטייט שאחראי על משתני הטיסה הנוכחיים עם ברירת מחדל של 0
  const [fData, setFData] = useState<FData>({ altitude: 0, hsi: 0, adi: 0 });
  // סטייט בוליאני שקובע האם להציג את המחוונים או את הטקסט 
  const [viewMode, setViewMode] = useState<'visual' | 'text'>('visual');
  // סטייט בוליאני שקובע האם החלון דיאלוג פתוח או סגור
  const [isBoxOpen, setIsBoxOpen] = useState<boolean>(false);
  // סטייט ששומר הודעות שגיאה כלליות שקורות
  const [apiError, setApiError] = useState<string>('');

  //יוז אפקט שירוץ אוטומטית בטעינת האפליקציה 
  useEffect(() => {
    const fetchInitialData = async () => {
      try { // עוטפים פניית רשת בבלוק
        setApiError(''); //ניקוי שגיאות קודמות
        const data = await getLatestD();// קריאה לפונקציית הגט של האייפיאיי ועצירה עד לקבלת התשובה
        setFData(data);// שימוש בסטייט על מנת לשנות את המשתנים לנתונים שהגיעו מהמונגו 
      } catch (error: any) { //אם נתקלנו בשגיאה
        setApiError("could not connect to backend server");//הצגת שגיאה במידה והשרת לא רץ
      }
    }
    fetchInitialData();
  }, []) //מערך ריק אומר שזה ירוץ פעם אחת בלבד בפתיחת האפליקציה
  // פונקציה שמקבלת נתונים מהאינפוט ושולחת אותם בפוסט
  const handleSaveData = async (newData: FData) => {
    try {
      await saveFData(newData); {/* משתמשים בפונקציה שייבאו מהאייפיאי עם הדאטה ומחכים לתשובה */ }
      setFData(newData); {/* במידה והוחזרה תשובה חיובית */ }
    } catch (error: any) {
      {/* במידה והגיעה שגיאה מחזירים אותה  */ }
      setApiError(error.message || "failed to save data to server")
    }
  }
  return (
    <div className="app-container"> {/* הממשק משתמש */}
      <header>
        <h2>Flight Instruments Monitor</h2>
        <div className="controls-bar"> {/* כפתורי השליטה בין ויזואל לטקסט */}
          <button className={viewMode === 'visual' ? 'active' : ""}
            onClick={() => setViewMode('visual')}
          >VISUAL</button>
          <button className={viewMode === 'text' ? 'active' : ""}
            onClick={() => setViewMode('text')}
          >TEXT</button>
          <button className="add-btn"
            onClick={() => setIsBoxOpen(true)}>+</button>
        </div>
      </header>
      {/* שימוש בהערכה קצרה אם יש איזושהי שגיאה שמורה מייצרים אלמנט  */}
      {apiError && <div className="error-msg" style={{ marginBottom: '20px' }}>{apiError}</div>}
      {/* ניתוב תצוגות על פי בחירת המשתמש/הטייס שימוש ברינדור מותנה */}
      <main>
        {viewMode === 'visual' ? ( /* שימוש באיף מקוצר אם המצב תצוגה על ויזואל */
          /* אם המצב הוא ויזואל - נרנדר את קומפננטת המחוונים הגרפיים וניתן לה את המשתנה סטייט */
          <FlightIndicators data={fData} />
        ) : ( //אם המצב תצוגה הוא טקסט
          /*נציג קופסת טקסט פשוטה עם הערכים המספריים מהסטייט */
          <div className="text-capsules-container">
            
            {/* גובה */}
            <div className="text-capsule">
              <span className="capsule-label">Altitude</span>
              <span className="capsule-value">{fData.altitude} ft</span>
            </div>

            {/*מצפן*/}
            <div className="text-capsule">
              <span className="capsule-label">HSI</span>
              <span className="capsule-value">{fData.hsi}°</span>
            </div>

            {/* אופק */}
            <div className="text-capsule">
              <span className="capsule-label">ADI</span>
              <span className="capsule-value">{fData.adi}</span>
            </div>

          </div>
        )}
      </main>
      <DialogBox 
        isOpen={isBoxOpen} 
        onClose={() => setIsBoxOpen(false)} 
        onSave={handleSaveData} 
      />
    </div>
  )
}
export default App;
