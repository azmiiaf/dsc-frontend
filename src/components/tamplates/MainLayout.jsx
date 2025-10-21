import Sidebar from "../organisms/Sidebar";
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../organisms/Header";

const MainLayout = ({ children,title,display, btnBack }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col md:flex-row">
      <div className="fixed h-screen z-30">
        <Header btnBack={btnBack} title={`DSC-Frontend ${title} `} display={display} toggleSidebar={toggleSidebar}/>
        
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
      </div>
      
      <main className="flex-1 overflow-y-auto md:ml-64 mt-16 md:mt-0">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-4 md:mb-6">
          </div>

          {children}
        </div>
      </main>

     
    </div>
  )
}

export default MainLayout;