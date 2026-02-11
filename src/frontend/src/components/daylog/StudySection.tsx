import { useState } from 'react';
import { useSaveDayLog } from '../../hooks/useDayLogs';
import type { StudyItem, ExerciseItem } from '../../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Pencil, Trash2 } from 'lucide-react';
import StudyItemEditor from './StudyItemEditor';

interface StudySectionProps {
  studyItems: StudyItem[];
  exerciseItems: ExerciseItem[];
}

export default function StudySection({ studyItems, exerciseItems }: StudySectionProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const saveMutation = useSaveDayLog();

  const completedCount = studyItems.filter(item => item.completed).length;

  const handleToggleComplete = (index: number) => {
    const updatedItems = studyItems.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );
    saveMutation.mutate({ studyItems: updatedItems, exerciseItems });
  };

  const handleDelete = (index: number) => {
    const updatedItems = studyItems.filter((_, i) => i !== index);
    saveMutation.mutate({ studyItems: updatedItems, exerciseItems });
  };

  const handleSave = (item: StudyItem, index?: number) => {
    let updatedItems: StudyItem[];
    if (index !== undefined) {
      updatedItems = studyItems.map((existing, i) => (i === index ? item : existing));
    } else {
      updatedItems = [...studyItems, item];
    }
    saveMutation.mutate({ studyItems: updatedItems, exerciseItems });
    setEditingIndex(null);
    setIsAdding(false);
  };

  return (
    <Card className="item-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Study</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {completedCount} of {studyItems.length} completed
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
          <StudyItemEditor
            onSave={(item) => handleSave(item)}
            onCancel={() => setIsAdding(false)}
          />
        )}

        {studyItems.length === 0 && !isAdding && (
          <p className="text-center text-muted-foreground py-8">
            No study items yet. Click "Add" to create one!
          </p>
        )}

        {studyItems.map((item, index) => (
          <div key={index}>
            {editingIndex === index ? (
              <StudyItemEditor
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
                    {item.title}
                  </p>
                  {item.notes && (
                    <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                  )}
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

