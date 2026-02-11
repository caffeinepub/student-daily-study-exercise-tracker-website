import { useState } from 'react';
import type { ExerciseItem } from '../../backend';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';

interface ExerciseItemEditorProps {
  item?: ExerciseItem;
  onSave: (item: ExerciseItem) => void;
  onCancel: () => void;
}

export default function ExerciseItemEditor({ item, onSave, onCancel }: ExerciseItemEditorProps) {
  const [description, setDescription] = useState(item?.description || '');
  const [reps, setReps] = useState(item?.reps?.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() && reps && Number(reps) > 0) {
      onSave({
        description: description.trim(),
        reps: BigInt(reps),
        completed: item?.completed || false,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-muted/50 space-y-3">
      <div className="space-y-2">
        <Label htmlFor="description">Exercise *</Label>
        <Input
          id="description"
          placeholder="e.g., Push-ups"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          autoFocus
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reps">Reps *</Label>
        <Input
          id="reps"
          type="number"
          min="1"
          placeholder="e.g., 20"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          required
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={!description.trim() || !reps || Number(reps) <= 0}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

