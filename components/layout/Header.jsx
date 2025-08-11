import { SidebarTrigger } from "../ui/sidebar";

const Header = () => {
  return (
    <header className="flex h-16 w-full items-center border-b border-gray-200 px-4 sticky top-0 bg-white z-10">
      <div className="flex items-center h-full">
        <SidebarTrigger className="flex items-center justify-center h-10 w-10 rounded-md hover:bg-gray-100 transition-colors" />
      </div>
    </header>
  );
};

export default Header;