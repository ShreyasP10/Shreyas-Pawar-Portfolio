import type {
  Certification,
  Education,
  ExperienceItem,
  FAQItem,
  Hackathon,
  Milestone,
  Profile,
  Project,
  SkillGroup,
  Stat,
} from "./types";

export const profile: Profile = {
  id: 1,
  name: "Shreyas Pawar",
  subheading:
    "Data Science & DSA | Built ML & Mobile Solutions for Real-World Use Cases",
  photoUrl: null,
  email: "shreyaspawar1011@gmail.com",
  phone: "+91 XXXXX XXXXX",
  place: "Thane, Maharashtra, India",
  socialLinks: {
    linkedin: "https://www.linkedin.com/in/shreyaspawar10/",
    github: "https://github.com/ShreyasP10",
    instagram: "https://www.instagram.com/shreyas_p10",
    leetcode: "https://leetcode.com/u/ShreyasPawar10/",
    twitter: "https://x.com/ShreyasP10",
    whatsapp: "https://wa.me/919999999999",
  },
  bio: "I began my journey in technology at the start of my Diploma in Information Technology after 10th, building a strong foundation in C, C++, Java, Python, Kotlin, HTML, CSS, JavaScript, ReactJS and MySQL. I am currently pursuing a B.Tech in Computer Engineering at A.P. Shah Institute of Technology, Thane.\n\nOver the years I have gained hands-on experience in Android development (Java & Kotlin), Flutter app development through an internship during my diploma, and Data Science projects. I have a solid grasp of Java, Kotlin and Python, and I am actively enhancing my problem-solving skills by learning Data Structures and Algorithms in Python.\n\nMy goal is to leverage my programming expertise to create impactful, real-world applications — from encrypted messaging apps and satellite-imagery AI prototypes to campus intelligence platforms and crop disease detection — and continue growing with modern technologies.",
};

export const education: Education[] = [
  {
    id: 1,
    degree: "B.Tech in Computer Engineering",
    institution: "A. P. Shah Institute of Technology, Thane",
    period: "2025 – 2028",
  },
  {
    id: 2,
    degree: "Diploma in Information Technology",
    institution: "Muchhala Polytechnic, Thane",
    period: "Aug 2022 – May 2025",
  },
];

export const certifications: Certification[] = [
  {
    id: 1,
    title: "Data Science Master Virtual Internship",
    issuer: "Siemens",
    issued: "Apr 2026",
    credentialId: "4b4f893de3a068b03cd4",
  },
  {
    id: 2,
    title: "The Ultimate Job Ready Data Science Course",
    issuer: "CodeWithHarry",
    issued: "Mar 2026",
    credentialId: "CWH-THE-ULTIMATE-JOB-READY-DATA-SCIENCE-COURSE",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    skills: [
      "Python",
      "Java",
      "Kotlin",
      "JavaScript",
      "TypeScript",
      "C",
      "C++",
      "Dart",
      "HTML",
      "CSS",
      "SQL",
      "XML",
    ],
  },
  {
    category: "Frameworks & Libraries",
    skills: [
      "React.js",
      "Next.js",
      "Flutter",
      "Tailwind CSS",
      "Flask",
      "FastAPI",
      "SQLAlchemy",
      "TensorFlow",
      "TensorFlow Lite",
      "PyTorch",
      "OpenCV",
      "Scikit-Learn",
      "Rasterio",
      "GDAL",
    ],
  },
  {
    category: "Data Science & ML",
    skills: [
      "Machine Learning",
      "Deep Learning",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn",
      "Web Scraping",
      "Data Analysis",
    ],
  },
  {
    category: "Mobile & Cloud",
    skills: [
      "Android Development",
      "Firebase",
      "Firestore",
      "Google BigQuery",
      "Gemini AI",
      "NVIDIA RAPIDS",
      "Vercel",
      "WebRTC",
    ],
  },
];

