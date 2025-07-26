export interface PersonalInfo {
  name: string;
  alias: string;
  title: string;
  location: string;
  email: string;  
  bio: string;
  tagline: string;
  languages: string[];
}

export interface SkillCategory {
  category: string;
  icon: string;
  skills: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  technologies: string[];
  status: 'completed' | 'in-progress' | 'concept';
  links: {
    demo?: string;
    github?: string;
    article?: string;
  };
  highlights: string[];
  year: string;
}

export interface Experience {
  role: string;
  organization: string;
  period: string;
  description: string;
  achievements: string[];
  type: 'work' | 'volunteer' | 'project';
}

export interface SocialLink {
  platform: string;
  username: string;
  url: string;
  icon: string;
}

export interface Award {
  title: string;
  issuer: string;
  date: string;
  description: string;
}

// Portfolio Data
export const personalInfo: PersonalInfo = {
  name: "Vyakart (Nishit)",
  alias: "vyakart",
  title: "Curious Generalist & Bridge Builder",
  location: "Bangalore, India",
  email: "vyakart@tuta.io",
  bio: `I'm Vyakart (he/him), a Bangalore-based connector who thrives at the messy intersection of technology, design and operations. From running FEA simulations on delta-wing aircraft to orchestrating six-figure conferences, I make complex projects feel friction-less.

I grease the wheels between ideas and impact — driven by craft, community & clarity. My approach combines technical hacking with visual storytelling and operational excellence.`,
  tagline: "Oliemannetje (Dutch for 'little oil man')",
  languages: ["English", "Tulu", "Hindi", "Kannada", "日本語 N5"]
};

export const skillCategories: SkillCategory[] = [
  {
    category: "Design & Visual Storytelling",
    icon: "🎨",
    skills: [
      "Graphic Design",
      "Motion Graphics", 
      "Brand Assets",
      "Photography",
      "Astrophotography",
      "Visual Communication",
      "UI/UX Design",
      "Creative Direction"
    ]
  },
  {
    category: "Technical Hacking",
    icon: "⚡",
    skills: [
      "React & TypeScript",
      "Next.js",
      "Node.js",
      "Blockchain Development",
      "Smart Contracts",
      "GPT/LLM Workflows",
      "Rapid Prototyping",
      "Full-Stack Development",
      "API Integration",
      "Database Design"
    ]
  },
  {
    category: "Ops & Production",
    icon: "🚀",
    skills: [
      "Event Production",
      "Logistics Coordination",  
      "Risk Planning",
      "Stakeholder Management",
      "Project Management",
      "Team Leadership",
      "Budget Management",
      "Vendor Relations",
      "Safety Protocols",
      "Crisis Management"
    ]
  }
];

