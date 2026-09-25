import type { FC, ReactNode } from "react";
import Button from "./Button";

type PageTemplateProps = {
  heading: string;
  subheading?: string;
  message?: string;
  imgSrc?: string;
  imgAlt?: string;
  imgPosition?: "top" | "bottom";
  children?: ReactNode;
};

const imgPositions = {
  top: "object-top",
  bottom: "object-bottom",
};

const PageTemplate: FC<PageTemplateProps> = ({
  heading,
  subheading,
  message,
  imgSrc = "/imgs/error-boundary-image.webp",
  imgAlt = "A retro style robot toy stares with a fixed expression.",
  imgPosition = "top",
  children,
}) => {
  return (
    <section className="flex justify-center items-center flex-1 w-full">
      <div className="flex flex-col justify-center items-center landscape:flex-row landscape:h-full landscape:sm:h-[60vh] landscape:md:h-[80vh] landscape:lg:h-auto landscape:xl:flex-col max-w-3xl w-full [@media_(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:max-w-lg p-5 rounded-xl bg-gray-50 text-neutral-900 text-center text-balance text-2xl font-bold shadow-xl shadow-stone-900/30 portrait:m-8 portrait:sm:md-4 m-4">
        <div className="flex-col landscape:flex-1 landscape:justify-center">
          <h1 className="text-5xl landscape:text-5xl md:text-9xl [@media_(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:text-5xl text-gray-600 m-4">
            {heading}
          </h1>
          <h2 className="text-gray-500 text-base text-balance md:text-4xl landscape:text-xl landscape:flex-1">
            {subheading}
          </h2>
        </div>

        <div className="aspect-3/2 p-4 overflow-hidden landscape:m-0 flex-col landscape:flex-1">
          <img
            src={imgSrc}
            alt={imgAlt}
            className={`w-full h-full object-cover ${imgPositions[imgPosition]} rounded-sm shadow-media`}
          />
        </div>

        <div className="flex flex-col justify-center gap-4 landscape:justify-center landscape:flex-1 landscape:h-full">
          <p className="text-base landscape:text-base font-medium text-gray-700 text-balance">
            {message}
          </p>
          {children && (
            <div className="flex flex-col gap-4 text-base font-normal text-left">
              {children}
            </div>
          )}
          {/* Full reload, not navigate(): App's ErrorBoundary resetKey reads the
              global location, so an in-app navigation may not clear the error screen */}
          <Button
            variant="pageTemplate"
            dataKey="goToStore"
            onClick={() => (window.location.href = "/store")}
          />
        </div>
      </div>
    </section>
  );
};

export default PageTemplate;
