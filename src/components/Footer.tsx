import { type FC } from "react";

interface FooterLink {
  label: string;
  href: string;
}

export const Footer: FC = () => {
  const links: FooterLink[] = [
    {
      label: "Project Repo",
      href: "https://github.com/rhw-repo/tailwind_project",
    },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ruth-westnidge/" },
    { label: "GitHub", href: "https://github.com/rhw-repo" },
  ];

  // The footer's shadow needs a negative y-offset: the built-in shadow-* utilities
  // cast downward, so on a bottom bar they fall off the page instead of separating
  // it from the content above. Colour is stone-900 at 40%, matching the Navbar tint.
  return (
    <footer className="font-body sticky bottom-0 z-30 flex justify-center items-center bg-stone-500 shadow-[0_-6px_16px_-4px_#1c191766] w-screen">
      <section className="max-w-5xl p-4 text-gray-600 text-sm md:text-base lg:text-xl">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm text-neutral-50 hover:text-neutral-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 rounded:sm active:text-purple-950 p-2 lg:px-8"
          >
            {link.label}
          </a>
        ))}
      </section>
    </footer>
  );
};
