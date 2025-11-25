import Strings from '../utils/Strings.json';

const pageStrings = Strings["footer"];
const Footer = () => {
  return (
      <footer className="bg-emerald-800 text-white mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-2">{pageStrings.title}</p>
          <p className="text-emerald-200">{pageStrings.description1}</p>
          <p className="text-emerald-300 mt-4 text-sm">
            {pageStrings.description2}
          </p>
        </div>
      </footer>
  );
};

export default Footer;