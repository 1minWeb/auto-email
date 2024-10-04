'use client';

import { useEffect, useState } from 'react';

interface ClickData {
    id: number;
    email: string;
    subject: string;
    clicked_at: string;
}

export default function ClickedLinksPage() {
    const [clicks, setClicks] = useState<ClickData[]>([]);

    useEffect(() => {
        const fetchClickData = async () => {
            const response = await fetch('/api/getClicks');
            const data = await response.json();
            setClicks(data);
        };
        fetchClickData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center  text-black">
            <h1 className="text-4xl font-bold mb-10">Clicked Links</h1>

            <div className="overflow-x-auto w-full max-w-4xl">
                <table className="min-w-full bg-white text-gray-800 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                            <th className="py-3 px-6 text-left">ID</th>
                            <th className="py-3 px-6 text-left">Email</th>
                            <th className="py-3 px-6 text-left">Subject</th>
                            <th className="py-3 px-6 text-left">Clicked At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clicks.map((click, index) => (
                            <tr
                                key={click.id}
                                className={`hover:bg-gray-100 transition duration-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                    }`}
                            >
                                <td className="py-3 px-6 border-b">{click.id}</td>
                                <td className="py-3 px-6 border-b">{click.email}</td>
                                <td className="py-3 px-6 border-b">{click.subject}</td>
                                <td className="py-3 px-6 border-b">
                                    {new Date(click.clicked_at).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
