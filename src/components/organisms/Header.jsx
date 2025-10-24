import { Link } from "react-router-dom";

const Header = (props) => {
    const {title, display, toggleSidebar, btnBack}=props;
    
    // Show back button on mobile for all pages except Dashboard
    // Dashboard has empty title and is the main course page
    const isDashboard = title === 'DSC-Frontend ' || title === '';
    const showBackButton = !isDashboard;
    
  return (
    <header className={`w-full ${display} p-3 text-xl md:text-2xl flex items-center fixed top-0 left-0 md:left-64 bg-white z-40 font-bold transition-all duration-300`}>
        <button
          onClick={toggleSidebar}
          className="md:hidden text-gray-500 hover:text-gray-700 mr-4"
        >
          ☰
        </button>
        
        {showBackButton && (
          <Link to="/" className={`${btnBack} hidden md:block text-gray-500 hover:text-gray-700 mr-4`}>
            <img src="/img/arrow.png" className={`${btnBack} w-8`} alt="" />
          </Link>
        )}
        {/* <Link to="/" className={` ${btnBack} text-gray-500 hover:text-gray-700 mr-4`}>
            {'<'}
          </Link> */}
        <h1 className="w-full md:w-3/4 font-bold text-center">{title}</h1>
    </header>
  );
};

export default Header;
