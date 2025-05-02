# 🧠 AutoLabelr

AutoLabelr is a fullstack AI-assisted text classification playground. It allows users to paste or upload text, generate intelligent labels using DeepSeek (LLM), and search across labeled entries using Elasticsearch — all from a polished, fully local web interface.

---

## ✨ Features

-   ✅ **LLM-powered label generation** using DeepSeek Coder (run locally with HuggingFace `transformers`)
-   📁 **Text or file upload** — supports pasted text and `.txt`/`.md` file processing
-   🔍 **Full-text + fuzzy search** powered by Elasticsearch
-   ↻ **Pagination + result highlighting**
-   🎛️ **Strict match toggle** for exact/fuzzy control
-   🎨 **Smooth UI transitions**, routed navigation, and responsive design

---

## 🧱 Tech Stack

| Layer         | Tools Used                                                        |
| ------------- | ----------------------------------------------------------------- |
| Frontend      | React (Vite), TailwindCSS, React Router, shadcn/ui, Framer Motion |
| Backend       | Node.js, Express, Multer (file uploads), Axios                    |
| LLM Server    | FastAPI, HuggingFace Transformers, DeepSeek Coder                 |
| Search Engine | Elasticsearch                                                     |
| Utilities     | Faker (for test data), Markdown, Docker (optional)                |

---

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/your-username/autolabelr.git
cd autolabelr
```

Install dependencies in all services:

```bash
cd client && npm install
cd ../server && npm install
cd ../inference && pip install -r requirements.txt
```

---

### 2. Start Each Service

**LLM Server (FastAPI + DeepSeek)**

```bash
cd inference
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

**Backend API (Express.js)**

```bash
cd server
node index.js
```

**Frontend (React + Vite)**

```bash
cd client
npm run dev
```

---

### 3. Seed Test Data (Optional)

```bash
cd server
node scripts/seed.js
```

---

## 🔍 Example Use Case

1. Upload a `.txt` file with bug report text
2. DeepSeek locally generates smart tags like `bug`, `react`, `memory leak`
3. The entry is saved + indexed in Elasticsearch
4. Later, search by keyword, tag, or fuzzy query with live highlighting

---

## 🖼️ Screenshots (optional)

> &#x20;

---

## 🧠 Model Info

-   Uses [DeepSeek Coder 1.3B Instruct](https://huggingface.co/deepseek-ai/deepseek-coder-1.3b-instruct) for fast local inference
-   Can be upgraded to larger models (e.g., 6.7B) with GPU

---

## 📚 Learn More

-   [FastAPI Docs](https://fastapi.tiangolo.com)
-   [Elasticsearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)
-   [DeepSeek Coder](https://huggingface.co/deepseek-ai)

---

## 🙌 Author

**Iram Tazim Hoque**\
• [LinkedIn](https://www.linkedin.com/in/lavinhoque33/)

---

## 📄 License

This project is licensed under the MIT License.
