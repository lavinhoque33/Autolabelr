from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM

app = FastAPI()

# Load model on startup
# Switch to lighter model
model_name = "deepseek-ai/deepseek-coder-1.3b-instruct"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, device_map="auto")
pipe = pipeline("text-generation", model=model, tokenizer=tokenizer)

class LabelRequest(BaseModel):
    text: str

@app.post("/generate")
async def generate_labels(data: LabelRequest):
    prompt = f"Label the following text with 4–6 keywords:\n\n{data.text}"
    print(prompt)
    # Generate labels
    response = pipe(prompt, max_new_tokens=100, do_sample=False)[0]['generated_text']
    print(response)
    return {"labels_raw": response}
