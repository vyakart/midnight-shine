import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.h1
        className="text-4xl md:text-6xl font-heading text-primary mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome to My Portfolio
      </motion.h1>
      <p className="max-w-2xl text-center text-textMuted mb-12">
        I’m a full‑stack developer with a passion for crafting delightful user experiences.  Explore my work, learn about me and feel free to reach out.
      </p>
      <div className="flex space-x-6">
        <Link href="/about" className="px-6 py-3 bg-primary text-background rounded-md hover:bg-secondary transition-colors">
          About Me
        </Link>
        <Link href="/projects" className="px-6 py-3 bg-secondary text-background rounded-md hover:bg-primary transition-colors">
          Projects
        </Link>
        <Link href="/contact" className="px-6 py-3 border border-primary text-primary rounded-md hover:bg-primary hover:text-background transition-colors">
          Contact
        </Link>
      </div>
    </main>
  );
}