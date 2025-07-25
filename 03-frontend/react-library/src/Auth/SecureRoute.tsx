import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface SecureRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const SecureRoute: React.FC<SecureRouteProps> = ({ component: Component, ...rest }) => {
  const { isLoggedIn } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }, // 👈 store intended path
            }}
          />
        )
      }
    />
  );
};

export default SecureRoute;
