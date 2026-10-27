import { serverLogger } from "@/lib/security/logger";

export interface TranslationOptions {
  sourceLocale?: string;
  targetLocale: string;
}

// In-memory translation cache to optimize batch processing
const translationCache = new Map<string, string>();

/**
 * Server-only translation function calling Google Translate API or MyMemory API fallback.
 */
export async function translateText(
  text: string,
  targetLocale: string,
  sourceLocale: string = "en"
): Promise<string> {
  if (!text || typeof text !== "string" || text.trim() === "") {
    return text;
  }

  if (targetLocale === sourceLocale) {
    return text;
  }

  const cacheKey = `${sourceLocale}:${targetLocale}:${text.trim()}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  // 1. Try Google Translate API if key is set
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (apiKey) {
    try {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: sourceLocale,
          target: targetLocale,
          format: "text",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const translated = data?.data?.translations?.[0]?.translatedText;
        if (translated) {
          translationCache.set(cacheKey, translated);
          return translated;
        }
      }
    } catch (err) {
      serverLogger.warn("[TranslationService] Google API translation failed, attempting fallback", err, { module: "translation", action: "translateText" });
    }
  }

  // 2. Fallback dictionary & smart translator for university terms
  const dict = FALLBACK_DICTIONARY[targetLocale];
  if (dict) {
    if (dict[text]) return dict[text];
    for (const [key, val] of Object.entries(dict)) {
      if (text.toLowerCase().includes(key.toLowerCase())) {
        return text.replace(new RegExp(key, "gi"), val);
      }
    }
  }

  // 3. Try MyMemory API if text is a single short sentence
  if (text.length < 100) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${sourceLocale}|${targetLocale}`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        const translated = data?.responseData?.translatedText;
        if (
          translated &&
          typeof translated === "string" &&
          !translated.startsWith("MYMEMORY WARNING:") &&
          translated.trim() !== ""
        ) {
          const cleaned = translated.replace(/,\s*$/, "").trim();
          translationCache.set(cacheKey, cleaned);
          return cleaned;
        }
      }
    } catch (err) {
      // Silent fallback
    }
  }

  // 4. Final fallback: return original text without artificial markers
  return text;
}

const FALLBACK_DICTIONARY: Record<string, Record<string, string>> = {
  hi: {
    "Computer Science & Engineering": "कंप्यूटर विज्ञान और इंजीनियरिंग",
    "Computer Applications": "कंप्यूटर अनुप्रयोग",
    "Business Management": "व्यवसाय प्रबंधन",
    "Commerce": "वाणिज्य",
    "Pharmacy": "फार्मेसी",
    "Agricultural Sciences": "कृषि विज्ञान",
    "Law": "कानून",
    "Hospitality & Hotel Management": "आतिथ्य और होटल प्रबंधन",
    "Nutrition & Dietetics": "पोषण और आहार विज्ञान",
    "Humanities & Social Sciences": "मानविकी और सामाजिक विज्ञान",
    "Forensic Science": "फॉरेंसिक साइंस",
    "Nursing": "नरसिंग",
    "Programs Offered": "ऑफ़र किए गए प्रोग्राम",
    "University": "विश्वविद्यालय",
    "Chancellor": "कुलाधिपति",
    "Vice Chancellor": "कुलपति",
    "Registrar": "कुलसचिव",
    "Dean": "डीन",
    "Director": "निदेशक",
    "Professor": "प्रोफेसर",
    "Chairman": "अध्यक्ष",
    "Governance Document": "शासन दस्तावेज",
    "Policy": "नीति",
    "Award": "पुरस्कार",
    "Ranking": "रैंकिंग",
    "Recruiter": "भर्तीकर्ता",
  },
  fr: {
    "Computer Science & Engineering": "Informatique et ingénierie",
    "Computer Applications": "Applications informatiques",
    "Business Management": "Gestion d'entreprise",
    "Commerce": "Commerce",
    "Pharmacy": "Pharmacie",
    "Agricultural Sciences": "Sciences agricoles",
    "Law": "Droit",
    "Hospitality & Hotel Management": "Hôtellerie et gestion hôtelière",
    "Nutrition & Dietetics": "Nutrition et diététique",
    "Humanities & Social Sciences": "Sciences humaines et sociales",
    "Forensic Science": "Sciences médico-légales",
    "Nursing": "Soins infirmiers",
    "Programs Offered": "Programmes proposés",
    "University": "Université",
    "Chancellor": "Chancelier",
    "Vice Chancellor": "Vice-chancelier",
    "Registrar": "Secrétaire général",
    "Dean": "Doyen",
    "Director": "Directeur",
    "Professor": "Professeur",
    "Chairman": "Président",
    "Governance Document": "Document de gouvernance",
    "Policy": "Politique",
    "Award": "Prix",
    "Ranking": "Classement",
    "Recruiter": "Recruteur",
  },
};

/**
 * Recursively translates text values inside structured objects / arrays.
 * Preserves structural fields (IDs, URLs, image paths, numbers, booleans) unchanged.
 */
export async function translateObject<T = any>(
  obj: T,
  targetLocale: string,
  sourceLocale: string = "en"
): Promise<T> {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    // Skip technical non-translatable string patterns (URLs, emails, image extensions, route paths)
    if (
      obj.startsWith("http://") ||
      obj.startsWith("https://") ||
      obj.startsWith("/") ||
      obj.includes("@") ||
      /\.(png|jpg|jpeg|webp|gif|svg|webm|mp4|pdf)$/i.test(obj) ||
      /^[0-9]+$/.test(obj)
    ) {
      return obj as any;
    }
    return (await translateText(obj, targetLocale, sourceLocale)) as any;
  }

  if (typeof obj === "number" || typeof obj === "boolean") {
    return obj;
  }

  if (Array.isArray(obj)) {
    const translatedArray = [];
    for (const item of obj) {
      translatedArray.push(await translateObject(item, targetLocale, sourceLocale));
    }
    return translatedArray as any;
  }

  if (typeof obj === "object") {
    const result: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      // Do not translate technical keys
      if (
        [
          "id",
          "slug",
          "url",
          "href",
          "schoolHref",
          "image",
          "logo",
          "posterImage",
          "videoUrl",
          "icon",
          "status",
          "_status",
          "sortOrder",
          "mimeType",
          "storageKey",
          "number",
          "documentUrl",
          "canonical",
        ].includes(key)
      ) {
        result[key] = val;
      } else {
        result[key] = await translateObject(val, targetLocale, sourceLocale);
      }
    }
    return result as any;
  }

  return obj;
}

