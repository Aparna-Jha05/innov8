# CodeSage: AI-Powered Technical Interviews

CodeSage is an AI-powered platform for conducting technical interviews. It provides candidates with a realistic coding environment featuring real-time feedback on code complexity, an agentic interviewer for adaptive hints, and a comprehensive post-interview code quality assessment.

![CodeSage Screenshot](https://storage.googleapis.com/stabl-media/codesage-screenshot.png)

## Features

- **Real-time Complexity Analysis**: Get instant feedback on the algorithmic complexity (Big O) of your code as you type.
- **Agentic Interviewer**: If you get stuck, request a hint via text or voice. The AI agent provides tiered hints that are context-aware of your code and your specific question. Hints are provided in both text and audio format.
- **In-depth Code Quality Report**: After submitting your solution, receive a detailed report assessing code style, readability, problem-solving approach, and suggestions for optimization.
- **Modern Tech Stack**: Built with Next.js, React, Tailwind CSS, and ShadCN UI for a responsive and modern user experience.
- **AI-Powered by Genkit**: Leverages Google's Genkit framework to power its intelligent features, including speech-to-text and text-to-speech.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Getting Started

Follow these steps to get your local development environment up and running.

### 1. Install Dependencies

First, install the necessary project dependencies:

```bash
npm install
```

### 2. Set Up Environment Variables

This project requires an API key from Google AI Studio to use the Gemini models via Genkit.

1.  Create a new file named `.env` in the root of the project.
2.  Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  Add your API key to the `.env` file:

    ```
    GEMINI_API_KEY=your_api_key_here
    ```

### 3. Run the Development Servers

This application requires two separate processes to run concurrently in your terminal:

1.  **Run the Next.js frontend:**
    This command starts the main web application.

    ```bash
    npm run dev
    ```

2.  **Run the Genkit AI flows:**
    In a **new terminal window**, start the Genkit development server. This exposes the AI capabilities to the frontend.

    ```bash
    npm run genkit:dev
    ```

Once both servers are running, you can open your browser to [http://localhost:9002](http://localhost:9002) to see the application in action.

## Available Scripts

- `npm run dev`: Starts the Next.js application in development mode with Turbopack.
- `npm run genkit:dev`: Starts the Genkit flows and development UI.
- `npm run genkit:watch`: Starts the Genkit server with hot-reloading for AI flow development.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the project files using ESLint.

## Project Structure

```
.
├── src
│   ├── ai                  # All Genkit-related code
│   │   ├── flows           # Genkit flows for AI logic
│   │   └── genkit.ts       # Genkit initialization
│   ├── app                 # Next.js App Router pages and layouts
│   │   ├── actions.ts      # Server Actions for client-server communication
│   │   └── page.tsx        # Main application page
│   ├── components          # Reusable React components
│   │   ├── interview       # Components for the active interview view
│   │   ├── layout          # Layout components like the Header
│   │   ├── report          # Components for the final report view
│   │   └── ui              # ShadCN UI components
│   ├── hooks               # Custom React hooks
│   └── lib                 # Utility functions and libraries
├── public                  # Static assets
└── tailwind.config.ts      # Tailwind CSS configuration
```
