import Login from "./auth/login";
import Auth from "layouts/Auth";

const Index = () => {
  return (
    <>
      <Auth>
        <Login></Login>
      </Auth>
    </>
  );
};

export default Index;
