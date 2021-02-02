import React from "react";
import { useSelector } from "react-redux";
import { selectPendingPosts } from "../../redux/selectors/public";

export type ReplyFormValues = {
  content: string
}

type Props = {
  onFinish: (values: ReplyFormValues) => void,
  initialValues?: ReplyFormValues,
  extraElements?: JSX.Element[]
}

const ReplyForm: React.FC<Props> = ({ onFinish, initialValues = { content: "" }, extraElements = [] }) => {

  const pending = useSelector(selectPendingPosts);

  return <div>
    REPLY FORM
  </div>
}

export default ReplyForm;