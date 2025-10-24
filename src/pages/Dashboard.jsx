import Card from "../components/molecules/Card";
import MainLayout from "../components/tamplates/MainLayout";
import dataJson from "../data/data.json";
import { useState } from "react";

// Import images
import htmlImg from "../../public/img/html.png";
import cssImg from "../../public/img/css.png";
import jsImg from "../../public/img/js.png";
import tailwindImg from "../../public/img/tailwind.png";
import githubImg from "../../public/img/github.png";

const Dashboard = () => {
  const [data] = useState([dataJson]);

  console.log(data);
  return (
    <MainLayout title='' btnBack='hidden' >
        <div className="flex flex-wrap gap-3">
          <Card title="Belajar Dasar HTML" route="/html" img={htmlImg} bg='bg-yellow-500'/>
          <Card title="Belajar Dasar CSS" route="/css" img={cssImg} bg='bg-green-600' />
          <Card title="Belajar Dasar Javascript" route="/js" img={jsImg} bg='bg-red-600' />
          <Card title="Belajar Tailwind CSS" route="/tailwind" img={tailwindImg} bg='bg-blue-600' />
          <Card title="Belajar GitHub & Git" route="/github" img={githubImg} bg='bg-yellow-500'  />
        </div>
    </MainLayout>
  );
};

export default Dashboard;
