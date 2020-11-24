import React, { FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLanguage } from "../../redux/selectors/app";
import { Language } from "../../types/app";
import { actions } from "../../redux/reducers/app";

const LanguageSwitcher: React.FC = () => {

  const dispatch = useDispatch();

  const language = useSelector(selectLanguage);

  const onChange = (event: FormEvent<HTMLSelectElement>): void => {
    dispatch(actions.switchLanguage(event.currentTarget.value as Language));
  }

  return <select onChange={onChange} value={language}>
    <option value="en">English</option>
    <option value="ru">Русский</option>
  </select>
}

export default LanguageSwitcher;