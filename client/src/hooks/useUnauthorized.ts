import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { selectIsAuthorized } from "../redux/selectors/users";

const useUnauthorized = () => {
  
  const history = useHistory();
  const isAuthorized = useSelector(selectIsAuthorized);

  useEffect(() => {
    if (!isAuthorized) {
      history.push("/login");
    }
  }, [isAuthorized])
}

export default useUnauthorized;