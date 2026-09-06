"use client";

import { useState } from "react";
import { Github, ExternalLink, Folder } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import pfpic from "../media/pf_pic.png";
import intellilearn_pic from "../media/intellilearn.png"; // example for IntelliLearn
import replygeniepic from "../media/replygenie.png";
import vlnpic from "../media/vln.png";
import emailjs from "emailjs-com";

export function PortfolioContent() {
  // const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [activeJob, setActiveJob] = useState("Tajir");

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
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission using EmailJS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendError(false);
    try {
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
    } catch (error) {
      console.error("Error sending message:", error);
      setSendError(true);
    } finally {
      setIsSending(false);
    }
  };

  const skillCategories: Record<string, string[]> = {
    Languages: ["Python", "TypeScript", "JavaScript", "Kotlin", "SQL", "C++", "C", "Haskell"],
    "Frameworks & Technologies": [
      "Flask",
      "FastAPI",
      "Node.js",
      "Express.js",
      "React.js",
      "Redux",
      "Android SDK (Kotlin, MVVM)",
      "Office.js",
    ],
    "AI & Machine Learning": [
      "OpenAI API",
      "Anthropic Claude",
      "LangChain",
      "RAG",
      "Vector Search",
      "AI Agents",
      "MCP",
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
    ],
    "Databases & Data": ["PostgreSQL", "MongoDB", "Supabase", "BigQuery", "Firestore", "Pandas", "NumPy"],
    "Cloud & DevOps": ["AWS (Lambda, S3, RDS, Cognito)", "GCP (Cloud Run, GCS)", "Docker", "Terraform", "CI/CD", "Vercel"],
    "Developer Tools": ["Git", "n8n", "Retool", "Figma", "Jira", "VS Code", "Cursor", "Claude Code"],
  };

  // Fixed (provide an explicit type)
interface Job {
  title: string;
  company: string;
  date: string;
  location: string;
  responsibilities: string[];
}

