import PageTemplate from "../components/PageTemplate";

export const NotFound = () => {
  return (
    <PageTemplate
      heading="404 Page Not Found"
      subheading="That address doesn't match any page."
      message="Please visit the Store page."
    />
  );
};
