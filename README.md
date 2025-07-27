# 📝 ToDo List CRUD App — Azure Deployment Guide

## 🔍 Overview

This is a simple **ToDo List** CRUD application with a clean UI. Users can:
- Add a task (including a title, assignee, and description)
- Edit existing tasks
- Delete tasks

It’s designed to be easily deployable in **Microsoft Azure**, using **Azure Functions** for the backend and **Azure Static Web Apps** for the frontend.

---

## 🚀 How to Deploy in Azure

> Follow the steps below in order. Some have important notes to ensure proper configuration.

### 1. Create Azure Resources
- **Create a Resource Group** in Azure.
- **Create a Storage Account** inside the newly created Resource Group.
- **Create a Function App** in the same Resource Group, using the previously created Storage Account.

### 2. Initialize the Azure Function App
From your terminal, run:
```bash
func init todotask-api --javascript
```

### ⚠️ Important Note
Each function should reside in its **own folder**, containing:
- `index.js`
- `function.json`

> Also, in `package.json`, make sure to **remove** the line referencing `src/functions/*.js`.

### 3. Create Function Endpoints
Run the following command for each desired function:
```bash
func new --name FunctionName --template "HTTP trigger" --authlevel "anonymous"
```

### 4. Set Connection Strings
- Add the **AzureWebJobsStorage** environment variable to the Function App.
- The full connection string can be found in the **Storage Account > Access Keys** section.

### 5. Deploy the Function App
From your IDE or terminal:
```bash
func azure functionapp publish YourFunctionAppName
```

---

## 🌐 Frontend Deployment (Static Website)

### 6. Enable Static Website Hosting
- Go to your **Storage Account**
- Under **Data Management > Static Website**, enable it.
- Set `index.html` as the default document.

### 7. Upload Files
- Upload the following to the `$web` container:
  - `index.html`
  - `styles.css`
  - `script.js`

### 8. Configure CORS
- Go to your **Function App > API > CORS**
- Add the **Primary Endpoint** of the static website (found under **Storage account > Data management > Static Website > Primari endpoint**)

---

## ✅ Done!

Your ToDo List App should now be fully functional and accessible via the static website URL.
