import MainLayout from "../components/tamplates/MainLayout";
import dataJson from "../data/data.json";
import { useState } from "react";

const TailwindPage = () => {
    const [data] = useState(dataJson);
    const tailwindTopics = data.tailwind_topics || [];

  return(
    <MainLayout title='Tailwind CSS'>
      <h2 className="text-2xl font-bold mb-6">Materi Tailwind CSS</h2>
      <p className="text-gray-600 mb-6">Belajar Tailwind CSS untuk pengembangan web modern yang efisien.</p>
      
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-semibold text-lg mb-4">Topics:</h3>
        {tailwindTopics.map((topic)=>(
            <div key={topic.id} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-md mb-3">{topic.title}</h4>
              <p className="text-gray-600 mb-4">{topic.content}</p>
              
              {topic.example && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold mb-3">Contoh Kode Tailwind:</h5>
                  <div className="code-container">
                    <div className="bg-gray-800 text-white p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-400">Tailwind CSS</span>
                      </div>
                      <pre className="text-sm overflow-x-auto">
                        <code className="text-green-400">
                          {topic.example}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}
              
              {topic.html_example && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h5 className="font-semibold mb-3">Contoh HTML:</h5>
                  <div className="code-container">
                    <div className="bg-gray-800 text-white p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-400">HTML</span>
                      </div>
                      <pre className="text-sm overflow-x-auto">
                        <code className="text-green-400">
                          {topic.html_example}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
        ))}
      </div>
    </MainLayout>
  )
};

export default TailwindPage;