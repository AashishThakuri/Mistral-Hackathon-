# Strata

**Win with clarity, not document chaos.**

Tender Intelligence is an AI-powered bid intelligence platform that helps teams understand tenders before they respond to them. Instead of acting like a generic AI writer, it turns complex tender documents into structured, actionable intelligence: mandatory requirements, required documents, evaluation criteria, disqualification risks, compliance status, and draft-ready response sections.

The goal is simple: help teams avoid costly submission mistakes and prepare stronger, more compliant bids with confidence.

---

## Why this project exists

Tender and RFP documents are often long, dense, repetitive, and difficult to review under time pressure. Important requirements are frequently buried across annexes, forms, eligibility clauses, technical sections, and submission instructions. Missing one mandatory form, signature, certificate, or clause can disqualify an otherwise strong bid.

Most existing AI writing tools start too late in the workflow. They generate text before the team has fully understood the tender.

Tender Intelligence solves the earlier and more important problem:

- What does this tender actually require?
- What documents are mandatory?
- What could disqualify us?
- How will this bid be evaluated?
- What are we still missing?
- What should we write, and what should we fix first?

This product is designed to answer those questions before submission.

---

## Core idea

Strata transforms tender complexity into bid-ready clarity.

A user uploads a tender package - PDFs, annexes, forms, pricing sheets, and optional company materials - and the system extracts structured intelligence from the documents. It identifies what matters most, what is missing, and what actions the team should take next. Once the tender is understood, the product helps draft grounded, compliance-aware responses.

In short, this is not just a ghostwriter.
It is a **Tender Intelligence and Bid Readiness Platform**.

---

## What makes it different

Most tools in this space are centered on answer generation.
Strata is centered on **understanding, risk detection, and submission readiness**.

### Instead of only generating responses, it also:
- extracts mandatory requirements
- builds a required documents checklist
- flags disqualification risks
- explains evaluation criteria
- creates a compliance matrix
- tracks bid readiness
- generates clarification questions
- grounds drafting in tender evidence and company knowledge

That makes the product more strategic, more trustworthy, and much more useful in real procurement workflows.

---

## Target users

Tender Intelligence is designed for teams involved in high-stakes submissions, including:

- procurement and bid teams
- consulting firms responding to RFPs
- agencies and service providers
- small and mid-sized businesses bidding for contracts
- grant and proposal teams
- enterprise sales teams handling structured questionnaires
- internal compliance or legal reviewers supporting submissions

---

## Primary use cases

### 1. Tender understanding
Upload a tender and quickly understand its structure, requirements, deadlines, and documents.

### 2. Submission risk detection
Find missing forms, hidden clauses, contradictory instructions, and likely disqualification traps before they cause failure.

### 3. Compliance planning
Map every requirement to current status, supporting evidence, and next actions.

### 4. Response drafting
Generate draft responses only after the system has identified what matters and what supporting information is available.

### 5. Final submission review
Run a final readiness check before export, with unresolved risks and missing items clearly surfaced.

---

## Product features

## 1. Tender Upload and Parsing
Users can upload:
- tender PDFs
- annexes
- forms
- pricing sheets
- optional company profile
- certifications and supporting documents

### Why this feature matters
Everything else depends on reliable document understanding. This is the foundation of the product.

---

## 2. Mandatory Requirements Extraction
The system extracts every critical requirement from the tender, especially clauses containing obligations such as must, shall, mandatory, required, and minimum eligibility conditions.

### Output includes
- requirement text
- category
- source clause
- criticality
- current status
- action needed

### Why this feature matters
This is one of the most valuable features in the entire product. Teams often miss requirements because they are scattered across documents. Surfacing them early reduces risk dramatically.

---

## 3. Required Documents Checklist
The platform identifies all required supporting items, such as:
- forms
- declarations
- signatures
- certificates
- references
- pricing schedules
- eligibility documents
- supporting attachments

### Why this feature matters
A bid can fail even when the written response is strong if one critical document is missing.

---

## 4. Evaluation Criteria Extraction
The system detects how the bid will be judged, including:
- technical scoring
- pricing scoring
- experience requirements
- certifications
- delivery expectations
- weighted criteria

### Why this feature matters
Understanding evaluation criteria helps teams prioritize what to emphasize in their response.

---

## 5. Disqualification Risk Detector
This feature flags the things most likely to lose the bid.

### Examples
- missing signatures
- contradictory deadlines
- hidden submission conditions
- unsupported assumptions
- missing mandatory forms
- conflicting document instructions
- incomplete certifications
- format violations

### Why this feature matters
This is the product's strongest emotional feature. It protects users from silent failure.

---

## 6. Compliance Matrix
The product builds a structured matrix showing:
- requirement
- source location
- current compliance status
- available evidence
- missing information
- next action

### Why this feature matters
This gives teams an operational overview of the tender and makes the product feel enterprise-grade and decision-ready.

---

