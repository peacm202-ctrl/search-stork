import { GoogleGenAI, Type } from "@google/genai";
import { Stock } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const stockResponseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            ticker: { type: Type.STRING, description: "The stock ticker symbol." },
            companyName: { type: Type.STRING, description: "The full name of the company." },
            keyMetricLabel: { type: Type.STRING, description: "The label for the key metric (e.g., 'P/E Ratio', 'Recent Volume')." },
            keyMetricValue: { type: Type.STRING, description: "The value for the key metric (e.g., '19.5', '30M')." },
            analysis: { type: Type.STRING, description: "A brief analysis of the stock based on the prompt." }
        },
        required: ["ticker", "companyName", "keyMetricLabel", "keyMetricValue", "analysis"]
    }
};

async function fetchStocksFromGemini(prompt: string): Promise<Stock[]> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: stockResponseSchema
            }
        });
        
        const jsonText = response.text.trim();
        const stocks: Stock[] = JSON.parse(jsonText);
        return stocks;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to retrieve data from Gemini API. The model may be unavailable or the request could be malformed.");
    }
}


export async function fetchGrowthStocks(): Promise<Stock[]> {
    const prompt = `
    ทำหน้าที่เป็นนักวิเคราะห์การเงินผู้เชี่ยวชาญ
    กรุณาค้นหาหุ้นสหรัฐ (US stocks) จำนวน 5-10 ตัวที่มีคุณสมบัติดังต่อไปนี้:
    1.  เป็นหุ้นเติบโต (Growth Stock) ที่มีศักยภาพในการเติบโตสูงในอีก 5 ปีข้างหน้า
    2.  มีอัตราส่วน P/E (Price-to-Earnings ratio) ปัจจุบันต่ำกว่า 20
    3.  บริษัทต้องมีปัจจัยพื้นฐานที่แข็งแกร่งและอยู่ในอุตสาหกรรมที่มีแนวโน้มเติบโต

    สำหรับหุ้นแต่ละตัว ให้ข้อมูลตาม schema ที่กำหนด:
    -   ticker: ตัวย่อของหุ้น
    -   companyName: ชื่อเต็มของบริษัท
    -   keyMetricLabel: ให้ใช้ค่าว่า "P/E Ratio"
    -   keyMetricValue: ค่า P/E ปัจจุบัน (เป็น string)
    -   analysis: บทวิเคราะห์สั้นๆ ที่เข้าใจง่ายเกี่ยวกับศักยภาพการเติบโตใน 5 ปีข้างหน้า ว่าทำไมหุ้นตัวนี้ถึงน่าสนใจ

    โปรดส่งคืนผลลัพธ์ในรูปแบบ JSON ที่ถูกต้องตาม schema ที่กำหนดเท่านั้น และตรวจสอบให้แน่ใจว่าบทวิเคราะห์ (analysis) ทั้งหมดเป็นภาษาไทย
    `;
    return fetchStocksFromGemini(prompt);
}

export async function fetchDayTradingStocks(): Promise<Stock[]> {
    const prompt = `
    ทำหน้าที่เป็นนักวิเคราะห์ตลาดที่เชี่ยวชาญการเทรดระยะสั้น
    กรุณาค้นหาหุ้นสหรัฐ (US stocks) จำนวน 5-10 ตัว ที่กำลังเป็นที่น่าสนใจสำหรับการเทรดรายวัน (Day Trading) หรือที่เรียกว่า 'หุ้นซิ่ง' ในปัจจุบัน
    โดยพิจารณาจากปัจจัยต่างๆ เช่น ปริมาณการซื้อขายที่สูงผิดปกติ (unusual volume), ความผันผวนสูง (high volatility), หรือมีข่าวสำคัญล่าสุด (recent news).

    สำหรับหุ้นแต่ละตัว ให้ข้อมูลตาม schema ที่กำหนด:
    -   ticker: ตัวย่อของหุ้น
    -   companyName: ชื่อเต็มของบริษัท
    -   keyMetricLabel: ชื่อของตัวชี้วัดที่น่าสนใจที่สุดที่ทำให้หุ้นตัวนี้น่าสนใจ (เช่น 'Volume', 'Volatility (ATR)', '% Change')
    -   keyMetricValue: ค่าของตัวชี้วัดนั้น (เป็น string)
    -   analysis: บทวิเคราะห์สั้นๆ ว่าทำไมหุ้นตัวนี้ถึงน่าสนใจสำหรับการเทรดในระยะสั้น และควรระวังความเสี่ยงอะไรบ้าง

    โปรดส่งคืนผลลัพธ์ในรูปแบบ JSON ที่ถูกต้องตาม schema ที่กำหนดเท่านั้น และตรวจสอบให้แน่ใจว่าบทวิเคราะห์ (analysis) ทั้งหมดเป็นภาษาไทย
    `;
    return fetchStocksFromGemini(prompt);
}

export async function fetchDividendStocks(): Promise<Stock[]> {
    const prompt = `
    ทำหน้าที่เป็นนักวิเคราะห์การเงินที่เชี่ยวชาญด้านการลงทุนแบบเน้นรายได้ (Income Investing)
    กรุณาค้นหาหุ้นสหรัฐ (US stocks) จำนวน 5-10 ตัว ที่เป็น 'หุ้นปันผลปลอดภัยสูง' (High-Safety Dividend Stocks) โดยมีคุณสมบัติดังนี้:
    1.  มีการจ่ายเงินปันผลอย่างสม่ำเสมอและมีประวัติการเติบโตของเงินปันผลที่ดี
    2.  บริษัทมีสถานะทางการเงินที่แข็งแกร่ง หนี้สินต่ำ และกระแสเงินสดเป็นบวก
    3.  อยู่ในอุตสาหกรรมที่มั่นคง ไม่ผันผวนสูง (เช่น สินค้าอุปโภคบริโภค, สาธารณูปโภค, การดูแลสุขภาพ)
    4.  มีความผันผวนของราคาหุ้นต่ำ (Low Beta)

    สำหรับหุ้นแต่ละตัว ให้ข้อมูลตาม schema ที่กำหนด:
    -   ticker: ตัวย่อของหุ้น
    -   companyName: ชื่อเต็มของบริษัท
    -   keyMetricLabel: ให้ใช้ค่าว่า "Dividend Yield"
    -   keyMetricValue: ค่าอัตราผลตอบแทนเงินปันผลปัจจุบัน (เป็น string, เช่น "3.8%")
    -   analysis: บทวิเคราะห์สั้นๆ ที่เข้าใจง่ายว่าทำไมหุ้นตัวนี้ถึงเป็นการลงทุนในหุ้นปันผลที่ปลอดภัยและน่าสนใจ

    โปรดส่งคืนผลลัพธ์ในรูปแบบ JSON ที่ถูกต้องตาม schema ที่กำหนดเท่านั้น และตรวจสอบให้แน่ใจว่าบทวิเคราะห์ (analysis) ทั้งหมดเป็นภาษาไทย
    `;
    return fetchStocksFromGemini(prompt);
}