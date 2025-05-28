import type { Question, Choice } from "@/types/quiz";
import { v4 as uuidv4 } from 'uuid'; // Assuming uuid is installed, if not, can use Math.random or other simple id generator


// Helper to ensure uuid is available or provide a fallback
const generateId = (): string => {
  try {
    return uuidv4();
  } catch {
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
    return data.map((q: unknown) => {
      const question = q as Partial<Question> & { choices?: Partial<Choice>[] };
      return {
        id: question.id || generateId(),
        text: question.text || "No question text provided",
        choices: Array.isArray(question.choices)
          ? question.choices.map((c: unknown) => {
              const choice = c as Partial<Choice>;
              return {
                id: choice.id || generateId(),
                text: choice.text || "No choice text"
              };
            })
        : [],
        correctAnswerId: question.correctAnswerId || (question.choices && question.choices.length > 0 ? question.choices[0].id || generateId() : generateId()),
        explanation: question.explanation || "",
      };
    });
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
    const choices: Choice[] = [];
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
    return data.map((q: unknown) => {
      const question = q as Partial<Question> & { choices?: Partial<Choice>[] };
      const choices = Array.isArray(question.choices)
        ? question.choices.map((c: unknown) => {
            const choice = c as Partial<Choice>;
            return {
              id: choice.id || simpleId(),
              text: choice.text || "No choice text"
            };
          })
        : [];
      let correctAnswerId = question.correctAnswerId;
      if (!correctAnswerId && choices.length > 0) {
        // If correctAnswerId is not provided, try to find it based on a property like isCorrect
        const correctChoice = choices.find((c) => {
          const maybeCorrect = c as Partial<Choice> & { isCorrect?: boolean };
          return maybeCorrect.isCorrect === true;
        });
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
        id: question.id || simpleId(),
        text: question.text || "No question text provided",
        choices,
        correctAnswerId: correctAnswerId || simpleId(),
        explanation: question.explanation || "",
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
    const currentChoices: Choice[] = [];
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