export const projects: Project[] = [
  {
    id: 1,
    title: "CropIQ",
    description:
      "AI-powered crop disease detection platform with an Android app (Java + Kotlin), web portal and admin dashboard. Detects diseases across crops like apple and banana using a CNN implemented with TensorFlow/TensorFlow Lite, provides recommended solutions and preventive measures, and delivers real-time updates via Firebase Cloud Messaging.",
    tags: [
      "Android",
      "Java",
      "Kotlin",
      "TensorFlow Lite",
      "Firebase",
      "Firestore",
      "FCM",
    ],
    githubUrl: "https://github.com/ShreyasP10/CropIQ",
    year: "2025",
    highlight: "MSBTE State Level Project Competition",
    image: "/projects/cropiq.jpg",
  },
  {
    id: 2,
    title: "Kepler-404",
    description:
      "Full-stack prototype for the ISRO Space Applications Centre BAH 2026 Hackathon. AI-powered workflow that super-resolves Landsat 9 Thermal Infrared imagery from 200m to 100m, colorizes grayscale thermal bands into physically consistent RGB visualizations, preserves CRS and affine transformations for GIS compatibility, and offers an interactive web interface with before/after comparison and GeoTIFF export.",
    tags: [
      "Flask",
      "PyTorch",
      "OpenCV",
      "Rasterio",
      "GDAL",
      "NumPy",
      "GIS",
    ],
    githubUrl: "https://github.com/ShreyasP10/Kepler-404",
    demoUrl: "https://github.com/ShreyasP10/Kepler-404",
    year: "2026",
    highlight: "ISRO SAC BAH 2026 Hackathon",
    image: "/projects/kepler-404.png",
  },
  {
    id: 3,
    title: "Chatrixz",
    description:
      "Real-time encrypted chat application where every message is encrypted on the client with AES-256-GCM before upload — Firestore stores only ciphertext, so the server never understands message content. Built around that single architectural decision: encrypted replies, read receipts, file sharing, message reactions, WebRTC peer-to-peer voice calls, PWA with offline support.",
    tags: ["React", "Firebase", "WebRTC", "AES-256-GCM", "PWA"],
    githubUrl: "https://github.com/ShreyasP10/Chatrixz",
    demoUrl: "https://github.com/ShreyasP10/Chatrixz",
    year: "2026",
    highlight: "End-to-end encrypted messaging",
    image: "/projects/chatrixz.png",
  },
  {
    id: 4,
    title: "Camptel AI",
    description:
      "Campus decision-intelligence platform built for the Gen AI Academy APAC Edition (Google Cloud Hackathon 2026). Transforms raw campus data into actionable decisions: academic risk panel with real-time risk scoring, placement readiness tiers across branches, classroom utilization heatmaps with conflict alerts, and a plain-English AI assistant that converts natural language into SQL. 11x GPU speedup using NVIDIA RAPIDS cuDF over Pandas (45s to 4.1s on 1.2M records).",
    tags: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Google BigQuery",
      "Gemini AI",
      "NVIDIA RAPIDS",
    ],
    githubUrl: "https://github.com/ShreyasP10/Camptel-AI",
    demoUrl: "https://github.com/ShreyasP10/Camptel-AI",
    year: "2026",
    highlight: "Google Cloud Hackathon 2026",
    image: "/projects/camptel-ai.png",
  },
  {
    id: 5,
    title: "AI for Learning & Developer Productivity",
    description:
      "AI-powered platform built for the AWS AI for Bharat Hackathon that unifies learning and coding into one experience: AI tutor with personalized study paths, role-based interview prep, smart summarizer, multilingual translation for Indian languages, quiz and flashcard generator, AI code analyzer with an interactive playground, and multimodal AI covering OCR, diagram analysis and math solving.",
    tags: ["React", "AI/ML", "AWS", "Multimodal AI"],
    githubUrl: "https://github.com/ShreyasP10/AI-for-Learning",
    demoUrl: "https://github.com/ShreyasP10/AI-for-Learning",
    year: "2026",
    highlight: "AWS AI for Bharat Hackathon",
    image: "/projects/ai-productivity.png",
  },
];

