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
export interface Content {
    features: Array<string>;
    instagramLink: string;
    youtubeLink: string;
    pressEmail: string;
    bodyTextColorHex: string;
    developerWebsite: string;
    gameDetails: GameDetails;
    iframeSrc: string;
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
    disablePasswordProtection(): Promise<void>;
    enablePasswordProtection(password: string): Promise<void>;
    getAboutText(): Promise<string>;
    getAllUserProfiles(): Promise<Array<UserProfile>>;
    getBodyTextColor(): Promise<string>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContent(): Promise<Content>;
    getDeveloperWebsite(): Promise<string>;
    getFeatures(): Promise<Array<string>>;
    getGameDetails(): Promise<GameDetails>;
    getInstagramLink(): Promise<string>;
    getPasswordProtectionStatus(): Promise<boolean>;
    getPressEmail(): Promise<string>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getYoutubeLink(): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAbout(text: string): Promise<void>;
    updateBodyTextColor(colorHex: string): Promise<void>;
    updateDeveloperWebsite(link: string): Promise<void>;
    updateFeatures(newFeatures: Array<string>): Promise<void>;
    updateGameDetails(genre: string, platforms: string, releaseDate: string): Promise<void>;
    updateIframeSrc(src: string): Promise<void>;
    updateInstagram(link: string): Promise<void>;
    updatePressEmail(email: string): Promise<void>;
    updateYoutubeLink(link: string): Promise<void>;
    verifyPassword(password: string): Promise<boolean>;
}
