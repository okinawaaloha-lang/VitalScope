import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, AnalysisResult } from "../types";

const parseBase64 = (base64String: string) => {
  if (base64String.startsWith('data:')) {
    const base64Data = base64String.split(',')[1];
    const mimeType = base64String.substring(base64String.indexOf(':') + 1, base64String.indexOf(';'));
    return { data: base64Data, mimeType };
  }
  // Fallback assuming jpeg if raw string
  return { data: base64String, mimeType: 'image/jpeg' };
};

// APIキーを安全に取得するヘルパー関数
const getApiKey = (): string => {
  // 1. Vite環境 (Vercelデプロイ時など)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }

  // 2. 標準的なprocess.env (AI Studioプレビューや一部のビルド環境)
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env?.API_KEY) {
      // @ts-ignore
      return process.env.API_KEY;
    }
  } catch (e) {
    // ブラウザでprocessが未定義の場合の参照エラーを無視
  }

  return '';
};

export const analyzeHealthImpact = async (
  profile: UserProfile,
  images: string[]
): Promise<AnalysisResult> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error("APIキーが見つかりません。VercelのEnvironment Variablesに 'VITE_API_KEY' を設定してください。");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Schema definition without explicit Type annotation to avoid runtime import issues
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      summary: {
        type: Type.STRING,
        description: "A concise summary of the product analysis (approx 200 characters).",
      },
      pros: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of health benefits/pros for this specific user.",
      },
      cons: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of health risks/cons for this specific user.",
      },
      recommendations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of a recommended product on Amazon." },
            reason: { type: Type.STRING, description: "Short reason why this is good for the user." },
          },
          required: ["name", "reason"],
        },
        description: "3 recommended products available on Amazon relevant to the user's needs.",
      },
    },
    required: ["summary", "pros", "cons", "recommendations"],
  };

  const systemInstruction = `
    あなたは熟練したヘルスケアアドバイザーです。
    ユーザーから提供された商品（食品、日用品、薬など）の画像（成分表示やパッケージ）を分析し、
    そのユーザーの健康状態、年齢、性別に合わせて、その商品がどのような影響を与えるかを評価してください。

    ユーザープロフィール:
    - 年齢: ${profile.age}
    - 性別: ${profile.gender}
    - 健康状態/悩み: ${profile.healthContext}

    出力要件:
    1. ユーザーにとってのメリット（Pros）を箇条書きで簡潔に。
    2. ユーザーにとってのデメリット（Cons）を箇条書きで簡潔に。
    3. 全体的な概要（Summary）を200文字程度で。
    4. このユーザーの悩みを解決、または健康を増進させるためのおすすめのAmazon商品を3つ提案してください。

    回答はすべて日本語で行ってください。
  `;

  const imageParts = images.map((img) => {
    const { data, mimeType } = parseBase64(img);
    return {
      inlineData: {
        data,
        mimeType,
      },
    };
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          ...imageParts,
          { text: "この商品の成分や特徴を分析し、私の健康状態に対する影響を教えてください。" }
        ]
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("解析中にエラーが発生しました。もう一度お試しください。");
  }
};