import React from "react"; // ייבוא ספריית ריאקט
import { type InstrumentData } from "../services/api"; // ייבוא האינטרפייס כך שהקומפננטה תעבוד עם המשתנים

interface FlightIndicatorsProps { // רכיב שמקבל פרופ בשם דאטה
    data: InstrumentData; //הדאטה מקבלת אובייקט מסוג אינטרוסמנט 
}
// ייצוא קומפננטה שהיא רכיב פונקציונלי שמשתמש בפרופ אינטרוסמנט ופירוק האובייקט לחילוץ דאטה
export const FlightIndicators: React.FC<FlightIndicatorsProps> = ({ data }) => {
    const { altitude, hsi, adi } = data; // פירוק דאטה לשלושה משתנים עצמאיים

    const altitudePercentage = (altitude / 3000) * 100; // הפיכת הגובה לאחוזים להזזת החץ

    // הערך שיתקבל הוא בין 0 ל100 ונשתמש בליניאר גרדיאנט בין הצבעים כחול לירוק
    const adiMix = `${adi}%`; // יצירת מחרוזת שמוסיפה למספר אחוז
    // jsx 
    return (
        <div className="indicators-container"> {/* התגית שמחזיקה את שלושת המדדים */}
            <div className="indicator-card"> {/* דיב שמבדיל ויזואלית בין מכשיר למכשיר */}
                <h4>Altitude ({altitude} ft)</h4> {/*  */}
                <div className="altitude-scale"> {/* סקאלה אנכית עם סימוני גובה */}
                    <div className="scale-label top">3000</div> {/* המלבן האנכי שמייצג את מד הגובה */}
                    <div className="scale-label middle">1500</div>
                    <div className="scale-label bottom">0</div>
                    {/* הקו השחור שזז לפי הגובה האחוזים */}
                    <div className="altitude-pointer" style={{ bottom: `${altitudePercentage}%` }}></div> {/* שינוי המאפיין בוטום כך שאם לדוגמה נקבל 50 אחוז הוא יקפוץ לאמצע */}
                </div>
            </div>
            <div className="indicator-card">{/* דיב של המצפן */}
                <h4>HSI / Compass ({hsi}°)</h4>{/* העתק המשתנה עם הסימון של מעלות */}
                <div className="compass-outer"> {/* מלבן שמחזיק את המצפן בתוכו */}
                    {/* הדיסק של המצפן ומשתמשים בטרנספורם רוטייט כדי לסובב ומשתמשים במינוס כדי להפוך את זה נגד כיוון הטייס */}
                    <div className="compass-disc" style={{transform: `rotate(${-hsi}deg)`}}>
                        <div className="compass-direction north">N</div>
                        <div className="compass-direction east">E</div>
                        <div className="compass-direction south">S</div>
                        <div className="compass-direction west">W</div>
                    </div>
                    <div className="compass-center-pointer">▲</div>{/* חץ המטוס שנשאר יציב */} 
                </div> 
            </div>
            <div className="indicator-card">
                <h4>ADI / Horizon ({adi})</h4>{/* דיב של האופק */}
                {/* השתמשות בליניאר גרדיאנט כך ש100 אחוז יהיה כחול ו0 יהיה ירוק  */}
                <div className="adi-circle" style={{background: `linear-gradient(to bottom, #3b82f6 ${adiMix}, #22c55e ${adiMix})`}}>
                    <div className="adi-horizon-line"></div>{/* קו לבן שבנוי באמצע */}
                </div>
            </div>
        </div>
    )
}

