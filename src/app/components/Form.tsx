'use client';

import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import axios from 'axios';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyB3Gyf05ESUL5N2QPdEEpbn0mnhsSar830",
    authDomain: "launchpad-4689d.firebaseapp.com",
    projectId: "launchpad-4689d",
    storageBucket: "launchpad-4689d.firebasestorage.app",
    messagingSenderId: "1030261968923",
    appId: "1:1030261968923:web:e55949696e859da99ca8be",
    measurementId: "G-4MHR72XKCN"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Form: React.FC = () => {
    const [formData, setFormData] = useState<{ [key: string]: string | File }>({});
    const [loading, setLoading] = useState(false);

    // Cloudinary Configuration
    const cloudinaryConfig = {
        cloudName: "dq7spmok5",
    };

    // Dynamic Inputs
    const inputs = [
        { id: 'totalRaise', label: 'Total Raise', type: 'text', placeholder: 'Enter total raise' },
        { id: 'endIn', label: 'End In', type: 'datetime-local', placeholder: '' },
        { id: 'saleType', label: 'Sale Type', type: 'text', placeholder: 'Enter sale type' },
        { id: 'ticketPrice', label: 'Enter Ticket Price', type: 'text', placeholder: 'Enter Ticket Price' },
        { id: 'hostedBy', label: 'Hosted By', type: 'text', placeholder: 'Enter host name' },
        { id: 'backedBy', label: 'Backed By', type: 'text', placeholder: 'Enter backer name' },
        { id: 'comments', label: 'Comments', type: 'text', placeholder: 'Enter comments' },
        { id: 'twitterUrl', label: 'Twitter Url', type: 'text', placeholder: 'Enter Twitter url' },
        { id: 'YoutubeUrl', label: 'Youtube Url', type: 'text', placeholder: 'Enter Youtube url' },
        { id: 'telegramUrl', label: 'Telegram Url', type: 'text', placeholder: 'Enter Telegram url' },
        { id: 'discordUrl', label: 'Discord Url', type: 'text', placeholder: 'Enter Discord url' },
        { id: 'InstagramUrl', label: 'Instagram Url', type: 'text', placeholder: 'Enter Instagram url' },
    ];

    // Handle Input Changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    // Handle File Inputs
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, files } = e.target;
        if (files) {
            setFormData({ ...formData, [id]: files[0] });
        }
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    // Upload Image to Cloudinary
    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'tonimages'); // Use a preset created in Cloudinary

        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
            formData
        );
        return response.data.secure_url;
    };

    // Handle Form Submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { thumbnail, logo, description, ...otherData } = formData;

            // Upload images to Cloudinary
            console.log('Uploading thumbnail...');
            const thumbnailUrl = thumbnail instanceof File ? await uploadToCloudinary(thumbnail) : null;
            const logoUrl = logo instanceof File ? await uploadToCloudinary(logo) : null;

            // Save to Firebase
            const docRef = await addDoc(collection(db, 'projects'), {
                ...otherData,
                description,
                thumbnailUrl,
                logoUrl,
            });

            console.log('Document written with ID:', docRef.id);
            alert('Form submitted successfully!');
        } catch (error) {
            console.error('Error adding document:', error);
            alert('Error submitting form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex justify-center items-center p-4 bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full max-w-6xl bg-white p-6 shadow-lg rounded-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Project Form</h2>

                {/* Project Title and Start Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-700 mb-1">
                            Project Title
                        </label>
                        <input
                            id="projectTitle"
                            type="text"
                            placeholder="Enter project title"
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="StartDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                        </label>
                        <input
                            id="StartDate"
                            type="datetime-local"
                            placeholder="Enter Start Date"
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Thumbnail and Logo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                            Thumbnail
                        </label>
                        <input
                            id="thumbnail"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                            Logo
                        </label>
                        <input
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Dynamic Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {inputs.map((input) => (
                        <div key={input.id} className="mb-4">
                            <label htmlFor={input.id} className="block text-sm font-medium text-gray-700 mb-1">
                                {input.label}
                            </label>
                            <input
                                id={input.id}
                                type={input.type}
                                placeholder={input.placeholder}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    ))}
                </div>

                <div className='mb-4'>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        placeholder="Enter Description"
                        onChange={handleDescriptionChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default Form;