import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      icon: "🎓",
      title: "Mentor Verified",
      desc: "Get answers only from verified mentors of your college.",
    },
    {
      icon: "🏫",
      title: "College Focused",
      desc: "All questions and answers are specific to your campus and curriculum.",
    },
    {
      icon: "🌱",
      title: "Grow Together",
      desc: "Learn, contribute, and build your personal learning portfolio.",
    },
  ];

  const steps = [
    {
      title: "1. Ask",
      desc: "Post your question with tags to get specific help.",
    },
    {
      title: "2. Answer",
      desc: "Mentors respond with clear and helpful answers.",
    },
    {
      title: "3. Vote",
      desc: "Vote the best answers to help others find them easily.",
    },
    {
      title: "4. Grow",
      desc: "Build your knowledge and track your progress.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#e0f7f4] to-[#f3e8ff] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.section
          className="text-center mb-20"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-800 mb-4">
            Empower Learning. One Answer at a Time.
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6">
            Get expert answers from mentors at your own college.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/askquestion"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
            >
              Ask a Question
            </Link>
            <Link
              to="/questions"
              className="px-6 py-3 bg-white text-indigo-700 border border-indigo-600 rounded-xl hover:bg-indigo-50 transition"
            >
              Browse Questions
            </Link>
          </div>
        </motion.section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-20">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-2xl p-6 border shadow hover:shadow-md transition duration-200"
              initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl mb-2">{f.icon}</div>
              <h3 className="text-xl font-semibold text-violet-800 mb-2">
                {f.title}
              </h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* How It Works Section */}
        <section className="mb-20">
          <motion.h2
            className="text-3xl font-bold text-center text-green-800 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="bg-white p-6 rounded-2xl shadow border transition duration-200"
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="font-semibold text-indigo-700 text-lg mb-1">
                  {step.title}
                </h4>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <motion.section
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-violet-800 mb-4">
            Ready to level up your learning?
          </h3>
          <div className="flex justify-center gap-4">
            <Link
              to="/askquestion"
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              Get Started
            </Link>
            <Link
              to="/signup"
              className="px-6 py-3 bg-white border border-green-600 text-green-700 rounded-xl hover:bg-green-50 transition"
            >
              Become a Mentor
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
