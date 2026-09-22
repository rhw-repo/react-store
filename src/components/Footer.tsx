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

  return (
    <footer className="font-body sticky bottom-0 z-30 flex justify-center items-center bg-stone-500 shadow-bar-inverted w-full">
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
