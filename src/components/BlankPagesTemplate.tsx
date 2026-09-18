import type { FC } from "react";
import Button from "./Button";

type BlankPagesTemplateProps = {
  heading?: string;
  subheading?: string;
  message?: string;
};

// Defaults describe a page that exists but has no content yet (Home, About).
// Pass all three to reuse the same layout for a different case, e.g. the 404 route.
const BlankPagesTemplate: FC<BlankPagesTemplateProps> = ({
  heading = "Coming Soon",
  subheading = "This page has no content at this time.",
  message = "Please visit the Store page.",
}) => {
  return (
    <>
      {/* Handles component display within page */}
      <section className="flex justify-center items-center h-screen w-screen bg-[url('/imgs/error-boundary-bg-image.svg')] bg-cover bg-center">
        {/* Handles content container */}
        <div className="flex flex-col justify-center items-center landscape:flex-row landscape:h-full landscape:sm:h-[60vh] landscape:md:h-[80vh] landscape:lg:h-auto landscape:xl:flex-col max-w-3xl w-full [@media_(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:max-w-lg p-5 rounded-xl bg-gray-50 text-neutral-900 text-center text-balance text-2xl font-bold portrait:m-8 portrait:sm:md-4 m-4">
          {/* Column 1 in landscape */}
          <div className="flex-col landscape:flex-1 landscape:justify-center">
            <h1 className="text-5xl landscape:text-5xl md:text-9xl [@media_(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:text-5xl text-gray-600 m-4">
              {heading}
            </h1>
            <h2 className="text-gray-500 text-base text-balance md:text-4xl landscape:text-xl landscape:flex-1">
              {subheading}
            </h2>
          </div>

          {/* Column 2 in landscape */}
          <div className="aspect-3/2 p-4 overflow-hidden mb-8 landscape:m-0 flex-col landscape:flex-1">
            <img
              src="/imgs/error-boundary-image.webp"
              alt="A retro style robot toy stares with a fixed expression."
              className="object-cover"
            />
          </div>

          {/* Column 3 in landscape */}
          <div className="flex flex-col justify-center mt-4 gap-4 landscape:justify-center landscape:flex-1 landscape:h-full landscape:mt-0">
            <p className="text-base landscape:text-base font-medium text-gray-700 text-balance">
              {message}
            </p>
            <Button
              variant="blankPages"
              dataKey="goToStore"
              onClick={() => (window.location.href = "/store")}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default BlankPagesTemplate;
