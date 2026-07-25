# SkillSync AI — Resume Analyzer

An AI-powered resume analyzer built with Next.js 14 (App Router), TypeScript,
Tailwind CSS, and Google Gemini. Upload a PDF resume and get an ATS score,
strengths/weaknesses, missing skills, improvement suggestions, recommended
job roles, and keyword optimization tips.

## Folder Structure

```
skillsync-ai/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts        # POST endpoint: PDF -> text -> Gemini -> JSON
│   ├── resume/
│   │   └── page.tsx            # Upload UI + results dashboard (client component)
│   ├── globals.css             # Tailwind directives + dark theme base styles
│   ├── layout.tsx              # Root layout, metadata
│   └── page.tsx                # Landing page -> links to /resume
├── .env.local.example          # Copy to .env.local and add your key
├── next.config.js              # Marks pdf-parse as a server-external package
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Setup Steps

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Get a Gemini API key**

   Create one at [Google AI Studio](https://aistudio.google.com/app/apikey).

3. **Configure environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Then edit `.env.local`:

   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` and click "Analyze My Resume", or go
   directly to `http://localhost:3000/resume`.

5. **Build for production**

   ```bash
   npm run build
   npm start
   ```

## Required npm packages

| Package | Purpose |
|---|---|
| `next`, `react`, `react-dom` | Core framework |
| `@google/generative-ai` | Official Gemini SDK, used server-side to call `gemini-1.5-flash` |
| `pdf-parse` | Extracts raw text from uploaded PDF resumes on the server (Node-only, avoids pdf.js worker issues) |
| `typescript`, `@types/*` | Type safety |
| `tailwindcss`, `postcss`, `autoprefixer` | Styling |

## How it works

1. The user selects/drops a PDF on `/resume` (`app/resume/page.tsx`).
2. On "Analyze Resume", the file is sent via `FormData` to `POST /api/analyze`.
3. The API route (`app/api/analyze/route.ts`):
   - Reads the file into a `Buffer`.
   - Extracts text using `pdf-parse` (pure Node, no browser/worker dependency — this sidesteps the classic `pdf.worker.js` errors you get trying to use `pdf.js` directly inside a Next.js server route).
   - Builds a structured prompt and calls Gemini (`gemini-1.5-flash`) with `responseMimeType: "application/json"` so the model returns clean JSON.
   - Validates/normalizes the JSON and returns it to the client.
4. The client renders the result as a score ring plus categorized cards (strengths, weaknesses, missing skills, suggestions, roles, keywords).

## Notes on PDF handling

- Scanned/image-only PDFs will not extract meaningful text since `pdf-parse`
  only reads embedded text layers (no OCR). The API returns a clear error
  in that case.
- Resume text is truncated to ~15,000 characters before being sent to Gemini
  to stay within prompt limits — this comfortably covers multi-page resumes.

## Notes on Gemini model choice

`gemini-1.5-flash` is used for speed/cost. Swap the `MODEL_NAME` constant in
`app/api/analyze/route.ts` to `gemini-1.5-pro` for higher-quality analysis at
higher latency/cost.
