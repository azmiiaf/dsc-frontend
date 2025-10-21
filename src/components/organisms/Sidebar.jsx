import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  // Get current path to determine active menu
  const currentPath = window.location.pathname;

  const isActive = (path) => {
    // For Materi, check if current path starts with any material route
    if (path === "/") {
      return currentPath === "/" ||
             currentPath === "/html" ||
             currentPath === "/css" ||
             currentPath === "/js" ||
             currentPath === "/tailwind" ||
             currentPath === "/github";
    }
    return currentPath === path;
  };

  return (
    <aside
      className={`w-64 h-dvh bg-white border-slate-400 border flex flex-col p-5 fixed left-0 top-0 z-50 md:relative transition-transform  duration-300 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <button
        onClick={toggleSidebar}
        className="md:hidden self-end mb-4 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
      <div className="flex items-center mb-8">
        <div className="w-16 rounded-lg mr-2">
          <img src="/img/logogdg.png" alt="GDG Logo" />
        </div>
        <h1 className="font-bold text-xl">DSC-FrontEnd</h1>
      </div>
      <nav className="space-y-3">
        <Link
          to="/"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
            isActive("/")
              ? "bg-blue-100 text-blue-600 font-medium"
              : "hover:bg-blue-100"
          }`}
          onClick={() => window.innerWidth < 768 && toggleSidebar()}
        >
          <span>📚</span> Materi
        </Link>
        <Link
          to="/community"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
            isActive("/community")
              ? "bg-blue-100 text-blue-600 font-medium"
              : "hover:bg-blue-100"
          }`}
          onClick={() => window.innerWidth < 768 && toggleSidebar()}
        >
          <span>💬</span> Forum Diskusi
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
