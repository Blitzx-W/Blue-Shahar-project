// שימוש בנתיבים יחסיים במקום localhost
const API_URL = 'jacobFlightMonitor/api/indicators';
const API_URL2 = '/preparing';

export interface FData {
    altitude: number;
    hsi: number;
    adi: number;
}

export const seeTheM = async (): Promise<String> => {
    const response = await fetch(API_URL2);
    if (!response.ok) {
        throw new Error("you have failed to prepare");
    }
    return response.json();
}

export const getLatestD = async (): Promise<FData> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error("failed to get data from server");
    }
    return response.json();
}

export const saveFData = async (data: FData): Promise<void> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errordata = await response.json();
        throw new Error(errordata.error || 'failed to post data');
    }
}