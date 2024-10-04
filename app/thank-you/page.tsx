import React from 'react';

export default function ThankYouPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white p-6">
            {/* Professional and Engaging Heading */}
            <h1 className="text-5xl font-bold mb-8 animate-bounce">Phishing Awareness Alert! 🛡️</h1>

            {/* Informative Message with subtle animation */}
            <p className="text-xl mb-6 text-center animate-fade-in">
                You've been part of a phishing awareness test. No harm done this time, but stay vigilant—phishing attacks are real, and they're everywhere! 🧠
            </p>

            {/* Animated GIF (still playful but professional) */}
            <img
                src="https://media.giphy.com/media/l0ExncehJzexFpRHq/giphy.gif"
                alt="Phishing Warning GIF"
                className="w-80 h-auto rounded-lg shadow-lg mb-6 animate-zoom-in"
            />

            {/* Key Awareness Message */}
            <p className="text-lg text-center animate-slide-in-left">
                Phishing is one of the most common types of cyber attacks. Attackers try to trick you into giving them sensitive information by pretending to be someone you trust.
            </p>

            {/* Phishing Tips - Checkbox Version */}
            <div className="mt-6 text-left animate-slide-in-right space-y-4">
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={false}
                        className="w-6 h-6 text-yellow-400 bg-gray-700 rounded focus:ring-0 cursor-not-allowed"
                        readOnly
                    />
                    <span>Never click on links or download attachments from unknown sources.</span>
                </div>
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={false}
                        className="w-6 h-6 text-yellow-400 bg-gray-700 rounded focus:ring-0 cursor-not-allowed"
                        readOnly
                    />
                    <span>Always check the sender’s email address for authenticity.</span>
                </div>
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={false}
                        className="w-6 h-6 text-yellow-400 bg-gray-700 rounded focus:ring-0 cursor-not-allowed"
                        readOnly
                    />
                    <span>Never provide personal or financial information via email.</span>
                </div>
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={false}
                        className="w-6 h-6 text-yellow-400 bg-gray-700 rounded focus:ring-0 cursor-not-allowed"
                        readOnly
                    />
                    <span>Look for grammatical errors or suspicious URLs in the email.</span>
                </div>
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={false}
                        className="w-6 h-6 text-yellow-400 bg-gray-700 rounded focus:ring-0 cursor-not-allowed"
                        readOnly
                    />
                    <span>Report any suspicious emails to your IT or security team.</span>
                </div>
            </div>

            {/* Learn More Button */}
            <div className="mt-10 animate-slide-in-right">
                <a
                    href="https://www.cyberaware.gov/phishing"
                    className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
                >
                    Learn More About Phishing Prevention
                </a>
            </div>
        </div>
    );
}
