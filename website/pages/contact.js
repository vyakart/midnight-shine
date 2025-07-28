import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would integrate your form submission (e.g., API endpoint)
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen px-4 py-12 flex flex-col items-center">
      <motion.h1
        className="text-3xl md:text-5xl font-heading text-primary mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Contact
      </motion.h1>
      {!submitted ? (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div>
            <label htmlFor="name" className="block text-textMuted mb-1">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-background border border-primary rounded focus:outline-none focus:border-secondary text-textLight"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-textMuted mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-background border border-primary rounded focus:outline-none focus:border-secondary text-textLight"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-textMuted mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-background border border-primary rounded focus:outline-none focus:border-secondary text-textLight"
            ></textarea>
          </div>
          <button type="submit" className="px-4 py-2 bg-primary text-background rounded hover:bg-secondary transition-colors">
            Send Message
          </button>
        </form>
      ) : (
        <p className="text-primary">Thank you for reaching out! I’ll get back to you soon.</p>
      )}
    </main>
  );
}