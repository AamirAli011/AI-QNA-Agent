# AI-Powered Q&A Chatbot

This is a **Full-Stack AI-powered Q&A chatbot** using:
- **Backend:** Django & Google Gemini AI API
- **Frontend:** React

## **Project Structure**
```
ai_qna/
│── backend/       # Django Backend
│── frontend/      # React Frontend
│── .gitignore     # Git Ignore File
│── README.md      # Documentation
```

---
## **Backend Setup (Django)**
### **1. Navigate to Backend Directory**
```bash
cd backend
```

### **2. Create & Activate Virtual Environment**
```bash
python3 -m venv venv
source venv/bin/activate  # For macOS/Linux
venv\Scripts\activate     # For Windows
```

### **3. Install Dependencies**
```bash
pip install -r requirements.txt
```

### **4. Set Up Environment Variables**
Create a **`.env`** file in `backend/` and add:
```ini
GEMINI_API_KEY=your_api_key_here
```

### **5. Run Migrations & Start Server**
```bash
python manage.py migrate
python manage.py runserver
```

---
## **Frontend Setup (React)**
### **1. Navigate to Frontend Directory**
```bash
cd frontend
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Start React App**
```bash
npm start
```

---
## **How It Works**
### **Backend (Django + Google Gemini AI)**
1. Receives user queries from frontend.
2. Sends the query + conversation history to **Google Gemini AI API**.
3. Returns AI-generated responses back to frontend.
4. Maintains conversation history for context-aware responses.

### **Frontend (React UI)**
1. Displays messages in a **chat UI** with user/AI bubbles.
2. Sends user queries to backend.
3. Updates UI with AI-generated responses dynamically.

---
## **Troubleshoo## **Contributing**
Feel free to contribute by submitting **issues & pull requests**!

---ting**
### **Common Errors & Fixes**
| Issue  | Solution  |
|---|---|
| `ModuleNotFoundError: No module named 'django'` | Run `pip install -r requirements.txt` |
| `GEMINI_API_KEY is None` | Ensure `.env` is set up & restart backend |
| `403 Forbidden Error` | Check API Key validity or billing status |
