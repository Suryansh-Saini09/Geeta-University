import type { SearchDocument, SearchResultItem, SearchResultsResponse } from "./types";
import { getSearchIndex } from "./searchIndex";

// Standard English stop words to strip during tokenization (unless quoted)
export const STOP_WORDS = new Set([
  "of",
  "the",
  "in",
  "and",
  "to",
  "a",
  "for",
  "on",
  "with",
  "at",
  "by",
  "from",
  "an",
  "is",
  "are",
  "as",
  "or",
  "it",
  "be",
]);

export function isStopWord(term: string): boolean {
  return STOP_WORDS.has(term.trim().toLowerCase());
}

// Common education acronym expansions for higher search accuracy
const ACRONYM_MAP: Record<string, string[]> = {
  cse: ["computer", "science", "engineering", "btech"],
  btech: ["b.tech", "technology", "engineering"],
  mtech: ["m.tech", "technology", "engineering"],
  bba: ["bachelor", "business", "administration", "management"],
  mba: ["master", "business", "administration", "management"],
  bca: ["bachelor", "computer", "applications"],
  mca: ["master", "computer", "applications"],
  bsc: ["bachelor", "science"],
  msc: ["master", "science"],
  bcom: ["bachelor", "commerce"],
  mcom: ["master", "commerce"],
  llb: ["law", "bachelor", "legal"],
  llm: ["law", "master", "legal"],
  phd: ["doctoral", "doctor", "philosophy", "research"],
  guts: ["entrance", "exam", "scholarship", "talent", "search"],
  cuet: ["common", "university", "entrance", "test"],
  dyod: ["design", "your", "own", "degree"],
  gfs: ["geeta", "finishing", "school"],
  gth: ["geeta", "technical", "hub"],
};

// Levenshtein distance helper for typo tolerance (e.g. "computr" -> "computer")
export function getLevenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Checks if query token fuzzy-matches target word with safe bounds
 */
function isFuzzyMatch(token: string, targetWord: string): boolean {
  if (token.length < 4 || targetWord.length < 4) return false;
  if (Math.abs(token.length - targetWord.length) > 2) return false;
  if (targetWord.startsWith(token.substring(0, 2))) {
    const dist = getLevenshteinDistance(token, targetWord);
    return dist <= 2;
  }
  return false;
}

/**
 * Escapes regex special characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Counts occurrences of a term using whole-word boundary
 */