const jobs: Record<string, Job>  = {
    Tajir: {
      title: "Full-Stack Engineer",
      company: "Tajir (YC W20)",
      date: "June 2025 - July 2026",
      location: "Lahore, Pakistan",
      responsibilities: [
        "Led delivery-operations systems for a B2B commerce platform moving 4,500+ orders/day across 62 zones — from a handcart-batching algorithm to a rotational-driver assignment model — across Flask, PostgreSQL, Retool, and a Kotlin Android app.",
        "Took the order-editing and cancellation-reason features from backend to Android UI, driving a 10x jump in structured customer feedback within 10 days of launch.",
        "Tracked down a driver-pairing bug that was corrupting dispatch, cutting incidents from several a week to zero, then resolved a live production outage affecting 143 orders in under 10 minutes.",
        "Found a delivery-planning failure that had silently orphaned 190+ deliveries, shipped a fix, and cut a recurring $270/month cloud cost by redesigning the analytics pipeline behind it.",
      ],
    },
    "Teach Smart": {
      title: "Machine Learning Engineer",
      company: "Teach Smart",
      date: "December 2024 - May 2025",
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
      date: "September 2021 - May 2025",
      location: "Lahore, Pakistan",
      responsibilities: [
        "Served as a Teaching Assistant for Data Science, Data Structures, and Object Oriented Programming courses.",
        "Mentored 150+ students per course through assignments, grading, labs, and project supervision.",
        "Facilitated learning and understanding of complex programming concepts and data analysis techniques.",
      ],
    },
  };

  // Featured projects array with unique images
  /**
   * One unified project list. Previously this was two arrays rendered as
   * three full-width overlap cards plus a uniform 3-col grid; the overlap
   * layout put an absolutely-positioned panel over a shorter image, so the
   * panel spilled onto bare background below ~1280px. The bento grid removes
   * the overlap entirely.
   *
   * `external` is only set where a live URL actually exists — five cards
   * previously rendered an external-link icon pointing at "#", which looked
   * clickable and did nothing.
   */
  const projects: {
    title: string
    description: string
    tech: string[]
    github: string
    external?: string
    image?: StaticImageData
    span: string
  }[] = [
    {
      title: "ReplyGenie",
      description:
        "An AI-powered Outlook add-in that reads the active email thread and drafts contextual replies with GPT-4o-mini — no more tab-switching to catch up on a conversation. Built as a multi-tenant SaaS with FastAPI and Supabase Auth, with per-tenant data isolation and full draft-history logging.",
      tech: ["React", "Office.js", "FastAPI", "Supabase", "OpenAI"],
      github: "https://github.com/ahmed-fz11/outlook-ai-copilot",
      image: replygeniepic,
      span: "lg:col-span-4",
    },
    {
      title: "Zero-Shot Vision and Language Navigation",
      description:
        "A zero-shot indoor navigation agent that follows plain-language instructions with no finetuning, built for my undergraduate thesis. Combines panoramic scene summarization with a graph-based spatial memory, reaching a 47.13% success rate on Room-to-Room and outperforming prior training-based approaches.",
      tech: ["LLaVA-NeXT", "GPT-4o", "Matterport3D"],
      github: "https://github.com/ahmed-fz11/LLM-Nav",
      image: vlnpic,
      span: "lg:col-span-2",
    },
    {
      title: "IntelliLearn",
      description:
        "An AI-powered ed-tech platform for course exploration, enrollment and personalized learning, with a GPT-3.5 chatbot, text summarization, a timed quiz system with concept feedback, and student/admin dashboards.",
      tech: ["MERN", "GPT-3.5", "React Redux"],
      github: "https://github.com/SE-Group-18/GPT-EdTech",
      external: "https://intellilearn-gamma.vercel.app/",
      image: intellilearn_pic,
      span: "lg:col-span-3",
    },
    {
      title: "AttendiGo",
      description:
        "A full-stack attendance platform for teachers — class creation, a reporting dashboard, and AI-generated insights. A self-hosted n8n workflow joins attendance and student records on a webhook trigger and calls an LLM to surface trends and flag at-risk students.",
      tech: ["Flask", "React", "Supabase", "n8n"],
      github: "https://github.com/ahmed-fz11/attendigo-chalkboard-charm",
      span: "lg:col-span-3",
    },
    {
      title: "Song Recommendation Platform",
      description:
        "A serverless recommendation backend on AWS Lambda and API Gateway, provisioned end-to-end with Terraform — Cognito for auth, RDS Postgres for persistence, and a React frontend on S3 + CloudFront.",
      tech: ["AWS", "Terraform", "Python", "React"],
      github: "https://github.com/tahachm/moody-lyrics",
      span: "lg:col-span-2",
    },
    {
      title: "AI Chef Assistant",
      description:
        "A cooking assistant that generates personalized recipes with step-by-step instructions and matching images using Llama 3 and DALL·E 2, plus nutrition insights and prep time.",
      tech: ["Flask", "React.js", "Llama 3", "DALL·E 2"],
      github: "https://github.com/Zaimr49/AI-Chef-Assistant/tree/main",
      external: "https://ai-chef-assistant.netlify.app/",
      span: "lg:col-span-2",
    },
    {
      title: "Content Moderation & Toxicity Classification",
      description:
        "Naive Bayes, RNN and BERT compared on toxic-comment classification, with BERT reaching 88.29% recall after class-imbalance handling.",
      tech: ["Python", "Hugging Face"],
      github: "https://github.com/ahmed-fz11/Content-Moderation-and-Toxicity-Classification",
      span: "lg:col-span-2",
    },
    {
      title: "US Crime Data Analysis and Prediction",
      description:
        "Four decades of US crime and demographic data analysed with causal inference, then forecast with a two-layer neural network and SARIMAX modelling. Written up on Medium.",
      tech: ["Python", "TensorFlow/Keras", "Scikit-Learn", "Statsmodels"],
      github: "https://github.com/ahmed-fz11/US-Crime-Analysis-and-Prediction",
      external:
        "https://medium.com/@ahmedd.fz11/beyond-the-headlines-a-data-driven-analysis-of-crime-in-us-amidst-shifting-demographics-and-fdc42d4ebcfa",
      span: "lg:col-span-6",
    },
  ];

  return (
    <main className="container mx-auto px-8 md:px-24 pb-24">
      {/*
        Hero. Previously min-h-screen + justify-center on top of the main's
        py-24, which pushed the headline 41% of the way down the first screen.
        Now the section owns its spacing and the type starts near the top.
        Entrance runs once on load, staggered via --enter-delay.
      */}
      <section className="flex min-h-[calc(100svh-4rem)] flex-col justify-center pt-28 pb-20">
        <p
          className="enter font-mono text-eyebrow uppercase text-brand mb-6"
          style={{ "--enter-delay": "0ms" } as React.CSSProperties}
        >
          Hi, my name is
        </p>

        <h1
          className="enter font-display text-display-1 font-bold text-content text-balance"
          style={{ "--enter-delay": "70ms" } as React.CSSProperties}
        >
          Ahmad Faraz.
        </h1>

        {/*
          Weight drops to 500 here. Previously both h1 and h2 were 700 at a
          1.2:1 size step, so the two largest elements competed instead of
          establishing rank.
        */}
        <h2
          className="enter font-display text-display-2 font-medium text-content-muted mt-4 max-w-[22ch] text-balance"
          style={{ "--enter-delay": "140ms" } as React.CSSProperties}
        >
          I build things for the web and AI.
        </h2>

        <p
          className="enter max-w-prose text-body-lg text-content-muted mt-8"
          style={{ "--enter-delay": "210ms" } as React.CSSProperties}
        >
          I&apos;m a Computer Science graduate from LUMS, specializing in Machine Learning and Full-Stack Development.
          Most recently, I worked as a Full-Stack Engineer at Tajir (YC W20), and I&apos;m currently open to new opportunities.
        </p>

        <div
          className="enter mt-12 flex flex-wrap items-center gap-x-8 gap-y-4"
          style={{ "--enter-delay": "280ms" } as React.CSSProperties}
        >
          {/* Filled: the one primary action on the first screen. It was
              previously an outline button, identical in weight to Résumé. */}
          <Link
            href="#work"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="group inline-flex items-center gap-2 rounded bg-brand px-7 py-4 font-mono text-sm text-surface
                       transition-[transform,box-shadow] duration-200 ease-out-quart
                       hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/20"
          >
            View my work
            <span
              aria-hidden="true"
              className="transition-transform duration-200 ease-out-quart group-hover:translate-x-1"
            >
              →
            </span>
          </Link>

          <Link
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="font-mono text-sm text-content-muted underline-offset-4 transition-colors duration-200 hover:text-brand hover:underline"
          >
            Get in touch
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24">
        <div className="flex items-center gap-4 mb-8">
          <h3 className="text-2xl font-semibold text-content">
            <span className="text-brand font-mono">01.</span> About Me
          </h3>
          <div className="h-[1px] w-72 bg-content/20 dark:bg-slate-600"></div>
        </div>
        <div className="grid md:grid-cols-[3fr_2fr] gap-12">
          <div>
            <p className="mb-4 text-content-muted">
              I&apos;m a Computer Science graduate from LUMS, where I graduated in May 2025. My journey in tech has led
              me from web development to the exciting realms of AI and Machine Learning, and most recently to full-stack
              engineering at scale as a Full-Stack Engineer at Tajir (YC W20). I thrive on challenges and continuously
              seek to expand my skillset.
            </p>
          </div>
          <div className="relative group">
            <div className="relative z-10">
              <Image
                src={pfpic}
                alt="Ahmad Faraz"
                width={450}
                height={400}
                className="rounded grayscale hover:grayscale-0 transition-all object-cover"
              />
              <div className="absolute inset-0 border-2 border-brand rounded translate-x-5 translate-y-5 -z-10 group-hover:translate-x-4 group-hover:translate-y-4 transition-all"></div>
            </div>
          </div>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          {Object.entries(skillCategories).map(([category, items]) => (
            <div key={category}>
              <p className="flex items-center gap-2 font-mono text-sm text-content mb-2">
                <span className="text-brand">▹</span> {category}
              </p>
              <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs md:text-sm text-content-muted pl-5">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24">
        <div className="flex items-center gap-4 mb-8">
          <h3 className="text-2xl font-semibold text-content">
            <span className="text-brand font-mono">02.</span> Where I&apos;ve Worked
          </h3>
          <div className="h-[1px] w-72 bg-content/20 dark:bg-slate-600"></div>
        </div>
        <div className="grid md:grid-cols-[200px_1fr] gap-4">
          <div className="flex flex-col">
            {Object.keys(jobs).map((job) => (
              <button
                key={job}
                onClick={() => setActiveJob(job)}
                className={`px-4 py-3 text-left font-mono text-sm border-l-2 ${
                  activeJob === job
                    ? "border-brand bg-surface-raised text-brand"
                    : "border-content/20 dark:border-slate-600 hover:bg-surface-raised dark:hover:bg-surface-raised/50 hover:text-brand"
                }`}
              >
                {job}
              </button>
            ))}
          </div>
          <div>
            <h4 className="text-xl text-content mb-1">
              {jobs[activeJob].title} <span className="text-brand">@ {jobs[activeJob].company}</span>
            </h4>
            <p className="font-mono text-sm mb-1 text-content-muted">{jobs[activeJob].date}</p>
            <p className="font-mono text-sm mb-4 text-content-muted">{jobs[activeJob].location}</p>
            <ul className="space-y-4">
              {jobs[activeJob].responsibilities.map((responsibility:string, index:number) => (
                <li key={index} className="flex gap-2">
                  <span className="text-brand mt-1">▹</span>
                  <span className="text-content-muted">{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Projects — bento grid. Varied spans give the section rhythm and,
          critically, remove the absolute-overlay layout whose panel used to
          overflow its image below 1280px. */}
      <section id="work" className="py-24 md:py-28">
        <SectionHeading num="03." title="Some Things I've Built" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
          {projects.map((project, index) => (
            <Reveal
              key={project.title}
              as="article"
              delay={Math.min(index, 3) * 60}
              className={`${project.span} group relative flex flex-col overflow-hidden rounded-lg
                          border border-content/10 bg-surface-raised
                          transition-[transform,border-color,box-shadow] duration-200 ease-out-quart
                          hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5`}
            >
              {project.image && (
                <div className="relative aspect-video overflow-hidden border-b border-content/10">
                  <Image
                    src={project.image}
                    alt={`${project.title} preview`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
                    className="object-cover transition-transform duration-300 ease-out-quart group-hover:scale-[1.03]"
                  />
                </div>
              )}

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  {!project.image && (
                    <Folder className="h-8 w-8 shrink-0 text-brand" aria-hidden="true" />
                  )}
                  <div className="ml-auto flex gap-3">
                    <Link
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} source on GitHub`}
                      className="text-content-muted transition-[color,transform] duration-200 ease-out-quart hover:text-brand hover:-translate-y-0.5"
                    >
                      <Github className="h-5 w-5" aria-hidden="true" />
                    </Link>
                    {/* Only rendered when a live URL exists. */}
                    {project.external && (
                      <Link
                        href={project.external}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} live site`}
                        className="text-content-muted transition-[color,transform] duration-200 ease-out-quart hover:text-brand hover:-translate-y-0.5"
                      >
                        <ExternalLink className="h-5 w-5" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>

                <h4 className="font-display text-subheading font-semibold text-content transition-colors duration-200 group-hover:text-brand">
                  {project.title}
                </h4>

                <p className="mt-3 max-w-prose text-sm leading-relaxed text-content-muted">
                  {project.description}
                </p>

                <ul className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-5 font-mono text-xs text-content-muted/80">
                  {project.tech.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* Contact Section with Conditional Rendering */}
      <section id="contact" className="py-24 text-center max-w-xl mx-auto">
        <p className="text-brand font-mono mb-4">04. What&apos;s Next?</p>
        <h3 className="text-4xl font-semibold text-content mb-4">Get In Touch</h3>
        <p className="mb-12 text-content-muted">
          I&apos;m currently looking for new opportunities. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
        </p>
        {submitted ? (
          // Thank You Message (displayed after form submission)
          <div className="bg-surface-raised p-6 rounded-lg shadow-lg">
            <h3 className="text-3xl font-bold text-content">Thank You!</h3>
            <p className="mt-4 text-content-muted">
              Your message has been sent successfully. I will get back to you soon!
            </p>
          </div>
        ) : (
          // The Contact Form
          <form onSubmit={handleSubmit} className="bg-surface-raised p-6 rounded-lg shadow-lg">
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
              disabled={isSending}
              className="border border-brand text-brand px-7 py-4 rounded w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? "Sending..." : "Send Message"}
            </button>
            {sendError && (
              <p className="mt-4 text-red-500 text-sm">
                Something went wrong sending your message. Please try again, or email me directly at ahmedd.fz11@gmail.com.
              </p>
            )}
          </form>
        )}
      </section>
    </main>
  );
}
