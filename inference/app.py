from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM

app = FastAPI()

# Load model on startup
tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/deepseek-coder-6.7b-instruct")
model = AutoModelForCausalLM.from_pretrained("deepseek-ai/deepseek-coder-6.7b-instruct", device_map="auto")
pipe = pipeline("text-generation", model=model, tokenizer=tokenizer)

class LabelRequest(BaseModel):
    text: str

@app.post("/generate")
async def generate_labels(data: LabelRequest):
    prompt = f"Label the following text with 4–6 keywords:\n\n{data.text}"
    response = pipe(prompt, max_new_tokens=100, do_sample=False)[0]['generated_text']
    return {"labels_raw": response}
