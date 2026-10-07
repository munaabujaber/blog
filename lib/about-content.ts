/** @format */

export const ABOUT_PAGE_CONTENT_ID = "about";

export type AboutPageContentValues = {
  generalText: string;
  mainPhotoUrl: string | null;
};

export const defaultAboutPageContent: AboutPageContentValues = {
  generalText:
    "I write a technical engineering blog about software, AI tooling, debugging, architecture, and the practical choices that make projects easier to build and maintain.\n\nThe goal of this space is to share clear notes from real engineering work: what I tried, what worked, what broke, and what I learned along the way.",
  mainPhotoUrl: null,
};
