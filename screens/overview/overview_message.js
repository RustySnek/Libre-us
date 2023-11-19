import MessageContent from "../messages/message_content";

const OverviewMessage = ({ route }) => {
  const { message } = route.params;
  return <MessageContent message={message} />
}

export default OverviewMessage;