export const projects: Project[] = [
  {
    id: "0xnarc",
    name: "0xNARC",
    description: "Hackathon scoring tool with GPT × Ethereum integration issuing soul-bound NFTs",
    longDescription: `A comprehensive hackathon management platform that combines AI-powered project evaluation with blockchain-based contributor recognition. The system uses GPT models to analyze project submissions and automatically generates soul-bound NFTs for participants based on their contributions.

Features include real-time scoring, automated feedback generation, and transparent judging processes. Built with modern web technologies and deployed on Ethereum testnet.`,
    technologies: ["React", "TypeScript", "Ethereum", "Smart Contracts", "GPT API", "Web3.js", "Solidity"],
    status: "completed",
    links: {
      github: "https://github.com/vyakart/0xnarc",
      demo: "https://0xnarc.xyz"
    },
    highlights: [
      "AI-powered project evaluation system",
      "Soul-bound NFT minting for contributors", 
      "Real-time hackathon management",
      "Transparent blockchain-based scoring"
    ],
    year: "2024"
  },
  {
    id: "bento-portfolio",
    name: "Midnight Shine Portfolio",
    description: "Modern terminal-based portfolio with bento grid layout",
    longDescription: `A unique portfolio website featuring a terminal interface alongside modern web components. Built with React, TypeScript, and Tailwind CSS, it showcases projects through an innovative command-line interface while maintaining visual appeal through a bento grid layout.

The terminal emulator includes file system navigation, command history, auto-completion, and various easter eggs. The design system emphasizes accessibility, performance, and user experience.`,
    technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite", "Terminal Emulation"],
    status: "in-progress",
    links: {
      github: "https://github.com/vyakart/midnight-shine",
      demo: "https://vyakart.dev"
    },
    highlights: [
      "Interactive terminal interface",
      "Responsive bento grid layout",
      "Custom animation system",
      "Accessibility-first design"
    ],
    year: "2024"
  },
  {
    id: "voicedeck-eval",
    name: "VoiceDeck Impact Evaluation",
    description: "LLM-powered journalism impact quantification system",
    longDescription: `An evaluation system for quantifying the impact of journalism reports using Large Language Models. The platform analyzes reporting quality, audience engagement, and societal impact metrics to provide comprehensive assessment of journalistic work.

Additionally curates and manages AI-generated artwork collections, demonstrating the intersection of technology and creative expression.`,
    technologies: ["Python", "LLM APIs", "Data Analysis", "Machine Learning", "React", "FastAPI"],
    status: "in-progress",
    links: {},
    highlights: [
      "LLM-powered impact analysis",
      "Automated report evaluation",
      "AI artwork curation",
      "Impact metrics dashboard"
    ],
    year: "2024"
  },
  {
    id: "eagx-production",
    name: "EAGxIndia '24 Production",
    description: "USD 100k conference production for 300 attendees",
    longDescription: `Led comprehensive production management for EAGxIndia 2024, a major international conference bringing together effective altruism practitioners. Managed a six-figure budget while coordinating audiovisual systems, design assets, and safety protocols for 300+ attendees.

Responsibilities included vendor management, risk assessment, logistics coordination, and real-time problem solving during the multi-day event.`,
    technologies: ["Project Management", "Event Production", "AV Systems", "Design", "Safety Protocols"],
    status: "completed",
    links: {},
    highlights: [
      "Managed USD 100k budget",
      "300+ attendee coordination",
      "Multi-day event execution",
      "AV and design leadership"
    ],
    year: "2024"
  }
];

export const experiences: Experience[] = [
  {
    role: "Evaluator",
    organization: "VoiceDeck",
    period: "2024 — now",
    description: "Quantifying journalism impact using LLMs and curating AI-generated artwork",
    achievements: [
      "Developed LLM-powered evaluation metrics for journalism impact",
      "Created automated assessment workflows",
      "Curated AI-generated art collections",
      "Built impact measurement dashboard"
    ],
    type: "work"
  },
  {
    role: "Production Lead",
    organization: "EAGxIndia '24",
    period: "2024",
    description: "Steered a USD 100k conference, leading AV, design and safety for 300 attendees",
    achievements: [
      "Managed six-figure event budget",
      "Coordinated audiovisual systems and technical infrastructure",
      "Led design and branding initiatives",
      "Implemented comprehensive safety protocols",
      "Managed vendor relationships and logistics"
    ],
    type: "volunteer"
  },
  {
    role: "Photographer & Operations",
    organization: "Impact Academy Summit",
    period: "2024",
    description: "Captured a 3-day summit while managing on-site operations",
    achievements: [
      "Documented multi-day conference through photography",
      "Managed real-time operational challenges",
      "Coordinated with speakers and attendees",
      "Delivered high-quality visual assets"
    ],
    type: "volunteer"
  },
  {
    role: "Creator",
    organization: "0xNARC Project",
    period: "2024",
    description: "Built hackathon scoring tool with GPT × Ethereum integration",
    achievements: [
      "Designed and developed full-stack application",
      "Integrated AI evaluation with blockchain rewards",
      "Implemented soul-bound NFT system",
      "Created transparent judging mechanisms"
    ],
    type: "project"
  }
];

export const socialLinks: SocialLink[] = [
  {
    platform: "Email",
    username: "vyakart@tuta.io",
    url: "mailto:vyakart@tuta.io",
    icon: "📧"
  },
  {
    platform: "GitHub",
    username: "vyakart",
    url: "https://github.com/vyakart",
    icon: "🐙"
  },
  {
    platform: "LinkedIn",
    username: "vyakart",
    url: "https://linkedin.com/in/vyakart",
    icon: "💼"
  },
  {
    platform: "Twitter",
    username: "@vyakart",
    url: "https://twitter.com/vyakart",
    icon: "🐦"
  }
];

