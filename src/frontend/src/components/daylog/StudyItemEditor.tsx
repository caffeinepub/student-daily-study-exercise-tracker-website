import { useState } from 'react';
import type { StudyItem } from '../../backend';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';

interface StudyItemEditorProps {
  item?: StudyItem;
  onSave: (item: StudyItem) => void;
  onCancel: () => void;
}

export default function StudyItemEditor({ item, onSave, onCancel }: StudyItemEditorProps) {
  const [title, setTitle] = useState(item?.title || '');
  const [notes, setNotes] = useState(item?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({
        title: title.trim(),
        notes: notes.trim(),
        completed: item?.completed || false,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-muted/50 space-y-3">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          placeholder="e.g., Read Chapter 5"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Additional details..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={!title.trim()}>
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

