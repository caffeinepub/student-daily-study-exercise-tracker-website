import LoginButton from './LoginButton';
import { BookOpen, Dumbbell } from 'lucide-react';

export default function AccessDeniedScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <img
            src="/assets/generated/student-mascot.dim_512x512.png"
            alt="Student Mascot"
            className="w-48 h-48 object-contain"
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 text-primary">
            <BookOpen className="w-8 h-8" />
            <Dumbbell className="w-8 h-8" />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight">
            Student Daily Tracker
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Track your daily study sessions and exercise routines. Stay organized, stay motivated!
          </p>
        </div>

        <div className="pt-4">
          <LoginButton />
        </div>

        <p className="text-sm text-muted-foreground">
          Sign in to access your personalized dashboard and start tracking your progress.
        </p>
      </div>
    </div>
  );
}

