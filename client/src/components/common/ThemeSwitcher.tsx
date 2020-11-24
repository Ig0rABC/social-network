import React, { FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme } from "../../redux/selectors/app";
import { Theme } from "../../types/app";
import { actions } from "../../redux/reducers/app";
import { FormattedMessage } from "react-intl";

const ThemeSwitcher: React.FC = () => {

  const dispatch = useDispatch();

  const theme = useSelector(selectTheme);

  const onChange = (event: FormEvent<HTMLSelectElement>): void => {
    dispatch(actions.switchTheme(event.currentTarget.value as Theme));
  }

  return <select onChange={onChange} value={theme}>
    <FormattedMessage id="light" key="light">
      {(message) => <option value="light">{message}</option>}
    </FormattedMessage>
    <FormattedMessage id="dark" key="dark">
      {(message) => <option value="dark">{message}</option>}
    </FormattedMessage>
  </select>
}

export default ThemeSwitcher;