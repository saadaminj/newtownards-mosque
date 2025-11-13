import MosqueIcon from "../assets/mosque_icon";

const title = "Newtownards Islamic Cultural Centre";
const description = "Peace be upon you - As-Salamu Alaikum";
const Header = ({ time }) => {
  return (
    <header className="bg-emerald-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center mb-2">
            <MosqueIcon />
            <h1 className="text-4xl font-bold ml-4">{title}</h1>
          </div>
          <p className="text-center text-emerald-100 text-lg">{description}</p>
          <div className="text-center mt-4 text-emerald-100 font-mono text-xl">
            {time.toLocaleTimeString()}
          </div>
        </div>
    </header>
  );
};
export default Header;