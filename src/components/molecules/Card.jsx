import { Link } from "react-router-dom";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const Card = (props) => {
    const {title,img,route,bg} = props;
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
      setIsLoading(true);
      // Simulate loading delay for better UX
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

  return (
    <div className="bg-white w-full sm:w-56 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow hover:shadow-lg transition">
      {isLoading && <LoadingSpinner />}
      <img
        src={img}
        alt="course"
        className="rounded-xl mb-3 m-auto"
      />
      <h3 className="font-semibold text-lg leading-tight mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mb-3">by DSC-Frontend</p>
      <div className="flex justify-between items-center mb-3">
      </div>
      <Link to={route} onClick={handleClick}>
        <button className={`${bg} w-full block text-center font-bold cursor-pointer hover:bg-blue-700 text-white py-2 rounded-xl`}>Mulai Belajar</button>
      </Link>
    </div>
  );
};

export default Card;
