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

const FormProject: React.FC = () => {
    const [formData, setFormData] = useState<{ [key: string]: string | File | File[] }>({});
    const [loading, setLoading] = useState(false);

    // Cloudinary Configuration
    const cloudinaryConfig = {
        cloudName: "dq7spmok5",
    };

    // Dynamic Inputs
    const inputs = [
        { id: 'projectTitle', label: 'Project Title', type: 'text', placeholder: 'Enter project title' },
        { id: 'description', label: 'Project Description', type: 'textarea', placeholder: 'Enter project description' },
        { id: 'thumbnail', label: 'Thumbnail Image', type: 'file', placeholder: '', accept: 'image/*' },
        { id: 'logo', label: 'Logo Image', type: 'file', placeholder: '', accept: 'image/*' },
        { id: 'images', label: 'More Images', type: 'file', placeholder: '', accept: 'image/*', multiple: true },
        { id: 'tba', label: 'TBA', type: 'datetime-local', placeholder: 'Enter TBA' },
        { id: 'maxAllocation', label: 'Max Allocation', type: 'text', placeholder: 'Enter max allocation' },
        { id: 'startIn', label: 'Start In', type: 'datetime-local', placeholder: 'Enter start date and time' },
        { id: 'telegramUrl', label: 'Telegram URL', type: 'text', placeholder: 'Enter Telegram URL' },
        { id: 'twitterUrl', label: 'Twitter URL', type: 'text', placeholder: 'Enter Twitter URL' },
        { id: 'youtubeUrl', label: 'YouTube URL', type: 'text', placeholder: 'Enter YouTube URL' },
        { id: 'projectAmount', label: 'Project Amount', type: 'text', placeholder: 'Enter project amount' },
    ];

    // Handle Input Changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    // Handle File Inputs
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, files } = e.target;
        if (files) {
            setFormData({ ...formData, [id]: id === 'images' ? Array.from(files) : files[0] });
        }
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
            const { thumbnail, logo, images, ...otherData } = formData;
    
            // Upload images to Cloudinary
            const thumbnailUrl = thumbnail instanceof File ? await uploadToCloudinary(thumbnail) : null;
            const logoUrl = logo instanceof File ? await uploadToCloudinary(logo) : null;
            const imageUrls = images instanceof Array ? await Promise.all(images.map(uploadToCloudinary)) : [];
    
            // Prepare data to save
            const dataToSave = {
                ...otherData,
                thumbnailUrl,
                logoUrl,
                imageUrls,
            };
    
            console.log('Data to save:', dataToSave);
    
            // Save to Firebase
            const docRef = await addDoc(collection(db, 'projectsMain'), dataToSave);
    
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

                {/* Dynamic Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {inputs.map((input) => (
                        <div key={input.id} className="mb-4">
                            <label htmlFor={input.id} className="block text-sm font-medium text-gray-700 mb-1">
                                {input.label}
                            </label>
                            {input.type === 'textarea' ? (
                                <textarea
                                    id={input.id}
                                    placeholder={input.placeholder}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ) : (
                                <input
                                    id={input.id}
                                    type={input.type}
                                    placeholder={input.placeholder}
                                    accept={input.accept}
                                    multiple={input.multiple}
                                    onChange={input.type === 'file' ? handleFileChange : handleChange}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        </div>
                    ))}
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

export default FormProject;