function countTermOccurrences(text: string, term: string): number {
  if (!text || !term) return 0;
  const escaped = escapeRegex(term);
  const regex = new RegExp(`\\b${escaped}\\b`, "gi");
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

/**
 * Checks if text contains exact word boundary match
 */
function textContainsWord(text: string, term: string): boolean {
  if (!text || !term) return 0 !== 0;
  const escaped = escapeRegex(term);
  const regex = new RegExp(`\\b${escaped}\\b`, "i");
  return regex.test(text);
}

/**
 * Generates a clean 160-character snippet around matched search terms
 */
export function generateSnippet(
  doc: SearchDocument,
  matchedTokens: string[],
  exactPhrase?: string
): string {
  const fullText = [doc.description, doc.content || ""].filter(Boolean).join(" ");
  if (!fullText.trim()) return doc.description || doc.title;

  const lowerText = fullText.toLowerCase();
  let firstMatchIndex = -1;

  // 1. Try finding exact consecutive phrase first
  if (exactPhrase && exactPhrase.length > 2) {
    const pIdx = lowerText.indexOf(exactPhrase);
    if (pIdx !== -1) {
      firstMatchIndex = pIdx;
    }
  }

  // 2. Otherwise find earliest matching non-stop token
  if (firstMatchIndex === -1) {
    for (const token of matchedTokens) {
      if (isStopWord(token)) continue;
      const regex = new RegExp(`\\b${escapeRegex(token)}\\b`, "i");
      const match = regex.exec(lowerText);
      if (match && (firstMatchIndex === -1 || match.index < firstMatchIndex)) {
        firstMatchIndex = match.index;
      }
    }
  }

  if (firstMatchIndex === -1) {
    return fullText.length > 170 ? fullText.substring(0, 167) + "..." : fullText;
  }

  const start = Math.max(0, firstMatchIndex - 45);
  const end = Math.min(fullText.length, firstMatchIndex + 125);
  let snippet = fullText.substring(start, end).trim();

  if (start > 0) snippet = "..." + snippet;
  if (end < fullText.length) snippet = snippet + "...";

  return snippet;
}

/**
 * Parsed Query Structure
 */
interface ParsedQuery {
  rawQuery: string;
  isQuoted: boolean;
  exactPhrase: string;
  rawTokens: string[];
  searchTokens: string[];
  requiredTokens: string[];
}

/**
 * Parses user search query:
 * - Identifies explicit quote wrappers ("..." or '...')
 * - Strips stop words from required tokens unless quoted or all are stop words
 * - Expands educational acronyms (e.g. cse -> btech, computer, science, engineering)
 */
export function parseSearchQuery(rawQuery: string): ParsedQuery {
  const trimmed = rawQuery.trim();
  const lower = trimmed.toLowerCase();

  // Check if query is wrapped in quotes
  const isQuoted =
    (lower.startsWith('"') && lower.endsWith('"')) ||
    (lower.startsWith("'") && lower.endsWith("'"));

  const unquotedPhrase = lower.replace(/["']/g, "").replace(/\s+/g, " ").trim();

  // Extract raw word tokens
  const rawTokens = unquotedPhrase
    .replace(/[^\w\s-]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  let searchTokens: string[] = [];
  let requiredTokens: string[] = [];

  if (isQuoted) {
    // Inside quotes: keep all tokens including stop words for exact matching
    searchTokens = [...rawTokens];
    requiredTokens = [...rawTokens];
  } else {
    // Strip common stop words from required tokens
    const nonStopTokens = rawTokens.filter((t) => !STOP_WORDS.has(t));

    // If query consisted ONLY of stop words (e.g. "of" or "the"), fallback to raw tokens
    requiredTokens = nonStopTokens.length > 0 ? nonStopTokens : rawTokens;

    // Expand acronyms into search tokens
    const tokenSet = new Set<string>(rawTokens);
    for (const t of rawTokens) {
      if (ACRONYM_MAP[t]) {
        ACRONYM_MAP[t].forEach((exp) => tokenSet.add(exp));
      }
    }
    searchTokens = Array.from(tokenSet);
  }

  return {
    rawQuery: trimmed,
    isQuoted,
    exactPhrase: unquotedPhrase,
    rawTokens,
    searchTokens,
    requiredTokens,
  };
}

/**
 * Precomputes BM25 IDF (Inverse Document Frequency) for all terms in the corpus
 */
function computeCorpusIDF(
  documents: SearchDocument[],
  tokens: string[]
): Map<string, number> {
  const N = documents.length;
  const idfMap = new Map<string, number>();

  for (const token of tokens) {
    let docCount = 0;
    for (const doc of documents) {
      const titleLower = doc.title.toLowerCase();
      const descLower = doc.description.toLowerCase();
      const contentLower = (doc.content || "").toLowerCase();
      const tagsLower = [
        doc.category,
        doc.subcategory || "",
        ...(doc.keywords || []),
        ...(doc.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      if (
        textContainsWord(titleLower, token) ||
        textContainsWord(descLower, token) ||
        textContainsWord(tagsLower, token) ||
        textContainsWord(contentLower, token)
      ) {
        docCount++;
      }
    }

    // Standard smoothed BM25 IDF
    const idf = Math.log(1 + (N - docCount + 0.5) / (docCount + 0.5));
    idfMap.set(token, Math.max(0.1, idf));
  }

  return idfMap;
}

/**
 * Central Search Engine Function
 * Performs:
 * 1. Multi-word relevance scoring with BM25 algorithm
 * 2. Stop word elimination during tokenization & matching
 * 3. 75%+ term coverage constraint (AND / Min-Should-Match)
 * 4. 10x Exact phrase boosting in title, keywords, & body
 * 5. Weighted field scoring (Title/Slug 5x, Description/Tags 3x, Body 1x)
 * 6. Typo tolerance and acronym expansion
 */
export function searchWebsite(
  rawQuery: string,
  page = 1,
  pageSize = 10,
  customIndex?: SearchDocument[]
): SearchResultsResponse {
  const query = rawQuery.trim();
  if (!query) {
    return {
      results: [],
      totalResults: 0,
      query: "",
      page: 1,
      pageSize,
      totalPages: 0,
    };
  }

  const documents = customIndex || getSearchIndex();
  const parsed = parseSearchQuery(query);

  if (parsed.rawTokens.length === 0) {
    return {
      results: [],
      totalResults: 0,
      query,
      page: 1,
      pageSize,
      totalPages: 0,
    };
  }

  // Precompute IDF for search tokens
  const idfMap = computeCorpusIDF(documents, parsed.searchTokens);

  // Compute average document length across corpus for BM25 normalization
  let totalDocLength = 0;
  for (const doc of documents) {
    const text = [
      doc.title,
      doc.description,
      doc.content || "",
      doc.category,
      doc.subcategory || "",
    ].join(" ");
    totalDocLength += text.split(/\s+/).length;
  }
  const avgDocLength = documents.length > 0 ? totalDocLength / documents.length : 100;

  // BM25 parameters
  const k1 = 1.2;
  const b = 0.75;

  // Coverage requirement: At least 75% of non-stop-word required terms must match
  const requiredCount = parsed.requiredTokens.length;
  const minMatchesRequired = Math.max(1, Math.ceil(requiredCount * 0.75));

  const scoredItems: SearchResultItem[] = [];

  for (const doc of documents) {
    const titleLower = doc.title.toLowerCase();
    const slugLower = (doc.slug || doc.href || "").toLowerCase();
    const descLower = doc.description.toLowerCase();
    const contentLower = (doc.content || "").toLowerCase();
    const categoryLower = doc.category.toLowerCase();
    const subcategoryLower = (doc.subcategory || "").toLowerCase();
    const keywordsLower = [
      ...(doc.keywords || []),
      ...(doc.tags || []),
    ]
      .join(" ")
      .toLowerCase();

    const fullDocText = [
      titleLower,
      slugLower,
      descLower,
      categoryLower,
      subcategoryLower,
      keywordsLower,
      contentLower,
    ].join(" ");

    const docWords = fullDocText.split(/\s+/);
    const docLength = docWords.length;

    // Track matching tokens
    const matchedRequiredTokens = new Set<string>();
    const matchedTokensSet = new Set<string>();

    /* ── A. FIELD-WEIGHTED TERM FREQUENCY & BM25 ── */
    let bm25Score = 0;

    for (const token of parsed.searchTokens) {
      const isReq = parsed.requiredTokens.includes(token);
      let termMatched = false;

      // Count whole-word occurrences per field
      const countTitle = countTermOccurrences(titleLower, token);
      const countSlug = countTermOccurrences(slugLower, token);
      const countDesc = countTermOccurrences(descLower, token);
      const countKeywords =
        countTermOccurrences(keywordsLower, token) +
        countTermOccurrences(categoryLower, token) +
        countTermOccurrences(subcategoryLower, token);
      const countContent = countTermOccurrences(contentLower, token);

      // Weighted Term Frequency: Title/Slug (5x), Meta/Tags (3x), Body (1x)
      const weightedTF =
        (countTitle + countSlug) * 5 +
        (countDesc + countKeywords) * 3 +
        countContent * 1;

      if (weightedTF > 0) {
        termMatched = true;
        matchedTokensSet.add(token);
        if (isReq) matchedRequiredTokens.add(token);

        const idf = idfMap.get(token) || 1.0;
        const normDocLen = docLength / avgDocLength;
        const tfSat = (weightedTF * (k1 + 1)) / (weightedTF + k1 * (1 - b + b * normDocLen));
        bm25Score += idf * tfSat * 20;
      } else {
        // Levenshtein fuzzy match if length >= 4
        if (token.length >= 4) {
          for (const word of docWords) {
            if (isFuzzyMatch(token, word)) {
              termMatched = true;
              matchedTokensSet.add(word);
              if (isReq) matchedRequiredTokens.add(token);
              const idf = idfMap.get(token) || 1.0;
              bm25Score += idf * 8; // discounted fuzzy match
              break;
            }
          }
        }
      }
    }

    /* ── B. MATCHING STRATEGY (75%+ non-stop-word coverage) ── */
    // If query has non-stop terms, require at least minMatchesRequired non-stop terms
    if (matchedRequiredTokens.size < minMatchesRequired) {
      // Discard document completely
      continue;
    }

    let totalScore = bm25Score;

    /* ── C. EXACT CONSECUTIVE PHRASE BOOST (10x Maximum Weight) ── */
    if (parsed.exactPhrase && parsed.exactPhrase.length > 2) {
      const phrase = parsed.exactPhrase;

      // Title exact phrase matches (10x maximum boost)
      if (titleLower === phrase) {
        totalScore += 2500;
      } else if (titleLower.startsWith(phrase)) {
        totalScore += 1800;
      } else if (titleLower.includes(phrase)) {
        totalScore += 1200;
      }

      // Slug exact phrase match
      if (slugLower.includes(phrase.replace(/\s+/g, "-"))) {
        totalScore += 1000;
      }

      // Keywords exact phrase match
      if (keywordsLower.includes(phrase)) {
        totalScore += 700;
      }

      // Description & Body exact phrase match
      if (descLower.includes(phrase)) {
        totalScore += 500;
      }
      if (contentLower.includes(phrase)) {
        totalScore += 350;
      }

      // If user wrapped in quotes and no exact phrase match, penalize
      if (parsed.isQuoted && !fullDocText.includes(phrase)) {
        continue;
      }
    }

    /* ── D. COVERAGE BONUSES ── */
    // 100% required terms coverage bonus
    if (matchedRequiredTokens.size === requiredCount && requiredCount > 1) {
      totalScore += 300;
    }

    const matchedTerms = Array.from(matchedTokensSet);
    const snippet = generateSnippet(doc, matchedTerms, parsed.exactPhrase);

    scoredItems.push({
      document: doc,
      score: Math.round(totalScore * 10) / 10,
      snippet,
      matchedTerms,
    });
  }

  // Sort descending by relevance score
  scoredItems.sort((a, b) => b.score - a.score);

  const totalResults = scoredItems.length;
  const totalPages = Math.ceil(totalResults / pageSize) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedResults = scoredItems.slice(startIndex, startIndex + pageSize);

  return {
    results: paginatedResults,
    totalResults,
    query,
    page: currentPage,
    pageSize,
    totalPages,
  };
}
