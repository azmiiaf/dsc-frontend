import MainLayout from "../components/tamplates/MainLayout";
import dataJson from "../data/data.json";
import { useState } from "react";

const HtmlPage = () => {
    const [data] = useState(dataJson);
console.log(data)

  return(
    <MainLayout title='Dasar HTML' btnBack={'block'}>
      <h2 className="text-2xl font-bold mb-6">{data.title}</h2>
      <p className="text-gray-600 mb-6">{data.description}</p>
      
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-semibold text-lg mb-4">Topics:</h3>
        {data.topics.map((topic)=>(
            <div key={topic.id} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-md mb-3">{topic.title}</h4>
              <p className="text-gray-600 mb-4">{topic.content}</p>
              
              {/* Code Display Sections */}
              {topic.id === 1 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold mb-3">Contoh Kode HTML:</h5>
                  <div className="code-container">
                    <div className="bg-gray-800 text-white p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-400">HTML</span>
                      </div>
                      <pre className="text-sm overflow-x-auto">
                        <code className="text-green-400">
{`<!DOCTYPE html>
<html>
<head>
    <title>My First HTML Page</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Ini adalah paragraf pertama saya.</p>
    <a href="https://example.com">Visit Example</a>
</body>
</html>`}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {topic.id === 4 && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h5 className="font-semibold mb-3">Contoh Heading & Paragraf:</h5>
                  <div className="code-container">
                    <div className="bg-gray-800 text-white p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-400">HTML</span>
                      </div>
                      <pre className="text-sm overflow-x-auto">
                        <code className="text-green-400">
{`<!DOCTYPE html>
<html>
<body>
    <h1>Heading 1 (Paling Besar)</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
    <p>Ini adalah paragraf biasa.</p>
    <p>Paragraf kedua dengan teks yang lebih panjang.</p>
</body>
</html>`}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {topic.id === 5 && (
                <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-semibold mb-3">Contoh Link & Gambar:</h5>
                  <div className="code-container">
                    <div className="bg-gray-800 text-white p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-2xl font-bold">HTML</span>
                      </div>
                      <pre className="text-sm overflow-x-auto">
                        <code className="text-green-400">
{`<!DOCTYPE html>
<html>
<body>
    <a href="https://www.google.com" target="_blank">
        Kunjungi Google
    </a>
    <br>
    <img src="https://via.placeholder.com/150" alt="Contoh Gambar">
</body>
</html>`}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {topic.id === 6 && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-semibold mb-3">Contoh List HTML:</h5>
                  <div className="code-container">
                    <div className="bg-gray-800 text-white p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-400">HTML</span>
                      </div>
                      <pre className="text-sm overflow-x-auto">
                        <code className="text-green-400">
{`<!DOCTYPE html>
<html>
<body>
    <h3>Unordered List (Daftar Tidak Berurutan)</h3>
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
    </ul>
    
    <h3>Ordered List (Daftar Berurutan)</h3>
    <ol>
        <li>Langkah Pertama</li>
        <li>Langkah Kedua</li>
        <li>Langkah Ketiga</li>
    </ol>
    
    <h3>Nested List (Daftar Bersarang)</h3>
    <ul>
        <li>Kategori 1
            <ul>
                <li>Sub-item 1.1</li>
                <li>Sub-item 1.2</li>
            </ul>
        </li>
        <li>Kategori 2
            <ol>
                <li>Sub-item 2.1</li>
                <li>Sub-item 2.2</li>
            </ol>
        </li>
    </ul>
</body>
</html>`}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {topic.id === 7 && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-semibold mb-3">Contoh Table HTML:</h5>
                  <div className="code-container">
                    <div className="bg-gray-800 text-white p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-400">HTML</span>
                      </div>
                      <pre className="text-sm overflow-x-auto">
                        <code className="text-green-400">
{`<!DOCTYPE html>
<html>
<body>
    <table border="1">
        <tr>
            <th>Nama</th>
            <th>Usia</th>
            <th>Kota</th>
        </tr>
        <tr>
            <td>John Doe</td>
            <td>25</td>
            <td>Jakarta</td>
        </tr>
        <tr>
            <td>Jane Smith</td>
            <td>30</td>
            <td>Bandung</td>
        </tr>
    </table>
</body>
</html>`}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {topic.id === 8 && (
                <div className="mt-4 p-4 bg-pink-50 rounded-lg">
                  <h5 className="font-semibold mb-3">Contoh Formulir HTML:</h5>
                  <div className="code-container">
                    <div className="bg-gray-800 text-white p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-2xl font-bold">HTML</span>
                      </div>
                      <pre className="text-sm overflow-x-auto">
                        <code className="text-green-400">
{`<!DOCTYPE html>
<html>
<body>
    <form>
        <label for="nama">Nama:</label>
        <input type="text" id="nama" name="nama"><br><br>
        
        <label for="email">Email:</label>
        <input type="email" id="email" name="email"><br><br>
        
        <label for="pesan">Pesan:</label>
        <textarea id="pesan" name="pesan"></textarea><br><br>
        
        <input type="submit" value="Kirim">
    </form>
</body>
</html>`}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {topic.id === 9 && (
                <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                  <h5 className="font-semibold mb-3">Contoh Semantic HTML:</h5>
                  <div className="code-container">
                    <div className="bg-gray-800 text-white p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-400">HTML</span>
                      </div>
                      <pre className="text-sm overflow-x-auto">
                        <code className="text-green-400">
{`<!DOCTYPE html>
<html>
<body>
    <header>
        <h1>Website Saya</h1>
        <nav>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
        </nav>
    </header>
    
    <main>
        <article>
            <h2>Artikel Terbaru</h2>
            <p>Ini adalah konten artikel...</p>
        </article>
        
        <section>
            <h2>Section Lainnya</h2>
            <p>Konten section...</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 Website Saya</p>
    </footer>
</body>
</html>`}
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

export default HtmlPage;
