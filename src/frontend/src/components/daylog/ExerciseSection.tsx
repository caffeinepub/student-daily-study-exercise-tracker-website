import { useState } from 'react';
import { useSaveDayLog } from '../../hooks/useDayLogs';
import type { StudyItem, ExerciseItem } from '../../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Plus, Pencil, Trash2 } from 'lucide-react';
import ExerciseItemEditor from './ExerciseItemEditor';

interface ExerciseSectionProps {
  studyItems: StudyItem[];
  exerciseItems: ExerciseItem[];
}

export default function ExerciseSection({ studyItems, exerciseItems }: ExerciseSectionProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const saveMutation = useSaveDayLog();

  const completedCount = exerciseItems.filter(item => item.completed).length;

  const handleToggleComplete = (index: number) => {
    const updatedItems = exerciseItems.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );
    saveMutation.mutate({ studyItems, exerciseItems: updatedItems });
  };

  const handleDelete = (index: number) => {
    const updatedItems = exerciseItems.filter((_, i) => i !== index);
    saveMutation.mutate({ studyItems, exerciseItems: updatedItems });
  };

  const handleSave = (item: ExerciseItem, index?: number) => {
    let updatedItems: ExerciseItem[];
    if (index !== undefined) {
      updatedItems = exerciseItems.map((existing, i) => (i === index ? item : existing));
    } else {
      updatedItems = [...exerciseItems, item];
    }
    saveMutation.mutate({ studyItems, exerciseItems: updatedItems });
    setEditingIndex(null);
    setIsAdding(false);
  };

  return (
    <Card className="item-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Dumbbell className="w-5 h-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-xl">Exercise</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {completedCount} of {exerciseItems.length} completed
              </p>
            </div>
          </div>
          <Button onClick={() => setIsAdding(true)} size="sm" disabled={isAdding}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isAdding && (
          <ExerciseItemEditor
            onSave={(item) => handleSave(item)}
            onCancel={() => setIsAdding(false)}
          />
        )}

        {exerciseItems.length === 0 && !isAdding && (
          <p className="text-center text-muted-foreground py-8">
            No exercise items yet. Click "Add" to create one!
          </p>
        )}

        {exerciseItems.map((item, index) => (
          <div key={index}>
            {editingIndex === index ? (
              <ExerciseItemEditor
                item={item}
                onSave={(updated) => handleSave(updated, index)}
                onCancel={() => setEditingIndex(null)}
              />
            ) : (
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => handleToggleComplete(index)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${item.completed ? 'line-through opacity-60' : ''}`}>
                    {item.description}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.reps.toString()} reps
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingIndex(index)}
                    className="h-8 w-8"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(index)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

