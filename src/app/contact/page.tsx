"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#eaf4fb] text-[#181c24] py-12 px-4">
      <div className="bg-white/90 dark:bg-[#23272f]/90 rounded-2xl shadow-2xl p-8 md:p-10 border border-white/20 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 flex items-center gap-2">
          <span>✉️</span> Contact Us
        </h1>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          For any questions, feedback, or support, please email us at:
        </p>
        <p className="mb-6 font-medium text-blue-800">support@risoca.com</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-700 text-white font-semibold py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Send Message
          </button>
        </form>
        {submitted && (
          <div className="mt-4 text-green-600 font-medium">Thank you for contacting us! We'll get back to you soon.</div>
        )}
      </div>
    </div>
  );
} 