import en from "./languages/en.json";
import ru from "./languages/ru.json";
import { flatten } from "flat";

const flattenMessages = (messages: any) => {
  const newMessages: any = {};
  for (let language in messages) {
    newMessages[language] = flatten(messages[language]);
  }
  return newMessages;
}

export default flattenMessages({
  en, ru
});