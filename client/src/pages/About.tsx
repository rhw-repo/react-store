import PageTemplate from "../components/PageTemplate";
import { aboutParagraphs } from "../content/about";

export const About = () => {
  return (
    <PageTemplate
      heading="About Us"
      subheading="Natural skin care, thoughtfully chosen."
      imgSrc="/imgs/about_hero.webp"
      imgAlt="Store with wooden shelves lined with glass bottles of oils, white candles and trailing green plants."
    >
      {aboutParagraphs.map((paragraph) => (
        <p key={paragraph} className="text-justify">
          {paragraph}
        </p>
      ))}
      <p className="border-t border-stone-300 pt-4 text-sm text-gray-700">
        This is a demo store: products and prices are for illustration only.
      </p>
    </PageTemplate>
  );
};
