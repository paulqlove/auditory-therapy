# 40-Hz Auditory Therapy

A simple web app that generates 40-Hz auditory stimulation for gamma entrainment, based on recent research suggesting potential benefits for Alzheimer's disease.

## Background

A [January 2026 study](https://medicalxpress.com/news/2026-01-successful-hz-auditory-aged-monkeys.html) from the Kunming Institute of Zoology demonstrated that daily 40-Hz auditory stimulation significantly elevated beta-amyloid protein levels in the cerebrospinal fluid of aged rhesus monkeys. Key findings:

- Nine aged rhesus macaques (26-31 years old) received 1 hour of 40-Hz auditory stimulation daily for 7 days
- Aβ42 protein levels increased by 205.61%, Aβ40 by 201.00%
- Effects persisted for at least 5 weeks post-treatment
- This is the first non-human primate experimental evidence supporting 40-Hz stimulation as a noninvasive therapy for Alzheimer's disease

The study was published in the *Proceedings of the National Academy of Sciences*.

## What This App Does

- Plays a 1 kHz carrier tone amplitude-modulated at 40 Hz (the standard approach used in gamma entrainment studies)
- Optional toggle to switch to a pure 40 Hz tone
- 60-minute countdown timer (matching the study's 1-hour protocol)
- Adjustable volume control
- Start, stop, and reset controls

## How to Run

### Option 1: Open Directly

Simply open `index.html` in your web browser by double-clicking the file.

### Option 2: Local Server (Recommended)

**macOS/Linux:**
```bash
cd auditory-therapy
python3 -m http.server 8000
```
Then visit http://localhost:8000

**Windows (with Python):**
```bash
cd auditory-therapy
python -m http.server 8000
```
Then visit http://localhost:8000

### Windows Without Python

If you don't have Python installed, you have a few options:

1. **Just open the file** - Double-click `index.html` to open it directly in your browser. This works fine for this app.

2. **Install Python** - Download from [python.org](https://www.python.org/downloads/windows/). During installation, check "Add Python to PATH".

3. **Use Node.js** - If you have Node.js installed:
   ```bash
   npx serve
   ```

4. **Use VS Code Live Server** - Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) and click "Go Live".

## Disclaimer

This app is for personal experimental use only. It is not a medical device and has not been evaluated by any regulatory agency. Consult a healthcare professional before using this for any therapeutic purpose.