export const awards: Award[] = [
  {
    title: "Best Hackathon Tool",
    issuer: "Web3 Hackathon",
    date: "2024-03",
    description: "Recognition for 0xNARC hackathon management platform"
  },
  {
    title: "Outstanding Event Production",
    issuer: "EAGxIndia Organization",
    date: "2024-08",
    description: "Excellence in conference production and management"
  }
];

// File content templates for terminal
export const fileContents = {
  'about.txt': `${personalInfo.bio}

Location: ${personalInfo.location}
Email: ${personalInfo.email}
Languages: ${personalInfo.languages.join(', ')}

"${personalInfo.tagline}" - I grease the wheels between ideas and impact.`,

  'contact.md': `# Contact Information

📧 **Email**: ${personalInfo.email}
📍 **Location**: ${personalInfo.location}
🌐 **Portfolio**: https://vyakart.dev

## Social Links
${socialLinks.map(link => `${link.icon} **${link.platform}**: ${link.url}`).join('\n')}

## Languages
${personalInfo.languages.map(lang => `• ${lang}`).join('\n')}

---
Feel free to reach out for collaborations, opportunities, or just to say hi!`,

  'skills.json': JSON.stringify({
    categories: skillCategories.reduce((acc, category) => {
      acc[category.category] = category.skills;
      return acc;
    }, {} as Record<string, string[]>)
  }, null, 2),

  'resume.txt': `${personalInfo.name}
${personalInfo.title}
${personalInfo.location} | ${personalInfo.email}

EXPERIENCE
${experiences.map(exp => `
${exp.role} - ${exp.organization} (${exp.period})
${exp.description}
${exp.achievements.map(achievement => `• ${achievement}`).join('\n')}
`).join('\n')}

SKILLS
${skillCategories.map(category => `
${category.category}:
${category.skills.map(skill => `• ${skill}`).join('\n')}
`).join('\n')}

PROJECTS
${projects.map(project => `
${project.name} (${project.year})
${project.description}
Technologies: ${project.technologies.join(', ')}
Status: ${project.status}
`).join('\n')}`,

  'projects.md': `# Projects Portfolio

${projects.map(project => `
## ${project.name} (${project.year})

**Status**: ${project.status}
**Technologies**: ${project.technologies.join(', ')}

${project.longDescription}

### Highlights
${project.highlights.map(highlight => `• ${highlight}`).join('\n')}

${Object.entries(project.links).length > 0 ? '### Links' : ''}
${Object.entries(project.links).map(([key, url]) => `• [${key.charAt(0).toUpperCase() + key.slice(1)}](${url})`).join('\n')}

---
`).join('\n')}`,

  'experience.txt': `PROFESSIONAL EXPERIENCE

${experiences.map(exp => `
${exp.role}
${exp.organization}
${exp.period}
Type: ${exp.type}

${exp.description}

Key Achievements:
${exp.achievements.map(achievement => `• ${achievement}`).join('\n')}

---
`).join('\n')}`,

  'awards.txt': `AWARDS & RECOGNITION

${awards.map(award => `
${award.title}
Issued by: ${award.issuer}
Date: ${award.date}

${award.description}

---
`).join('\n')}`,

  'principles.md': `# Guiding Principles

## 1. Curiosity compounds.
I chase breadth early, depth where it matters.

## 2. Community is infrastructure.
Strong networks outlast any single project.

## 3. Craft over credentials.
Show, don't tell; iterate in public.

---

These principles guide my approach to work, relationships, and continuous learning. They represent the philosophy behind everything I build and every collaboration I engage in.`,

  'languages.txt': `LANGUAGES

${personalInfo.languages.map((lang, index) => `${index + 1}. ${lang}`).join('\n')}

---

Beyond technical skills, multilingual communication opens doors to diverse perspectives and global collaboration opportunities.`,

  'README.md': `# Vyakart's Portfolio

Welcome to my digital workspace! This terminal-based portfolio showcases my work at the intersection of technology, design, and operations.

## Navigation
- Use 'ls' to explore directories
- Use 'cat <filename>' to read files  
- Use 'cd <directory>' to change directories
- Type 'help' for all available commands

## What You'll Find
- 📄 Personal information and background
- 🚀 Project portfolio and case studies
- 💼 Professional experience and achievements
- 🛠️ Skills and technologies
- 📞 Contact information and social links

## Philosophy
I'm an "Oliemannetje" (Dutch for "little oil man") - I grease the wheels between ideas and impact, making complex projects feel friction-less.

Enjoy exploring!`
};