## 7. Bid Readiness Score
The platform provides a summary score based on:
- completeness of required documents
- unresolved critical risks
- compliance coverage
- missing response sections
- confidence in extracted requirements

### Why this feature matters
It gives the user an instant sense of where they stand and improves demo clarity.

---

## 8. Contextual Evidence View
When the user clicks on a requirement, risk, or missing document, the platform shows:
- exact source snippet
- page number
- section name
- why it matters
- related actions

### Why this feature matters
This makes the system trustworthy and far more useful than a black-box AI output.

---

## 9. Response Studio
The product provides a structured writing environment for drafting:
- executive summary
- company overview
- eligibility response
- technical response
- compliance response
- delivery plan
- supporting sections

### Important
This is **not** a simple chat box.
The writing experience is grounded in:
- extracted tender requirements
- evaluation criteria
- company profile
- approved past answers
- compliance logic

### Why this feature matters
Writing still matters, but it should come after understanding. This makes Tender Intelligence feel smarter than a generic AI writer.

---

## 10. Knowledge Vault
A reusable library of:
- approved answers
- company facts
- certifications
- case studies
- team experience
- legal/compliance documents
- past submission content

### Why this feature matters
It reduces repeated work and improves consistency across future bids.

---

## 11. Clarification Question Generator
The platform can propose smart clarification questions for the issuing authority when tender instructions are unclear, contradictory, or incomplete.

### Why this feature matters
This is a strong differentiator. It shows the system is not just extracting text, but reasoning about ambiguity.

---

## 12. Submission Review and Export
Before final submission, the system reviews:
- missing items
- unresolved risks
- incomplete response sections
- readiness to export

### Export options
- full bid package
- compliance matrix
- internal review summary
- response draft package

### Why this feature matters
This creates a satisfying final checkpoint and makes the product feel complete.

---

## Product workflow

1. User uploads tender package
2. System parses and structures the documents
3. Mandatory requirements are extracted
4. Required documents are identified
5. Evaluation criteria are mapped
6. Disqualification risks are surfaced
7. Compliance matrix is generated
8. Bid readiness is scored
9. User reviews evidence-linked findings
10. User drafts responses in Response Studio
11. User runs final submission review
12. User exports the submission package or internal review set

---

## Technical stack

## Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui

### Why
This stack is fast to build with, highly customizable, and strong enough to support a premium UI/UX direction.

## Backend
- FastAPI

### Why
FastAPI is clean for document workflows, AI orchestration, and structured API design.

## Database
- PostgreSQL
- pgvector

### Why
PostgreSQL handles application data, while pgvector supports semantic retrieval for the Knowledge Vault.

## Storage
- Supabase Storage or AWS S3

### Why
Needed for tender files, annexes, generated exports, and company documents.


### Why
Useful if OCR and extraction run asynchronously.

---

## Mistral stack

### OCR and document parsing
- `mistral-ocr-latest`

Used for:
- PDF parsing
- text extraction
- structured document understanding
- preserving layout and sections

### Structured extraction
- Mistral Document AI Annotations

Used for:
- mandatory requirements
- deadlines
- required documents
- evaluation criteria
- tender metadata

### Main reasoning and drafting
- Mistral Medium 3.1

Used for:
- interpreting complex clauses
- identifying risks
- drafting responses
- generating next actions
- clarification questions

### Lightweight helper tasks
- Mistral Small 3.2

Used for:
- short summaries
- classification
- tagging
- lightweight rewrites

### Retrieval
- `mistral-embed`

Used for:
- Knowledge Vault search
- matching past answers
- retrieving certifications or company content

### Structured outputs
- JSON schema mode

Used for:
- risk objects
- compliance rows
- extraction outputs
- checklist items

---

## System architecture overview

### Input layer
- tender files
- annexes
- forms
- pricing sheets
- company documents

### AI processing layer
- OCR and structure parsing
- extraction of requirements and criteria
- risk detection
- retrieval from company knowledge
- response generation

### Application layer
- workspace UI
- response studio
- review flow
- export pipeline

### Output layer
- compliance matrix
- risk report
- readiness score
- clarification questions
- drafted response sections
- export package

---

## Demo flow for hackathon

### Ideal 3-minute demo

1. Open landing page
2. Upload a sample tender package
3. Show animated analysis state
4. Enter Tender Intelligence Workspace
5. Show mandatory requirements extraction
6. Show missing documents and disqualification risks
7. Show compliance matrix
8. Open one evidence-linked requirement
9. Move to Response Studio and generate one grounded answer
10. Show final submission review and bid readiness score

### Why this demo works
It tells a clear story:
- chaos goes in
- intelligence comes out
- risk becomes visible
- writing becomes grounded
- readiness becomes measurable

---

## Positioning

### Product category
Tender Intelligence and Bid Readiness Platform

### What we are not
- not just an AI writer
- not just a PDF summarizer
- not just a proposal generator
- not just a chatbot

### What we are
A system that helps teams understand what matters, avoid disqualification, and prepare stronger submissions.


