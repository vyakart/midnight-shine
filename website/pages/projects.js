import { motion } from 'framer-motion';

export default function Projects() {
  const sampleProjects = [
    { title: 'Project One', description: 'A brief description of project one.', tech: ['React', 'Node.js'], href: '#' },
    { title: 'Project Two', description: 'A brief description of project two.', tech: ['Next.js', 'Tailwind'], href: '#' },
  ];
  return (
    <main className="min-h-screen px-4 py-12">
      <motion.h1
        className="text-3xl md:text-5xl font-heading text-primary mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Projects
      </motion.h1>
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {sampleProjects.map((proj) => (
          <div key={proj.title} className="bg-surface p-6 rounded-lg border border-surface hover:border-primary transition-colors">
            <h2 className="text-xl font-heading text-secondary mb-2">{proj.title}</h2>
            <p className="text-textMuted mb-3">{proj.description}</p>
            <div className="mb-4">
              {proj.tech.map((t) => (
                <span key={t} className="inline-block bg-background border border-primary text-primary px-2 py-1 mr-2 mb-2 text-xs rounded">
                  {t}
                </span>
              ))}
            </div>
            <a href={proj.href} className="text-primary underline">Learn more →</a>
          </div>
        ))}
      </div>
    </main>
  );
}