import { SidebarTrigger } from "../ui/sidebar";

const Header = () => {
  return (
    <header className="flex h-16 w-full items-center border-b border-gray-200 px-4 sticky top-0 bg-white z-10">
      <div className="flex items-center h-full">
        <SidebarTrigger className="flex items-center justify-center h-10 w-10 rounded-md hover:bg-gray-100 transition-colors" />
      </div>
      <div className="ml-4 flex-1">
        <div className=" flex items-center justify-end">
          <a
            href="https://www.desible.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-orange-500 hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="18"
              viewBox="0 0 13 18"
              fill="none"
            >
              <path
                d="M5.11436 17.0839H0.842899L0.842897 16.8474C5.17691 16.8474 8.69032 13.334 8.69032 8.99998C8.69032 4.66597 5.17691 1.15256 0.842897 1.15256L0.842899 0.916016H5.11436C5.38576 0.916016 5.6517 0.927505 5.91218 0.950485C8.58137 2.63498 10.3544 5.61042 10.3544 8.99998C10.3544 12.3898 8.5811 15.3654 5.91156 17.0499C5.65128 17.0726 5.38554 17.0839 5.11436 17.0839Z"
                fill="#FF4F01"
              />
              <path
                d="M5.87483 8.99997C5.87483 11.779 3.62196 14.0319 0.842897 14.0319V15.8651C4.63442 15.8651 7.70806 12.7915 7.70806 8.99998C7.70806 5.20845 4.63442 2.13482 0.842897 2.13482V3.96804C3.62196 3.96804 5.87483 6.22091 5.87483 8.99997Z"
                fill="#FF4F01"
              />
              <path
                d="M3.40498 8.99998C3.40498 10.415 2.2579 11.5621 0.842896 11.5621L0.842897 13.0497C3.07947 13.0497 4.89258 11.2365 4.89258 8.99997C4.89258 6.7634 3.07947 4.95029 0.842897 4.95029L0.842896 6.43789C2.2579 6.43789 3.40498 7.58498 3.40498 8.99998Z"
                fill="#FF4F01"
              />
              <path
                d="M2.42272 8.99998C2.42272 9.87249 1.71541 10.5798 0.842896 10.5798V7.42015C1.71541 7.42015 2.42272 8.12746 2.42272 8.99998Z"
                fill="#FF4F01"
              />
              <path
                d="M10.7038 3.24882C12.2128 4.78862 12.9673 6.70567 12.9673 8.99998C12.9673 11.2943 12.2128 13.219 10.7038 14.7742C9.95218 15.5491 9.10693 16.1291 8.16808 16.514C10.1228 14.6081 11.3366 11.9458 11.3366 8.99998C11.3366 6.05929 10.127 3.40111 8.17824 1.49587C9.11303 1.88467 9.95489 2.46898 10.7038 3.24882Z"
                fill="#FF4F01"
              />
            </svg>
            <span className="font-medium">powered by Desible AI</span>
          </a>
        </div >
      </div>
    </header>
  );
};

export default Header;