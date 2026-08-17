export interface SocialLinks {
  linkedin: string;
  github: string;
  instagram: string;
  leetcode: string;
  twitter: string;
  whatsapp: string;
}

export interface Profile {
  id: number;
  name: string;
  subheading: string;
  photoUrl: string | null;
  email: string;
  phone: string;
  place: string;
  socialLinks: SocialLinks;
  bio: string;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  period: string;
  note?: string;
}

export interface Certification {
  id: number;
  title: string;
  issuer: string;
  issued: string;
  credentialId: string;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  demoUrl?: string;
  year: string;
  highlight?: string;
  /** Path to a project image, e.g. "/projects/chatrixz.png" (paste files in public/projects/). */
  image?: string;
}

export interface ExperienceItem {
  id: number;
  role: string;
  company: string;
  type: string;
  startDate: string;
  endDate: string;
  description: string;
  skills: string[];
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  message: string;
}

export interface Hackathon {
  id: number;
  title: string;
  event: string;
  outcome: string;
  tags: string[];
  githubUrl?: string;
  year: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Milestone {
  id: number;
  period: string;
  title: string;
  place: string;
  description: string;
  type: "education" | "competition" | "internship" | "hackathon";
}
