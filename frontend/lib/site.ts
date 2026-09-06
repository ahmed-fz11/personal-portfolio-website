/**
 * Single source of truth for navigation, social links and the résumé path.
 * Shared by the desktop nav, the mobile overlay menu and the footer so the
 * three can never drift out of sync.
 */

export const RESUME_PATH = "/Ahmad_Faraz_Resume_Jul_2026.pdf";

export const NAV_ITEMS = [
  { id: "about", num: "01", label: "About" },
  { id: "experience", num: "02", label: "Experience" },
  { id: "work", num: "03", label: "Work" },
  { id: "contact", num: "04", label: "Contact" },
] as const;

export const SOCIALS = [
  {
    href: "https://github.com/ahmed-fz11",
    label: "GitHub profile",
    icon: "github",
  },
  {
    href: "https://www.linkedin.com/in/ahmadfarazdeveloper/",
    label: "LinkedIn profile",
    icon: "linkedin",
  },
  {
    href: "mailto:ahmedd.fz11@gmail.com",
    label: "Email Ahmad",
    icon: "mail",
  },
] as const;

export const EMAIL = "ahmedd.fz11@gmail.com";