export const experience: ExperienceItem[] = [
  {
    id: 1,
    role: "Internship – Mobile Application Development (Dart & Flutter)",
    company: "New Age Solutions & Technologies (NASTECH)",
    type: "Internship",
    startDate: "Jun 2025",
    endDate: "Jul 2025",
    description:
      "Completed a 6-week industrial training program on Mobile Application Development using Dart & Flutter, organized in collaboration with Muchhala Polytechnic. Built interactive, responsive cross-platform apps with Flutter, mastered state management, widgets and navigation, and applied real-world development workflows, debugging and testing techniques while collaborating on project-based assignments.",
    skills: ["Flutter", "Dart", "UI/UX"],
  },
  {
    id: 2,
    role: "Presenter – CropIQ Crop Disease Identifier Application",
    company: "MSBTE State Level Project Competition 2025",
    type: "Competition",
    startDate: "Mar 2025",
    endDate: "Mar 2025",
    description:
      "Represented Muchhala Polytechnic, Thane at the MSBTE State Level Project Competition 2025 (Mumbai Region), presenting CropIQ at Shivajirao S. Jondhle Polytechnic, Asangaon. Demonstrated an AI-powered Android application using Computer Vision and Deep Learning (CNN via TensorFlow) for early crop disease detection with actionable guidance.",
    skills: ["Android", "Java", "Kotlin", "TensorFlow", "Firebase"],
  },
];

export function getProfile(): Profile {
  return profile;
}

export function getProjects(): Project[] {
  return projects;
}

export function getExperience(): ExperienceItem[] {
  return experience;
}

export function getEducation(): Education[] {
  return education;
}

export function getCertifications(): Certification[] {
  return certifications;
}

export function getSkillGroups(): SkillGroup[] {
  return skillGroups;
}

export function getHackathons(): Hackathon[] {
  return hackathons;
}

export const headline =
  "Data Science & DSA | Built ML & Mobile Solutions for Real-World Use Cases";

export const stats: Stat[] = [
  { value: 8, suffix: "+", label: "Projects Built" },
  { value: 4, suffix: "+", label: "Hackathons" },
  { value: 19, suffix: "", label: "GitHub Followers" },
  { value: 200, suffix: "+", label: "LeetCode Solved" },
  { value: 4, suffix: "+", label: "Years in Tech" },
];

export const hackathons: Hackathon[] = [
  {
    id: 1,
    title: "Kepler-404",
    event: "ISRO Space Applications Centre – BAH 2026 Hackathon",
    outcome:
      "AI-powered prototype that super-resolves Landsat 9 Thermal Infrared imagery from 200m to 100m, colorizes thermal bands, preserves CRS/affine metadata for GIS, and exports GeoTIFF — with a web UI for before/after comparison.",
    tags: ["PyTorch", "Flask", "OpenCV", "Rasterio", "GDAL", "GIS"],
    githubUrl: "https://github.com/ShreyasP10",
    year: "2026",
  },
  {
    id: 2,
    title: "Camptel AI",
    event: "Gen AI Academy APAC Edition – Google Cloud Hackathon 2026",
    outcome:
      "Campus decision-intelligence platform: academic risk scoring, placement readiness tiers, classroom utilization heatmaps and a plain-English AI assistant that converts natural language into SQL. 11x GPU speedup with NVIDIA RAPIDS cuDF on 1.2M records.",
    tags: ["Next.js", "BigQuery", "Gemini AI", "NVIDIA RAPIDS"],
    githubUrl: "https://github.com/ShreyasP10",
    year: "2026",
  },
  {
    id: 3,
    title: "AI for Learning & Developer Productivity",
    event: "AWS AI for Bharat Hackathon",
    outcome:
      "Unified learning platform: AI tutor with smart study paths, role-based interview prep, smart summarizer, multilingual translation, AI code analyzer with interactive playground, quiz & flashcard generator, and multimodal OCR.",
    tags: ["React", "AI/ML", "AWS", "Multimodal AI"],
    githubUrl: "https://github.com/ShreyasP10",
    year: "2026",
  },
  {
    id: 4,
    title: "CropIQ",
    event: "MSBTE State Level Project Competition 2025 (Mumbai Region)",
    outcome:
      "Presented an AI-powered crop disease detection app: CNN via TensorFlow identifies diseases in apple, banana and other crops, with recommended solutions and preventive measures for farmers.",
    tags: ["Android", "Java", "Kotlin", "TensorFlow", "Firebase"],
    githubUrl: "https://github.com/ShreyasP10",
    year: "2025",
  },
];

