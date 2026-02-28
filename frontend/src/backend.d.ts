import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface GameDetails {
    genre: string;
    platforms: string;
    releaseDate: string;
}
export interface AdminStatus {
    adminClaimed: boolean;
    callerIsAdmin: boolean;
}
export interface Content {
    features: Array<string>;
    instagramLink: string;
    youtubeLink: string;
    pressEmail: string;
    bodyTextColorHex: string;
    developerWebsite: string;
    gameDetails: GameDetails;
    aboutText: string;
    passwordEnabled: boolean;
}
export interface UserProfile {
    principal: Principal;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    claimAdmin(): Promise<void>;
    disablePasswordProtection(): Promise<void>;
    enablePasswordProtection(password: string): Promise<void>;
    getAdminStatus(): Promise<AdminStatus>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContent(): Promise<Content>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAbout(text: string): Promise<void>;
    updateBodyTextColor(colorHex: string): Promise<void>;
    updateDeveloperWebsite(link: string): Promise<void>;
    updateFeatures(newFeatures: Array<string>): Promise<void>;
    updateGameDetails(genre: string, platforms: string, releaseDate: string): Promise<void>;
    updateInstagram(link: string): Promise<void>;
    updatePressEmail(email: string): Promise<void>;
    updateYoutubeLink(link: string): Promise<void>;
    verifyPassword(password: string): Promise<boolean>;
}
