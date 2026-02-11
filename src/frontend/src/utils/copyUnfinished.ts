import type { StudyItem, ExerciseItem, DailyLogInput } from '../backend';

function normalizeText(text: string): string {
  return text.trim().toLowerCase();
}

function isDuplicateStudyItem(item: StudyItem, existingItems: StudyItem[]): boolean {
  const normalizedTitle = normalizeText(item.title);
  const normalizedNotes = normalizeText(item.notes);
  
  return existingItems.some(existing => 
    normalizeText(existing.title) === normalizedTitle &&
    normalizeText(existing.notes) === normalizedNotes
  );
}

function isDuplicateExerciseItem(item: ExerciseItem, existingItems: ExerciseItem[]): boolean {
  const normalizedDesc = normalizeText(item.description);
  
  return existingItems.some(existing => 
    normalizeText(existing.description) === normalizedDesc &&
    existing.reps === item.reps
  );
}

export function copyUnfinishedItems(
  sourceStudyItems: StudyItem[],
  sourceExerciseItems: ExerciseItem[],
  currentStudyItems: StudyItem[],
  currentExerciseItems: ExerciseItem[]
): DailyLogInput {
  // Filter unfinished items from source
  const unfinishedStudy = sourceStudyItems.filter(item => !item.completed);
  const unfinishedExercise = sourceExerciseItems.filter(item => !item.completed);
  
  // Add only non-duplicate items, reset completion status
  const newStudyItems = [
    ...currentStudyItems,
    ...unfinishedStudy
      .filter(item => !isDuplicateStudyItem(item, currentStudyItems))
      .map(item => ({ ...item, completed: false }))
  ];
  
  const newExerciseItems = [
    ...currentExerciseItems,
    ...unfinishedExercise
      .filter(item => !isDuplicateExerciseItem(item, currentExerciseItems))
      .map(item => ({ ...item, completed: false }))
  ];
  
  return {
    studyItems: newStudyItems,
    exerciseItems: newExerciseItems,
  };
}

