import React from 'react';
import { Head, useForm } from '@inertiajs/react';
// Assuming you have an AdminLayout or just wrap it in a div for now

export default function FeedbackIndex({ feedbacks }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this feedback?')) {
            destroy(route('admin.feedback.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Head title="Admin - User Feedback" />

            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">User Feedbacks</h2>
                        <p className="text-sm text-gray-500 mt-1">Review and manage feedback submitted by Kinetic Lab users.</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                                <th className="p-4 font-semibold border-b">User</th>
                                <th className="p-4 font-semibold border-b">Category</th>
                                <th className="p-4 font-semibold border-b">Message</th>
                                <th className="p-4 font-semibold border-b">Date</th>
                                <th className="p-4 font-semibold border-b text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {feedbacks.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No feedback records found.
                                    </td>
                                </tr>
                            ) : (
                                feedbacks.map((feedback) => (
                                    <tr key={feedback.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 align-top">
                                            <div className="font-medium text-gray-800">
                                                {feedback.user ? feedback.user.name : 'Unknown User'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {feedback.user ? feedback.user.email : ''}
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                                {feedback.category}
                                            </span>
                                        </td>
                                        <td className="p-4 align-top text-sm text-gray-700 max-w-md whitespace-pre-wrap">
                                            {feedback.message}
                                        </td>
                                        <td className="p-4 align-top text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(feedback.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 align-top text-right">
                                            <button 
                                                onClick={() => handleDelete(feedback.id)}
                                                className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors border border-red-200 hover:bg-red-50 px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}