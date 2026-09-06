"use client";

import { useState } from "react";
import { Github, ExternalLink, Folder, FileText } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { FormField } from "./FormField";
import { EMAIL } from "@/lib/site";
import pfpic from "../media/pf_pic.png";
import intellilearn_pic from "../media/intellilearn.png"; // example for IntelliLearn
import replygeniepic from "../media/replygenie.png";
import vlnpic from "../media/vln.png";
import songrecpic from "../media/song_rec.png";
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

  /**
   * Field-level errors. The form previously relied entirely on native
   * validation tooltips, which are unstyled, vanish on blur, and expose
   * nothing to assistive tech. These persist inline and drive aria-invalid.
   */
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string): string => {
    const v = value.trim();
    if (name === "contact") return ""; // the only optional field
    if (!v) return "This field is required.";
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      return "Enter a valid email address, like name@example.com.";
    }
    return "";
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear an existing error as soon as the field becomes valid, rather than
    // making the user blur again to find out.
    setErrors((prev) =>
      prev[name] ? { ...prev, [name]: validateField(name, value) } : prev
    );
  };

  // Handle form submission using EmailJS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate everything up front so all problems surface at once, and put
    // focus on the first offending field.
    const nextErrors: Record<string, string> = {};
    for (const key of Object.keys(formData) as (keyof typeof formData)[]) {
      const msg = validateField(key, formData[key]);
      if (msg) nextErrors[key] = msg;
    }
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus();
      return;
    }

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
    /** A PDF write-up, surfaced as a labelled link rather than a bare icon. */
    report?: { href: string; label: string }
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
      report: { href: "/VLN_Report.pdf", label: "Read the thesis report" },
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
      title: "Song Recommendation Platform",
      description:
        "A serverless recommendation backend on AWS Lambda and API Gateway, provisioned end-to-end with Terraform — Cognito for auth, RDS Postgres for persistence, and a React frontend on S3 + CloudFront.",
      tech: ["AWS", "Terraform", "Python", "React"],
      github: "https://github.com/tahachm/moody-lyrics",
      image: songrecpic,
      span: "lg:col-span-3",
    },
    {
      title: "AttendiGo",
      description:
        "A full-stack attendance platform for teachers — class creation, a reporting dashboard, and AI-generated insights. A self-hosted n8n workflow joins attendance and student records on a webhook trigger and calls an LLM to surface trends and flag at-risk students.",
      tech: ["Flask", "React", "Supabase", "n8n"],
      github: "https://github.com/ahmed-fz11/attendigo-chalkboard-charm",
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

      {/* About. Section rhythm is deliberately varied rather than a uniform
          96px everywhere, which read as monotony. */}
      <section id="about" className="py-20 md:py-24">
        <SectionHeading num="01." title="About Me" />

        <div className="grid gap-12 md:grid-cols-[3fr_2fr] md:gap-16">
          <Reveal>
            {/* max-w-prose: this paragraph previously ran to ~78 characters
                with no constraint. Comfortable measure is 45-75. */}
            <p className="max-w-prose text-body text-content-muted">
              I&apos;m a Computer Science graduate from LUMS, where I graduated in May 2025. My journey in tech has led
              me from web development to the exciting realms of AI and Machine Learning, and most recently to full-stack
              engineering at scale as a Full-Stack Engineer at Tajir (YC W20). I thrive on challenges and continuously
              seek to expand my skillset.
            </p>
          </Reveal>

          <Reveal delay={80} className="group relative w-fit">
            <div className="relative z-10">
              <Image
                src={pfpic}
                alt="Ahmad Faraz"
                width={450}
                height={400}
                className="rounded object-cover grayscale transition-[filter,transform] duration-300 ease-out-quart group-hover:grayscale-0"
              />
              <div className="absolute inset-0 -z-10 translate-x-5 translate-y-5 rounded border-2 border-brand transition-transform duration-300 ease-out-quart group-hover:translate-x-3 group-hover:translate-y-3" />
            </div>
          </Reveal>
        </div>

        <Reveal delay={120} className="mt-16 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(skillCategories).map(([category, items]) => (
            <div key={category}>
              <p className="mb-2.5 flex items-center gap-2 font-mono text-eyebrow uppercase text-content">
                <span className="text-brand" aria-hidden="true">▹</span> {category}
              </p>
              <ul className="flex flex-wrap gap-x-3 gap-y-1 pl-5 font-mono text-xs text-content-muted md:text-sm">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Experience */}
      <section id="experience" className="py-20 md:py-24">
        <SectionHeading num="02." title="Where I've Worked" />

        <Reveal className="grid gap-8 md:grid-cols-[190px_1fr] md:gap-10">
          <div
            className="flex overflow-x-auto md:flex-col md:overflow-visible"
            role="tablist"
            aria-label="Employers"
          >
            {Object.keys(jobs).map((job) => {
              const selected = activeJob === job
              return (
                <button
                  key={job}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveJob(job)}
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-left font-mono text-sm transition-colors duration-200 md:border-b-0 md:border-l-2 ${
                    selected
                      ? "border-brand bg-brand/5 text-brand"
                      : "border-content/15 text-content-muted hover:bg-brand/5 hover:text-brand"
                  }`}
                >
                  {job}
                </button>
              )
            })}
          </div>

          <div>
            <h4 className="font-display text-subheading font-semibold text-content">
              {jobs[activeJob].title}{" "}
              <span className="text-brand">@ {jobs[activeJob].company}</span>
            </h4>
            <p className="mt-2 font-mono text-sm text-content-muted">
              {jobs[activeJob].date} · {jobs[activeJob].location}
            </p>

            {/* max-w-prose: these bullets ran to ~107 characters per line,
                roughly 43% over the readable ceiling. */}
            <ul className="mt-6 max-w-prose space-y-4">
              {jobs[activeJob].responsibilities.map((responsibility: string, index: number) => (
                <li key={index} className="flex gap-3">
                  <span className="mt-1 shrink-0 text-brand" aria-hidden="true">▹</span>
                  <span className="text-body text-content-muted">{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
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

                {/* Labelled, not a bare icon: a document glyph alone doesn't
                    say "thesis report PDF", and icon-only links were exactly
                    what the accessibility pass flagged. */}
                {project.report && (
                  <Link
                    href={project.report.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/report mt-4 inline-flex w-fit items-center gap-2 font-mono text-xs text-brand
                               underline-offset-4 transition-colors duration-200 hover:underline"
                  >
                    <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {project.report.label}
                    <span className="text-content-muted">(PDF)</span>
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 ease-out-quart group-hover/report:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </Link>
                )}

                {/* Full-strength token, not /80 — the opacity modifier put
                    this at 4.46:1, just under the 4.5:1 AA floor. */}
                <ul className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-5 font-mono text-xs text-content-muted">
                  {project.tech.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* Contact */}
      <section id="contact" className="py-20 md:py-24">
        <SectionHeading num="04." title="Get In Touch" />

        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <Reveal>
            <p className="max-w-prose text-body text-content-muted">
              I&apos;m currently looking for new opportunities. Whether you have a question
              or just want to say hi, I&apos;ll do my best to get back to you.
            </p>
            {/* A direct address, so a broken integration never costs a message. */}
            <p className="mt-6 font-mono text-sm text-content-muted">
              Prefer email?{" "}
              <Link
                href={`mailto:${EMAIL}`}
                className="text-brand underline-offset-4 transition-colors duration-200 hover:underline"
              >
                {EMAIL}
              </Link>
            </p>
          </Reveal>

          <Reveal delay={80}>
            {submitted ? (
              <div
                role="status"
                className="rounded-lg border border-brand/30 bg-surface-raised p-8"
              >
                <h4 className="font-display text-subheading font-semibold text-content">
                  Message sent
                </h4>
                <p className="mt-3 text-body text-content-muted">
                  Thanks for reaching out — I&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="rounded-lg border border-content/10 bg-surface-raised p-6 md:p-8"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    name="name" label="Name" autoComplete="name"
                    value={formData.name} error={errors.name}
                    onChange={handleChange} onBlur={handleBlur}
                  />
                  <FormField
                    name="email" label="Email" type="email" autoComplete="email"
                    value={formData.email} error={errors.email}
                    onChange={handleChange} onBlur={handleBlur}
                  />
                  <FormField
                    name="contact" label="Phone" type="tel" autoComplete="tel" optional
                    value={formData.contact} error={errors.contact}
                    onChange={handleChange} onBlur={handleBlur}
                  />
                  <FormField
                    name="city" label="City" autoComplete="address-level2"
                    value={formData.city} error={errors.city}
                    onChange={handleChange} onBlur={handleBlur}
                  />
                  <div className="sm:col-span-2">
                    <FormField
                      name="country" label="Country" autoComplete="country-name"
                      value={formData.country} error={errors.country}
                      onChange={handleChange} onBlur={handleBlur}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <FormField
                      name="message" label="Message" textarea
                      placeholder="What would you like to talk about?"
                      value={formData.message} error={errors.message}
                      onChange={handleChange} onBlur={handleBlur}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="mt-6 w-full rounded bg-brand px-7 py-4 font-mono text-sm text-surface
                             transition-[transform,opacity] duration-200 ease-out-quart
                             hover:-translate-y-0.5 disabled:cursor-not-allowed
                             disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {isSending ? "Sending…" : "Send message"}
                </button>

                {sendError && (
                  <p role="alert" className="mt-4 text-sm text-red-500 dark:text-red-400">
                    Something went wrong sending your message. Please try again, or email
                    me directly at {EMAIL}.
                  </p>
                )}
              </form>
            )}
          </Reveal>
        </div>
      </section>

    </main>
  );
}
