# Mini-Audit-Trail-Generator


A full-stack **Next.js** application that tracks text changes and automatically generates an audit trail. Each time the user saves content, the system creates a new version with a detailed diff showing:

- Added words  
- Removed words  
- Content length  
- Timestamp  
- Full saved content  

This project demonstrates frontend development, API creation, version tracking logic, and clean UI design — suitable for internship and full-stack evaluation tasks.

---

## 📌 Features

- ✍️ **Rich text editor**
- 💾 **Save Version** with one click
- 🔍 **Automatic diff calculation**  
  - Detects added words  
  - Detects removed words  
  - Shows +added / −removed count  
- 🕒 **Timestamp for every version**
- 📜 **Version history sidebar**
- 🔎 **Expandable content preview**
- 🎨 **Clean and modern UI**
- ⚡ **Fast Next.js API routes**
- 🗂️ Local JSON-based storage (optional)

---

## 🛠️ Tech Stack

- **Next.js**
- **React**
- **JavaScript**
- **Node.js**
- **UUID for version IDs**
- **CSS (Custom Styles)**

├── pages
│ ├── index.js # Main UI
│ └── api
│ ├── versions.js # Get versions
│ └── save-version.js # Save version
├── styles
│ ├── globals.css
│ └── index.css
├── utils
│ └── compare.js # Diff logic
├── data # Optional storage
├── package.json
└── README.md


---

## 🚀 Running the Project Locally

### 1. Install dependencies
```bash
npm install

npm run dev -- -p 3001

http://localhost:3001





