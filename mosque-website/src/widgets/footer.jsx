const title = "Newtownards Islamic Cultural Centre";
const description1 = "Serving the community with faith and compassion";
const description2 = "© 2024 Newtownards Islamic Cultural Centre. All rights reserved.";

const Footer = () => {
  return (
      <footer className="bg-emerald-800 text-white mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-2">{title}</p>
          <p className="text-emerald-200">{description1}</p>
          <p className="text-emerald-300 mt-4 text-sm">
            {description2}
          </p>
        </div>
      </footer>
  );
};

export default Footer;