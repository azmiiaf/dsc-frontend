import './App.css'
import MainLayout from './components/tamplates/MainLayout'

function App() {
  return (
    <MainLayout>
      <h2 className="text-2xl font-bold mb-6">All Courses</h2>
      
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow hover:shadow-lg transition">
          <img
            src="https://via.placeholder.com/400x200"
            alt="course"
            className="rounded-xl mb-3"
          />
          <h3 className="font-semibold text-lg leading-tight mb-1">
            Become a UX designer in 2022 (Beginner)
          </h3>
          <p className="text-sm text-gray-500 mb-3">by Ficticia D. Lucky</p>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 line-through">$144</span>
            <span className="text-blue-600 font-bold">$52</span>
            <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-lg">
              30% OFF
            </span>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl">
            Enroll
          </button>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow hover:shadow-lg transition">
          <img
            src="https://via.placeholder.com/400x200"
            alt="course"
            className="rounded-xl mb-3"
          />
          <h3 className="font-semibold text-lg leading-tight mb-1">
            Figma to Webflow Full Course
          </h3>
          <p className="text-sm text-gray-500 mb-3">by Ficticia D. Lucky</p>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 line-through">$144</span>
            <span className="text-blue-600 font-bold">$52</span>
            <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-lg">
              30% OFF
            </span>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl">
            Enroll
          </button>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow hover:shadow-lg transition">
          <img
            src="https://via.placeholder.com/400x200"
            alt="course"
            className="rounded-xl mb-3"
          />
          <h3 className="font-semibold text-lg leading-tight mb-1">
            Master Adobe Illustrator
          </h3>
          <p className="text-sm text-gray-500 mb-3">by Ficticia D. Lucky</p>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 line-through">$144</span>
            <span className="text-blue-600 font-bold">$52</span>
            <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-lg">
              30% OFF
            </span>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl">
            Enroll
          </button>
        </div>
      </div>
    </MainLayout>
  )
}

export default App
