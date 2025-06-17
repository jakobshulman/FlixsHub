import React from "react";
import { useNavigate } from "react-router-dom";

// פונקציה ליצירת גרדיאנט רנדומלי עקבי
function getRandomGradient(id: number) {
  const gradients = [
    "linear-gradient(135deg,rgb(14, 171, 95) 0%, #928dab 100%)",
    "linear-gradient(135deg,rgb(206, 17, 118) 0%,rgb(32, 67, 48) 50%, #2c5364 100%)",
    "linear-gradient(135deg,rgb(89, 18, 152) 0%,rgb(236, 66, 9) 100%)",
    "linear-gradient(135deg, #141e30 0%,rgb(10, 146, 249) 100%)",
    "linear-gradient(135deg,rgb(209, 216, 21) 0%,rgb(250, 7, 7) 100%)",
    "linear-gradient(135deg, #232526 0%,rgb(9, 219, 55) 100%)",
    "linear-gradient(135deg,rgb(0, 29, 40) 0%, #004e92 100%)",
    "linear-gradient(135deg, #283048 0%, #859398 100%)",
    "linear-gradient(135deg, #485563 0%,rgb(17, 83, 158) 100%)",
    "linear-gradient(135deg, #1e130c 0%, #9a8478 100%)"
  ];
  return gradients[id % gradients.length];
}

export default function GenreCard({ id, name }: { id: number; name: string }) {
  const navigate = useNavigate();

  return (
    <div
      className="w-[172px] aspect-[2/3] flex items-center justify-center rounded-3xl shadow bg-cover bg-center cursor-pointer box-border"
      style={{ background: getRandomGradient(id) }}
      onClick={() => navigate(`/genre/${id}`)}
      title={name}
    >
      <span
        className="text-center w-full h-[3.5rem] flex items-center justify-center leading-tight break-words text-ellipsis overflow-hidden whitespace-normal drop-shadow-md text-white text-[2rem] "
      >
        {name}
      </span>
    </div>
  );
}
