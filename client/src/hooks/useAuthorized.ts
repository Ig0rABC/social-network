import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { selectIsAuthorized } from "../redux/selectors/users";

const useAuthorized = () => {
  
  const history = useHistory();
  const isAuthorized = useSelector(selectIsAuthorized);

  useEffect(() => {
    if (isAuthorized) {
      history.push("/");
    }
  }, [isAuthorized])
}

export default useAuthorized;