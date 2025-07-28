import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import the CLIChat component to avoid Next.js SSR issues with window
const CLIChat = dynamic(() => import('@/components/CLIChat'), { ssr: false });

export default function About() {
  return (
    <main className="min-h-screen px-4 py-12 space-y-12">
      <section className="max-w-3xl mx-auto text-center">
        <motion.h1
          className="text-3xl md:text-5xl font-heading text-primary mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Me
        </motion.h1>
        <p className="text-textMuted max-w-xl mx-auto">
          I’m a developer who loves building elegant and performant web experiences.  When I’m not coding, you’ll find me exploring new
          technologies, creating music or reading about design.  Below, you can chat with a cyberpunk‑style terminal inspired by my own
          custom shell.
        </p>
      </section>
      <section>
        <CLIChat />
      </section>
    </main>
  );
}