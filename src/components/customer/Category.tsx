// components/CategoryComponent.tsx
import React from 'react';
import { FaFootballBall, FaBasketballBall } from 'react-icons/fa';
import { GiCricketBat } from 'react-icons/gi'; // Import Cricket icon

interface Category {
    name: string;
    icon: JSX.Element;
    color: string;
}

const categories: Category[] = [
    {
        name: 'Football',
        icon: <FaFootballBall />,
        color: '#4CAF50', // Green color for football
    },
    {
        name: 'Basketball',
        icon: <FaBasketballBall />,
        color: '#FF9800', // Orange color for basketball
    },
    {
        name: 'Cricket',
        icon: <GiCricketBat />,
        color: '#2196F3', // Blue color for cricket
    },
];

const Category: React.FC = () => {
    return (

        <div className="flex justify-around items-center mt-4">
            {categories.map((category) => (
                <div
                    key={category.name}
                    className="flex flex-col items-center p-4 rounded-lg"
                    style={{ backgroundColor: category.color, color: 'white' }}
                >
                    <div className="text-4xl">{category.icon}</div>
                    <span className="mt-2 font-semibold">{category.name}</span>
                </div>
            ))}
        </div>
    );
};

export default Category;
