import Logo from "../assets/logo.png";


function NotFoundPage() {
  return (
    <>
      <div className="flex justify-center items-center w-full h-[100px] px-10 shadow-lg">
        <div className="w-[30%]">
          <img src={Logo} alt="logo" className="w-[150px] h-[70px]" />
        </div>
        <div className="w-[40%] flex justify-center items-start relative ">
            <div className="block">
              <div className="text-[20px] font-bold text-center"></div>
              <p className="text-[10px] font-500 text-[#5F5F5F] text-center"></p>
            </div>
        </div>
        <div className="w-[30%] flex justify-end items-center">
          
        </div>
      </div>
      <div className="w-full px-[10%] text-center mt-[200px]" >
        <h1 className="text-[30px] front-bold">404 Page not found!</h1>
        <h6>This group chat might be deleted or even not existed</h6>
      </div>
    </>
  );
}

export default NotFoundPage;
