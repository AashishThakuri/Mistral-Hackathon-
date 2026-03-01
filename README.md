<div align="center">
  <p style="color: #616467; font-style: italic; font-size: 18px; margin-bottom: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    Built by Team Prophecy for the Mistral AI Hackathon
  </p>
  
  <div style="display: flex; gap: 8px; justify-content: center; align-items: center; margin-bottom: 30px;">
    <img src="https://img.shields.io/badge/BUILT%20WITH-MISTRAL%20AI-F67A32?style=for-the-badge&labelColor=4D4E50" alt="Built with Mistral AI" />
     <img src="https://img.shields.io/badge/REACT%20%2B%20NODE-WEBSITE-DF5746?style=for-the-badge&labelColor=4D4E50" alt="React + Node Website" />
  </div>

  <img src="frontend/public/logo.png" alt="Strata Logo" width="80" />
  <h1 style="border-bottom: none; margin-top: 10px;">Strata</h1>
  <p><strong>The Final Edge in Procurement and Tender Response Strategies</strong></p>
</div>

---

## Overview

Strata is an intelligent, full-stack procurement and tender (RFP/RFQ) management platform built exclusively on the Mistral AI suite of models. Responding to highly complex government and enterprise procurement tenders is a manual, high-stakes process. It requires parsing hundreds of pages of technical compliance material, maintaining accurate knowledge vaults, evaluating critical financial risks, and drafting airtight legal and technical responses.

Strata functions as an autonomous proposal engineer. It ingests complex procurement documents, dissects them into trackable compliance requirements, identifies hidden risks, and provides an end-to-end Draft Studio to automatically construct and verify the final proposal package.

## Core Features and Mistral AI Integrations

### 1. Automated Tender Extraction and Dissection
When a user uploads a new tender document (PDF or DOC), Strata processes the entire file to extract actionable intelligence rather than just generic summaries. This sets the foundation for the entire workspace.

**How it works:**
The backend converts the uploaded file into text and analyzes the document structure. It pulls out every mandatory rule, supporting document requirement, evaluation metric, and hidden legal risk. It also detects critical metadata like the procurement category, issuing authority, and exact submission deadline. 

**Mistral AI Models Used:**
*   **Mistral-OCR (mistral-ocr-latest):** Used to reliably extract text, tables, and structural elements from complex, multi-page PDFs, ensuring no fine-print requirement is missed.
*   **Mistral-Large (mistral-large-latest):** Used to process the extracted text. Mistral Large is prompted with a strict JSON schema to categorize the text into logical arrays: 'mandatory_requirements', 'required_documents', 'evaluation_criteria', and 'risk_flags'.

### 2. The 12-Section Synchronized Draft Studio
The Draft Studio is a complete proposal sandbox where the user writes and finalizes the bid. It breaks the response down into 12 standardized sections (Executive Summary, Technical Response, Pricing Sheets, Legal Exceptions, etc.).

**How it works:**
As the user clicks through different sections in the sidebar, the center and right panels dynamically update based on the parsed tender data.
*   **Contextual Sourcing:** If the user is on the "Technical Response" section, the right panel automatically surfaces the exact verbatim text and page numbers from the RFP that dictate the technical requirements.
*   **Dynamic Checklists:** Sub-requirements specific to that exact section are displayed with "Missing" or "Added" statuses depending on the draft text.
*   **Risk Context:** Any risks or blockers detected during the initial parse that affect the current section are displayed as contextual warnings.

**Mistral AI Models Used:**
*   **Mistral-Large (mistral-large-latest):** Used for all contextual text generation within the Draft Studio. When the user clicks "Draft response for linked requirement," Mistral Large creates a compliant response specifically addressing the surface criteria. It is also used for the quick-action toolbar to rewrite text to be "More Formal," "Improve Compliance Tone," or to "Shorten" the draft natively in the editor.

### 3. Voice Clarification Capture
In real-world procurement, requirements frequently change based on pre-bid meetings or clarification calls with the contracting officer. Strata captures this offline intelligence and merges it into the response strategy.

**How it works:**
The user uploads a raw audio recording (WAV, MP3, etc.) of their clarification call directly into the Draft Studio. Strata processes the audio, distinguishes between speakers, and extracts key procurement insights. These insights are mapped into the workspace so the proposal team knows exactly what assumptions changed and what new action items exist.

**Mistral AI Models Used:**
*   **Mistral Voxtral (voxtral-mini-latest):** Processes the raw audio file. It handles speaker diarization, segment timestamping, and language detection to generate a highly accurate text transcript.
*   **Mistral-Large (mistral-large-latest):** Immediately ingests the transcript output from Voxtral to extract and categorize structural data: "Decisions Made," "Action Items," "Changed Assumptions," and "Unresolved Questions," formatting them for the frontend UI.

### 4. The Unified Analysis Workspace
A fluid, zero-clutter dashboard designed for business development and capture management teams to track the exact health of their proposal before submitting.

**How it works:**
The workspace provides a live holistic view of the tender.
*   **Live Deadline Tracking:** A persistent, dismissible banner displays the exact countdown to the submission deadline extracted from the tender.
*   **Risk Register:** A dedicated tab mapping out High, Medium, and Low severity risks, including the "Why it matters" impact and system-generated mitigation strategies.
*   **Compliance Matrix:** A table tracking every single extracted requirement against an automatically assessed Compliance Status and required Evidence.
*   **Document Vault:** Tracks which required documents (like CAD drawings or ISO certifications) are missing in the user's uploaded repository.

**Mistral AI Models Used:**
*   **Mistral-Large (mistral-large-latest):** Responsible for the continuous analysis logic that cross-references the user's drafted text and uploaded documents against the original tender requirements to power the Compliance Matrix and Risk warnings.

## Technical Architecture

**Frontend Client:**
*   React 18 with TypeScript running on Vite.
*   TailwindCSS for the utility-first, fully fluid layout system.
*   Framer Motion for layout transitions, tab switching, and micro-animations.
*   Real-time fluid UI elements that adjust instantly to sidebar visibility for maximized reading space.

**Backend Service:**
*   Node.js with Express.
*   Multer middleware for processing multipart/form-data document and audio uploads.
*   The official `@mistralai/mistralai` JavaScript SDK (v1.14) integration mapping `mistral-large-latest`, `mistral-ocr-latest`, and `voxtral-mini-latest` to distinct service controllers.

## Running Locally

1. Clone the repository to your local machine.
2. Ensure you have Node.js installed.
3. Open two separate terminal windows.

**In Terminal 1 (Backend Initialization):**
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add your API credentials:
```env
MISTRAL_API_KEY=your_mistral_api_key_here
PORT=3000
```
Start the backend server:
```bash
npm start
```

**In Terminal 2 (Frontend Initialization):**
```bash
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:5173` in your browser to access the Strata interface.

---
*Developed by Team Prophecy.*
