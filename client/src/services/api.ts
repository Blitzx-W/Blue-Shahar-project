const API_URL ='http://localhost:5000/api/indicators'; // הכתובת של השרת נוד שרץ ברקע

export interface InstrumentData{ //הגדרת הטיפוס נתונים בגלל השימוש בטייפ סקריפט וייצוא שלו
    altitude: number; // חיוב שהשדות האלה מספרים בלבד
    hsi: number;
    adi: number;
}
//בונים פונקציית גט לקבלת מידע מעודכן שניתן לייצא 
export const getLatestData = async (): Promise<InstrumentData> => { // שימוש בפרומיס מכיון שזו םונקציה אסינכרונית ואני צריכים הבטחה שהאובייקט במבנה שקבענו למעלה יתקבל
    const response = await fetch(API_URL); // פונקצייה מובנת שברירת המחדל שלה הוא גט שימוש בוויט כדי להמשיך רק כשמקבל תשובה
    if (!response.ok) { // אם נכשלנו בקבלת הנתונים
        throw new Error("failed to get data from server"); // אם הייתה בעיה בתקשורת זורקים שגיאה
    }
    return response.json()// המידע מגיע בתור טקסט ואנחנו הופכים אותו לאובייקט
}
// פונקציית שליחת נתונים שניתן לייצא המקבלת נתונים בצורת האובייקט דאטה שקבענו הפונקציה היא והוספנו הבטחה שהיא רק שולחת מידע לשרת ומחזירה כלום
export const saveInstrumentData = async (data: InstrumentData): Promise<void> => { // 
    const response = await fetch (API_URL,{  // משתמשים בפטץ ומוסיפים הגדרות  
        method: 'POST', // של פוסט לכתיבת נתונים בשרת
        headers:{ // הנתונים הם טקסט ג'יסון וכך השרת יודע לתרגם בעזרת אקספרס
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data) // הפיכת האובייקט לטקסט בפורמט ג'ייסון כדי להעבירו מהדפדפן לשרת
    });
    if (!response.ok) { //אם הבקשה נכשלה
        const errordata = await response.json(); // מחכים שהשרת יחזיר שגיאה בצורה מסודרת והופכים אותו מטקסט לאובייקט
        throw new Error(errordata.error || 'failed to post data'); // זורקים את הארור שהגיע מהשרת או ארור משלנו במקרה והשרת לא שלח
    }
}