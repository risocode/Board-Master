import type { Question, AnswerChoice } from '@/types/quiz';
import { v4 as uuidv4 } from 'uuid'; // Assuming uuid is installed, if not, can use Math.random or other simple id generator

// Helper to ensure uuid is available or provide a fallback
const generateId = (): string => {
  try {
    return uuidv4();
  } catch (e) {
    // Fallback if uuid is not available (e.g. in environments where crypto is limited or package not installed)
    // This is a very basic fallback and not guaranteed to be unique in large datasets.
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
};


export function parseJsonQuestions(jsonString: string): Question[] {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data)) {
      throw new Error("JSON data must be an array of questions.");
    }
    // Basic validation for question structure
    return data.map((q: any) => ({
      id: q.id || generateId(),
      text: q.text || "No question text provided",
      choices: Array.isArray(q.choices) 
        ? q.choices.map((c: any) => ({
            id: c.id || generateId(),
            text: c.text || "No choice text"
          }))
        : [],
      correctAnswerId: q.correctAnswerId || (q.choices && q.choices.length > 0 ? q.choices[0].id || generateId() : generateId()), // Default to first choice if not specified
      explanation: q.explanation || "",
    }));
  } catch (error) {
    console.error("Error parsing JSON questions:", error);
    throw new Error("Invalid JSON format for questions.");
  }
}

export function parseTextQuestions(text: string): Question[] {
  const questions: Question[] = [];
  const questionBlocks = text.split("---").map(block => block.trim()).filter(block => block.length > 0);

  questionBlocks.forEach(block => {
    const lines = block.split("\n").map(line => line.trim());
    if (lines.length < 2) return; // Must have question text and at least one choice

    const questionText = lines[0];
    const choices: AnswerChoice[] = [];
    let correctAnswerId = "";
    let explanation = "";

    const choiceLines = lines.slice(1);
    const choiceRegex = /^([*]?)([A-Za-z])\)\s*(.*)/;

    for (const line of choiceLines) {
      if (line.toLowerCase().startsWith("explanation:")) {
        explanation = line.substring("explanation:".length).trim();
        continue;
      }

      const match = line.match(choiceRegex);
      if (match) {
        const isCorrect = match[1] === "*";
        // const letter = match[2]; // Letter not directly used for ID unless mapping needed
        const choiceText = match[3];
        const choiceId = generateId();
        choices.push({ id: choiceId, text: choiceText });
        if (isCorrect) {
          correctAnswerId = choiceId;
        }
      }
    }

    if (questionText && choices.length > 0 && correctAnswerId) {
      questions.push({
        id: generateId(),
        text: questionText,
        choices,
        correctAnswerId,
        explanation: explanation || undefined,
      });
    } else if (questionText && choices.length > 0 && !correctAnswerId && choices.length === 1) {
      // If only one choice and not marked, assume it's correct (e.g. for true/false simplified)
      // Or better, enforce explicit correct answer marking. For now, let's make it strict.
      console.warn(`Question "${questionText}" skipped: No correct answer marked or ambiguous.`);
    }
  });

  return questions;
}

// Ensure uuid is installed or handle its absence more gracefully if used in production.
// For this scaffold, we'll assume it might not be present and provide a basic fallback.
// If `uuid` is a dependency, this try-catch for generateId is not strictly needed for uuidv4 itself,
// but good for robust id generation.
// For now, let's remove the uuid dependency to simplify setup for the user.
// We'll use a simpler ID generator.

const simpleId = () => Math.random().toString(36).substring(2, 15);

export function parseJsonQuestionsSimpleId(jsonString: string): Question[] {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data)) {
      throw new Error("JSON data must be an array of questions.");
    }
    return data.map((q: any) => {
      const choices = Array.isArray(q.choices)
        ? q.choices.map((c: any) => ({
            id: c.id || simpleId(),
            text: c.text || "No choice text"
          }))
        : [];
      let correctAnswerId = q.correctAnswerId;
      if (!correctAnswerId && choices.length > 0) {
        // If correctAnswerId is not provided, try to find it based on a property like isCorrect
        const correctChoice = choices.find((c: any) => c.isCorrect === true);
        if (correctChoice) {
          correctAnswerId = correctChoice.id;
        } else if (choices.length > 0) {
          correctAnswerId = choices[0].id; // Fallback to first choice
        } else {
          correctAnswerId = simpleId(); // Fallback if no choices
        }
      } else if (!correctAnswerId) {
        correctAnswerId = simpleId();
      }

      return {
        id: q.id || simpleId(),
        text: q.text || "No question text provided",
        choices,
        correctAnswerId,
        explanation: q.explanation || "",
      };
    });
  } catch (error) {
    console.error("Error parsing JSON questions:", error);
    throw new Error("Invalid JSON format for questions. Ensure it's an array of questions with text, choices (array of {id, text}), and correctAnswerId.");
  }
}


export function parseTextQuestionsSimpleId(text: string): Question[] {
  const questions: Question[] = [];
  const questionBlocks = text.split("---").map(block => block.trim()).filter(block => block.length > 0);

  questionBlocks.forEach(block => {
    const lines = block.split("\n").map(line => line.trim());
    if (lines.length < 2) return; 

    const questionText = lines[0];
    const currentChoices: AnswerChoice[] = [];
    let currentCorrectAnswerId = "";
    let currentExplanation = "";

    const choiceLines = lines.slice(1);
    const choiceRegex = /^([*]?)([A-Za-z][).]?|[0-9][).]?)\s*(.*)/; // Matches *A) text, A. text, 1) text, etc.

    for (const line of choiceLines) {
      if (line.toLowerCase().startsWith("explanation:")) {
        currentExplanation = line.substring("explanation:".length).trim();
        continue;
      }

      const match = line.match(choiceRegex);
      if (match) {
        const isCorrect = match[1] === "*";
        const choiceText = match[3];
        const choiceId = simpleId();
        currentChoices.push({ id: choiceId, text: choiceText });
        if (isCorrect) {
          currentCorrectAnswerId = choiceId;
        }
      }
    }

    if (questionText && currentChoices.length > 0 && currentCorrectAnswerId) {
      questions.push({
        id: simpleId(),
        text: questionText,
        choices: currentChoices,
        correctAnswerId: currentCorrectAnswerId,
        explanation: currentExplanation || undefined,
      });
    } else if (questionText && currentChoices.length > 0) {
       console.warn(`Question "${questionText.substring(0,30)}..." was skipped due to missing or ambiguous correct answer marker (*). Please mark the correct answer like *A) Choice.`);
    }
  });

  return questions;
}

// Adding UUID to package.json is recommended for truly unique IDs if this were a larger scale app.
// For now, simpleId should work for local use.
