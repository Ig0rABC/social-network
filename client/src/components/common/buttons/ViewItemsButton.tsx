import React from "react";
import IconCount from "../IconCount";
import { CommentOutlined } from '@ant-design/icons';

type Props = {
  itemsCount: number,
  onClick: () => void,
  itemsName: "comments" | "replies"
}

const ViewItemsButton: React.FC<Props> = ({ itemsCount, onClick, itemsName }) => {
  return <IconCount
    icon={CommentOutlined}
    count={itemsCount}
    onClick={onClick}
    messageId={"buttons.view-" + itemsName}
    defaultMessage={"view " + itemsName}
  />
}

export default ViewItemsButton;