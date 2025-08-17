export default function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="ml-4 px-3 py-1 rounded-lg border border-white bg-green-700 hover:bg-green-800 text-sm"
    >
      {darkMode ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
