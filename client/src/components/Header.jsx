import React from "react";
import Logo from "../../public/assets/k-logo-white.png";

const Header = () => {
  return (
    <div className="h-20 w-[100vw] flex items-center text-[32px] text-white justify-center bg-slate-800 z-0">
      <img className="m-2 w-[100px]" src={Logo} /> KORTANA
    </div>
  );
};

export default Header;
