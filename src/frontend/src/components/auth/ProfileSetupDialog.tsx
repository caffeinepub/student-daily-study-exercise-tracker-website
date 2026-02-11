import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ProfileSetupDialog() {
  const [name, setName] = useState('');
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (profileName: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile({ name: profileName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Welcome! Your profile has been created.');
    },
    onError: (error: Error) => {
      toast.error('Failed to save profile: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      saveMutation.mutate(name.trim());
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome! Let's get started</DialogTitle>
          <DialogDescription>
            Please enter your name to personalize your experience.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={!name.trim() || saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : 'Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

