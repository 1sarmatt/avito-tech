
import { Task } from "@/types";

// Function to save task form data as draft
export function saveDraft(task: Partial<Task>): void {
  localStorage.setItem('taskDraft', JSON.stringify(task));
}

// Function to load draft from localStorage
export function loadDraft(): Partial<Task> | null {
  const draft = localStorage.getItem('taskDraft');
  if (!draft) return null;
  
  try {
    return JSON.parse(draft);
  } catch (e) {
    console.error('Failed to parse task draft', e);
    return null;
  }
}

// Function to clear draft from localStorage
export function clearDraft(): void {
  localStorage.removeItem('taskDraft');
}
