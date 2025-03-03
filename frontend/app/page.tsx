import { Navbar } from "@/components/Navbar"
import { PortfolioContent } from "@/components/PortfolioContent"
import { ThemeProvider } from "next-themes"
import Link from "next/link"

export default function Portfolio() {
  return (
    <ThemeProvider attribute="class">
      <div className="bg-white dark:bg-[#0a192f] min-h-screen text-[#0a192f] dark:text-slate-400 relative">
        <Navbar />
        {/* Fixed Social Sidebar */}
        <div className="fixed left-10 bottom-0 hidden md:block">
          <div className="flex flex-col items-center gap-6">
            <Link
              href="https://github.com/ahmed-fz11"
              className="text-[#0a192f] dark:text-slate-400 hover:text-[#64ffda] dark:hover:text-[#64ffda] transform hover:-translate-y-1 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0c-2.73-1.83-3.91-1.48-3.91-1.48A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </Link>
            <Link
              href="https://www.linkedin.com/in/ahmadfarazdeveloper/"
              className="text-[#0a192f] dark:text-slate-400 hover:text-[#64ffda] dark:hover:text-[#64ffda] transform hover:-translate-y-1 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </Link>
            <Link
              href="mailto:ahmedd.fz11@gmail.com"
              className="text-[#0a192f] dark:text-slate-400 hover:text-[#64ffda] dark:hover:text-[#64ffda] transform hover:-translate-y-1 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </Link>
            <div className="h-24 w-[1px] bg-[#0a192f] dark:bg-slate-400 mt-4"></div>
          </div>
        </div>

        {/* Fixed Email Sidebar */}
        <div className="fixed right-10 bottom-0 hidden md:block">
          <div className="flex flex-col items-center gap-6">
            <Link
              href="mailto:ahmedd.fz11@gmail.com"
              className="vertical-text text-[#0a192f] dark:text-slate-400 hover:text-[#64ffda] dark:hover:text-[#64ffda] transform hover:-translate-y-1 transition-all"
              style={{ writingMode: "vertical-rl" }}
            >
              ahmedd.fz11@gmail.com
            </Link>
            <div className="h-24 w-[1px] bg-[#0a192f] dark:bg-slate-400 mt-4"></div>
          </div>
        </div>

        <PortfolioContent />
      </div>
    </ThemeProvider>
  )
}

