import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ExerciseItem {
    reps: bigint;
    completed: boolean;
    description: string;
}
export type Time = bigint;
export interface DayLog {
    id: bigint;
    studyItems: Array<StudyItem>;
    owner: Principal;
    exerciseItems: Array<ExerciseItem>;
    date: Time;
}
export interface StudyItem {
    title: string;
    completed: boolean;
    notes: string;
}
export interface DailyLog {
    completedStudyItems: bigint;
    totalExerciseItems: bigint;
    completedExerciseItems: bigint;
    totalStudyItems: bigint;
}
export interface DailyLogInput {
    studyItems: Array<StudyItem>;
    exerciseItems: Array<ExerciseItem>;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllDayLogs(): Promise<Array<DayLog>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDailyLogsByCompletionStats(): Promise<Array<DailyLog>>;
    getDayLog(_id: bigint): Promise<DayLog>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveDayLog(content: DailyLogInput): Promise<void>;
}
