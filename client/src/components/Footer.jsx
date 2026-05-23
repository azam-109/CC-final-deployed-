function Footer() {
  return (
    <footer className="bg-blue-800 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <h3 className="text-lg font-bold mb-2">📘 College QnA</h3>
          <p className="text-gray-300">
            A student-mentor community to ask, answer, and grow together.
          </p>
        </div>

        <div>
          <h4 className="text-md font-semibold mb-2">About</h4>
          <p className="text-gray-300">
            Built with ❤️ by students, for students. Helping learners connect across campuses.
          </p>
        </div>

        <div>
          <h4 className="text-md font-semibold mb-2">Contact</h4>
          <p className="text-gray-300">Email: support@collegeqna.com</p>
          <p className="text-gray-300">Location: New Delhi, India</p>
        </div>
      </div>

      <div className="bg-blue-900 text-center py-3 text-xs text-gray-400">
        © {new Date().getFullYear()} College QnA. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
