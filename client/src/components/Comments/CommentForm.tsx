import React from "react";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { selectPendingPosts } from "../../redux/selectors/public";

export type CommentFormValues = {
  content: string
}

type Props = {
  onFinish: (values: CommentFormValues) => void,
  initialValues?: {
    content: string
  },
  extraElements?: JSX.Element[]
}

const CommentForm: React.FC<Props> = ({ onFinish, initialValues = { content: "" }, extraElements = [] }) => {

  const pending = useSelector(selectPendingPosts);

  return <div>COMMENT FORM</div>
}

export default CommentForm;