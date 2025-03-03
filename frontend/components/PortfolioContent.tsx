"use client";

import { useState } from "react";
import { Github, ExternalLink, Folder } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import pfpic from "../media/pf_pic.jpg";
import intellilearn_pic from "../media/intellilearn.png"; // example for IntelliLearn
import songrec from "../media/song_rec.png";
import chefpic from "../media/chef.jpeg";
import emailjs from "emailjs-com";

export function PortfolioContent() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [activeJob, setActiveJob] = useState("Teach Smart");

  // State for the contact form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    city: "",
    country: "",
    message: "",
  });

  // New state to track if the form was submitted
  const [submitted, setSubmitted] = useState(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission using EmailJS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await emailjs.send(
      "service_sdx5kvj",        // Replace with your EmailJS service ID
      "template_3l4r2ik",        // Replace with your EmailJS template ID
      {
        name: formData.name,
        email: formData.email,
        contact: formData.contact || "Not Provided",
        city: formData.city,
        country: formData.country,
        message: formData.message,
      },
      "LdTK5qTkQpDzv_vKl"        // Replace with your EmailJS public key
    );
    // After a successful submission, set submitted to true so the form is replaced
    setSubmitted(true);
  };

  const jobs = {
    "Teach Smart": {
      title: "Machine Learning Engineer",
      company: "Teach Smart",
      date: "December 2024 - Present",
      location: "Newark, DE (Remote)",
      responsibilities: [
        "Developed and deployed a Retrieval-Augmented Generation (RAG) chatbot using Python Flask and Pinecone vector database, assisting students and parents according to state-aligned curricula with optional quiz generation feature.",
        "Owned end-to-end ML engineering, API development, and MLOps in a fast-paced startup, optimizing LLM responses through prompt engineering, managing data pipelines, and ensuring system reliability.",
      ],
    },
    "Motive Inc": {
      title: "Intern - AI Foundation Team",
      company: "Motive Inc. (Formerly Keep Truckin)",
      date: "June 2024 - September 2024",
      location: "Remote",
      responsibilities: [
        "Developed a Flask-based application to visualize computer vision model predictions using Voxel FiftyOne, enabling seamless dataset retrieval from AWS S3 and streamlining model validation workflows.",
        "Optimized backend by implementing dynamic dataset loading from AWS S3 and model detections, reducing storage overhead and improving evaluation speed, while collaborating in a remote, multi-time-zone team.",
      ],
    },
    Devsinc: {
      title: "Full-Stack Developer Intern",
      company: "Devsinc",
      date: "July 2023 - September 2023",
      location: "Lahore, Pakistan",
      responsibilities: [
        "Developed an interactive social media post application using React.js, integrating external APIs for seamless functionality and deploying on Netlify, enhancing UI/UX and performance.",
        "Built a food delivery platform using the MERN stack, implementing JWT authentication for secure user access and optimizing MongoDB for efficient backend performance, ensuring a smooth user experience.",
      ],
    },
    LUMS: {
      title: "Teaching Assistant",
      company: "Lahore University of Management Sciences",
      date: "September 2021 - Present",
      location: "Lahore, Pakistan",
      responsibilities: [
        "Served as a Teaching Assistant for Data Science, Data Structures, and Object Oriented Programming courses.",
        "Mentored 150+ students per course through assignments, grading, labs, and project supervision.",
        "Facilitated learning and understanding of complex programming concepts and data analysis techniques.",
      ],
    },
  };

  // Featured projects array with unique images
  const projects = [
    {
      title: "IntelliLearn",
      description:
        "An AI-powered ed-tech platform enabling course exploration, enrollment, community engagement, and personalized learning with a GPT-3.5 chatbot and text summarization. Features include a timed quiz system with concept feedback, React Redux for state management, and student/admin dashboards for performance tracking.",
      tech: ["MERN", "GPT-3.5", "React Redux"],
      links: {
        github: "https://github.com/SE-Group-18/GPT-EdTech",
        external: "https://intellilearn-gamma.vercel.app/",
      },
      image: intellilearn_pic,
    },
    {
      title: "Song Recommendation Application",
      description:
        "A scalable song recommendation app deployed on AWS using EC2, S3, RDS, and Lambda, ensuring low-latency responses and efficient backend processing. Integrated AWS Cognito for secure authentication and implemented Auto Scaling, ALB, and CloudFront to enhance availability and performance.",
      tech: ["React.js", "Python", "Terraform", "AWS"],
      links: {
        github: "https://github.com/tahachm/moody-lyrics",
        external: "#",
      },
      image: songrec,
    },
    {
      title: "AI Chef Assistant",
      description:
        "An AI-powered cooking assistant that generates personalized recipes with step-by-step cooking instructions and corresponding images using Llama and DALL·E 2, providing users with nutrition insights, prep time, and cooking tips. React.js frontend is deployed on Netlify and Python Flask backend is deployed on Hugging Face Spaces.",
      tech: ["Flask", "React.js", "Llama 3", "DALL·E 2", "Hugging Face Spaces"],
      links: {
        github: "https://github.com/Zaimr49/AI-Chef-Assistant/tree/main",
        external: "https://ai-chef-assistant.netlify.app/",
      },
      image: chefpic,
    },
  ];

  // Other projects array with unique projects
  const otherProjects = [
    {
      title: "Indoor Vision and Language Navigation Agent",
      description: "A self-prompting indoor navigation system that leverages open-source vision and language models with Matterport3D and Room2Room datasets. The pipeline transforms a single textual prompt into a step-by-step image guide for efficient indoor navigation.",
      tech: ["Deepseek", "LlavaNext", "Python","GPT","Matterport3D"],
      links: {
        github: "#",
        external: "#",
      },
    },
    {
      title: "Content Moderation and Toxicity Classification",
      description: "A content moderation system implementing Naive Bayes, RNN, and BERT, with BERT achieving an 88.29% recall. Class imbalance handling improved toxicity classification, with BERT identified as the most effective model. Future enhancements include ensembling and expanded datasets.",
      tech: ["Python", "Hugging Face Transformers"],
      links: {
        github: "https://github.com/ahmed-fz11/Content-Moderation-and-Toxicity-Classification",
        external: "#",
      },
    },
    {
      title: "US Crime Data Analysis and Prediction",
      description: "Analyzed US crime data and demographic factors over four decades. Used causal inference to evaluate their impact on crime rates. Achieved accurate predictions with a two-layer neural network and SARIMAX modeling.",
      tech: ["Python", "TensorFlow/Keras", "Scikit-Learn","Statsmodels","PMDARIMA"],
      links: {
        github: "https://github.com/ahmed-fz11/US-Crime-Analysis-and-Prediction",
        external: "https://medium.com/@ahmedd.fz11/beyond-the-headlines-a-data-driven-analysis-of-crime-in-us-amidst-shifting-demographics-and-fdc42d4ebcfa",
      },
    },
  ];

  return (
    <main className="container mx-auto px-8 md:px-24 py-24">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center">
        <p className="text-[#64ffda] font-mono mb-5">Hi, my name is</p>
        <h1 className="text-6xl md:text-7xl font-bold text-[#0a192f] dark:text-slate-200 mb-4">
          Ahmad Faraz.
        </h1>
        <h2 className="text-5xl md:text-6xl font-bold text-[#3a506b] dark:text-slate-400 mb-6">
          I build things for the web and AI.
        </h2>
        <p className="max-w-xl text-lg mb-12 text-[#3a506b] dark:text-slate-400">
          I'm a Computer Science student at LUMS, specializing in Machine Learning and Full-Stack Development.
          Currently, I'm working as a Machine Learning Engineer at Teach Smart, building AI-powered educational tools.
        </p>
        <Link
          href="#work"
          className="border border-[#64ffda] text-[#64ffda] px-7 py-4 rounded w-fit hover:bg-[#64ffda]/10 transition-all duration-300"
        >
          Check out my work!
        </Link>
      </section>

      {/* About Section */}
      <section id="about" className="py-24">
        <div className="flex items-center gap-4 mb-8">
          <h3 className="text-2xl font-semibold text-[#0a192f] dark:text-slate-200">
            <span className="text-[#64ffda] font-mono">01.</span> About Me
          </h3>
          <div className="h-[1px] w-72 bg-[#0a192f]/20 dark:bg-slate-600"></div>
        </div>
        <div className="grid md:grid-cols-[3fr_2fr] gap-12">
          <div>
            <p className="mb-4 text-[#3a506b] dark:text-slate-400">
              I'm a passionate Computer Science student at LUMS, set to graduate in May 2025. My journey in tech has led
              me from web development to the exciting realms of AI and Machine Learning. I thrive on challenges and
              continuously seek to expand my skillset.
            </p>
            <p className="mb-4 text-[#3a506b] dark:text-slate-400">Here are some of my top skills:</p>
            <ul className="grid grid-cols-2 gap-2 font-mono text-sm text-[#3a506b] dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="text-[#64ffda]">▹</span> Machine Learning
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#64ffda]">▹</span> Full-Stack Development (MERN)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#64ffda]">▹</span> Python Web Frameworks 
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#64ffda]">▹</span> JavaScript/TypeScript
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#64ffda]">▹</span> AWS Cloud Services
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#64ffda]">▹</span> LangChain
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#64ffda]">▹</span> Retrieval Augmented Generation (RAG)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#64ffda]">▹</span> Natural Language Processing
              </li>
            </ul>
          </div>
          <div className="relative group">
            <div className="relative z-10">
              <Image
                src={pfpic}
                alt="Ahmad Faraz"
                width={450}
                height={400}
                className="rounded grayscale hover:grayscale-0 transition-all"
              />
              <div className="absolute inset-0 border-2 border-[#64ffda] rounded translate-x-5 translate-y-5 -z-10 group-hover:translate-x-4 group-hover:translate-y-4 transition-all"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24">
        <div className="flex items-center gap-4 mb-8">
          <h3 className="text-2xl font-semibold text-[#0a192f] dark:text-slate-200">
            <span className="text-[#64ffda] font-mono">02.</span> Where I've Worked
          </h3>
          <div className="h-[1px] w-72 bg-[#0a192f]/20 dark:bg-slate-600"></div>
        </div>
        <div className="grid md:grid-cols-[200px_1fr] gap-4">
          <div className="flex flex-col">
            {Object.keys(jobs).map((job) => (
              <button
                key={job}
                onClick={() => setActiveJob(job)}
                className={`px-4 py-3 text-left font-mono text-sm border-l-2 ${
                  activeJob === job
                    ? "border-[#64ffda] bg-[#e6f1ff] dark:bg-[#112240] text-[#64ffda]"
                    : "border-[#0a192f]/20 dark:border-slate-600 hover:bg-[#e6f1ff] dark:hover:bg-[#112240]/50 hover:text-[#64ffda]"
                }`}
              >
                {job}
              </button>
            ))}
          </div>
          <div>
            <h4 className="text-xl text-[#0a192f] dark:text-slate-200 mb-1">
              {jobs[activeJob].title} <span className="text-[#64ffda]">@ {jobs[activeJob].company}</span>
            </h4>
            <p className="font-mono text-sm mb-1 text-[#3a506b] dark:text-slate-400">{jobs[activeJob].date}</p>
            <p className="font-mono text-sm mb-4 text-[#3a506b] dark:text-slate-400">{jobs[activeJob].location}</p>
            <ul className="space-y-4">
              {jobs[activeJob].responsibilities.map((responsibility, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-[#64ffda] mt-1">▹</span>
                  <span className="text-[#3a506b] dark:text-slate-400">{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="work" className="py-24">
        <div className="flex items-center gap-4 mb-12">
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-200">
            <span className="text-[#64ffda] font-mono">03.</span> Some Things I've Built
          </h3>
          <div className="h-[1px] w-full bg-slate-200 dark:bg-slate-600"></div>
        </div>
        {/* Featured Projects */}
        <div className="space-y-24 md:space-y-36">
          {projects.map((project, index) => (
            <div key={index} className="relative group">
              {/* Project Content */}
              <div className="md:absolute md:top-0 md:left-0 md:w-1/2 z-10 bg-slate-100/90 dark:bg-[#112240]/90 p-6 rounded-lg md:rounded-none mb-6 md:mb-0">
                <p className="text-[#64ffda] font-mono text-sm mb-2">Featured Project</p>
                <h4 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-200 mb-4">
                  {project.title}
                </h4>
                {/* Description Box */}
                <div className="md:bg-slate-100 md:dark:bg-[#112240] md:p-6 md:rounded-lg md:shadow-xl mb-4">
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-400">{project.description}</p>
                </div>
                {/* Technologies */}
                <ul className="flex flex-wrap gap-2 md:gap-4 font-mono text-xs md:text-sm my-4 text-slate-700 dark:text-slate-400">
                  {project.tech.map((tech, techIndex) => (
                    <li key={techIndex} className="hover:text-[#64ffda] transition-colors">
                      {tech}
                    </li>
                  ))}
                </ul>
                {/* Links */}
                <div className="flex gap-4">
                  <Link
                    href={project.links.github}
                    className="text-slate-700 dark:text-slate-400 hover:text-[#64ffda] transition-colors transform hover:-translate-y-1 duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-5 w-5" />
                  </Link>
                  <Link
                    href={project.links.external}
                    className="text-slate-700 dark:text-slate-400 hover:text-[#64ffda] transition-colors transform hover:-translate-y-1 duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </Link>
                </div>
              </div>
              {/* Project Image Container */}
              <div className="relative w-full md:w-2/3 aspect-video md:ml-auto">
                <Image
                  src={project.image}
                  alt={project.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg transition-all duration-300 hover:brightness-75"
                />
                <div className="absolute inset-0 rounded-lg bg-transparent group-hover:bg-black/25 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
        {/* Other Projects Section */}
        <h4 className="text-center text-[#0a192f] dark:text-slate-200 text-xl mt-24 mb-12">
          Other Noteworthy Projects
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherProjects.map((proj, idx) => (
            <div key={idx} className="bg-[#e6f1ff] dark:bg-[#112240] rounded-lg p-6 hover:-translate-y-2 transition-all">
              <div className="flex justify-between items-center mb-6">
                <Folder className="text-[#64ffda] h-8 w-8 md:h-10 md:w-10" />
                <div className="flex gap-4">
                  <Link href={proj.links.github} className="text-[#0a192f] dark:text-slate-400 hover:text-[#64ffda]">
                    <Github className="h-5 w-5" />
                  </Link>
                  <Link href={proj.links.external} className="text-[#0a192f] dark:text-slate-400 hover:text-[#64ffda]">
                    <ExternalLink className="h-5 w-5" />
                  </Link>
                </div>
              </div>
              <h5 className="text-[#0a192f] dark:text-slate-200 text-lg md:text-xl mb-2">{proj.title}</h5>
              <p className="text-sm mb-4 text-[#3a506b] dark:text-slate-400">{proj.description}</p>
              <ul className="flex flex-wrap gap-2 md:gap-4 font-mono text-xs md:text-sm text-[#3a506b] dark:text-slate-400">
                {proj.tech.map((tech, tidx) => (
                  <li key={tidx}>{tech}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section with Conditional Rendering */}
      <section id="contact" className="py-24 text-center max-w-xl mx-auto">
        <p className="text-[#64ffda] font-mono mb-4">04. What's Next?</p>
        <h3 className="text-4xl font-semibold text-[#0a192f] dark:text-slate-200 mb-4">Get In Touch</h3>
        <p className="mb-12 text-[#3a506b] dark:text-slate-400">
          I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </p>
        {submitted ? (
          // Thank You Message (displayed after form submission)
          <div className="bg-white dark:bg-[#112240] p-6 rounded-lg shadow-lg">
            <h3 className="text-3xl font-bold text-[#0a192f] dark:text-slate-200">Thank You!</h3>
            <p className="mt-4 text-[#3a506b] dark:text-slate-400">
              Your message has been sent successfully. I will get back to you soon!
            </p>
          </div>
        ) : (
          // The Contact Form
          <form onSubmit={handleSubmit} className="bg-white dark:bg-[#112240] p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="p-3 border rounded w-full"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="p-3 border rounded w-full"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                type="tel"
                name="contact"
                placeholder="Contact Number (Optional)"
                value={formData.contact}
                onChange={handleChange}
                className="p-3 border rounded w-full"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="p-3 border rounded w-full"
              />
            </div>
            <div className="mt-4">
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                required
                className="p-3 border rounded w-full"
              />
            </div>
            <div className="mt-4">
              <textarea
                name="message"
                placeholder="Tell me about any service you require from me or ask a question..."
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="p-3 border rounded w-full"
              />
            </div>
            <button
              type="submit"
              className="border border-[#64ffda] text-[#64ffda] px-7 py-4 rounded w-full mt-4"
            >
              Send Message
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