export const milestones: Milestone[] = [
  {
    id: 1,
    period: "2022 – 2025",
    title: "Diploma in Information Technology",
    place: "Muchhala Polytechnic, Thane",
    description:
      "Started my tech journey right after 10th. Built a foundation in C, C++, Java, Python, Kotlin, web development and MySQL — and shipped my first real app, CropIQ.",
    type: "education",
  },
  {
    id: 2,
    period: "Mar 2025",
    title: "MSBTE State Level Project Competition",
    place: "Mumbai Region",
    description:
      "Represented Muchhala Polytechnic and presented CropIQ at Shivajirao S. Jondhle Polytechnic, Asangaon — earning expert feedback and peer recognition.",
    type: "competition",
  },
  {
    id: 3,
    period: "Jun – Jul 2025",
    title: "Flutter & Dart Internship",
    place: "NASTECH",
    description:
      "6-week industrial training in cross-platform mobile development: state management, widgets, navigation, and industry-standard debugging and testing workflows.",
    type: "internship",
  },
  {
    id: 4,
    period: "2025 – Present",
    title: "B.Tech in Computer Engineering",
    place: "A.P. Shah Institute of Technology, Thane",
    description:
      "Deepening Data Structures & Algorithms in Python, Machine Learning and modern full-stack development while building ML and mobile solutions.",
    type: "education",
  },
  {
    id: 5,
    period: "2026",
    title: "3 National Hackathons",
    place: "ISRO SAC · Google Cloud · AWS",
    description:
      "Shipped Kepler-404 (ISRO), Camptel AI (Google Cloud Gen AI Academy) and AI for Learning (AWS AI for Bharat) — end-to-end prototypes with real users in mind.",
    type: "hackathon",
  },
];

export const techStack: string[] = [
  "Next.js",
  "React.js",
  "TypeScript",
  "Tailwind CSS",
  "Python",
  "Java",
  "Kotlin",
  "Flutter",
  "Dart",
  "TensorFlow",
  "PyTorch",
  "OpenCV",
  "Firebase",
  "Flask",
  "FastAPI",
  "Pandas",
  "NumPy",
  "Scikit-Learn",
  "Rasterio",
  "GDAL",
  "WebRTC",
  "MySQL",
];

export const faqs: FAQItem[] = [
  {
    question: "What do I currently work on?",
    answer:
      "I'm pursuing a B.Tech in Computer Engineering at A.P. Shah Institute of Technology, Thane, alongside Data Science & DSA in Python and Machine Learning. In parallel I build real-world prototypes — my current one is Kepler-404, a satellite-imagery super-resolution tool from the ISRO SAC hackathon.",
  },
  {
    question: "What kind of work am I open to?",
    answer:
      "I take internships and freelance work in ML, Android and full-stack development, and I compete in national hackathons — most recently at ISRO SAC, Google Cloud Gen AI Academy and AWS AI for Bharat. I ship end-to-end: from datasets and models to working apps and dashboards.",
  },
  {
    question: "What is my strongest domain?",
    answer:
      "Data Science and DSA combined with mobile and full-stack development. I have built a TensorFlow-powered Android app (CropIQ), a PyTorch remote-sensing prototype (Kepler-404) and React/Next.js platforms (Camptel AI, Chatrixz) — so I work comfortably across the whole stack.",
  },
  {
    question: "Which technologies do I use day-to-day?",
    answer:
      "Python, Java, Kotlin and JavaScript/TypeScript with React, Next.js, Flutter, TensorFlow, PyTorch, FastAPI, Flask and MySQL. I pick whatever solves the problem best — the tech stack is a means, not the goal.",
  },
  {
    question: "Where am I based?",
    answer:
      "Thane, Maharashtra, India (IST). I work remotely across time zones without a problem and I am always up for an in-person hackathon.",
  },
  {
    question: "How can someone reach me?",
    answer:
      "The easiest way is the contact form on this page — I reply to everything. You can also reach me directly at shreyaspawar1011@gmail.com or via my LinkedIn, GitHub and LeetCode links.",
  },
];
