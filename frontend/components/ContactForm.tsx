"use client"

import type React from "react"

import { useState } from "react"
import emailjs from "emailjs-com"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    projectDescription: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isError, setIsError] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsError(false)

    try {
      await emailjs.send(
        "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
        "YOUR_TEMPLATE_ID", // Replace with your EmailJS template ID
        {
          to_email: "ahmedd.fz11@gmail.com",
          from_name: formData.name,
          from_email: formData.email,
          project_type: formData.projectType,
          project_description: formData.projectDescription,
          message: formData.message,
        },
        "YOUR_USER_ID", // Replace with your EmailJS user ID
      )
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error sending email:", error)
      setIsError(true)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-4">Thank you for your message!</h3>
        <p>I'll get back to you as soon as possible.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
      <div>
        <label htmlFor="email" className="block mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
      <div>
        <label htmlFor="projectType" className="block mb-1">
          Project Type
        </label>
        <select
          id="projectType"
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="">Select a project type</option>
          <option value="website">Website</option>
          <option value="app">Mobile App</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="projectDescription" className="block mb-1">
          Project Description
        </label>
        <textarea
          id="projectDescription"
          name="projectDescription"
          value={formData.projectDescription}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          rows={4}
        ></textarea>
      </div>
      <div>
        <label htmlFor="message" className="block mb-1">
          Additional Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          rows={4}
        ></textarea>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
        Send Message
      </button>
      {isError && <p className="text-red-500">There was an error sending your message. Please try again later.</p>}
    </form>
  )
}

