import { CgTrashEmpty } from "react-icons/cg";
import { GiSpeaker } from "react-icons/gi";
import { useSpeechSynthesis } from "react-speech-kit";
import TimeAgo from "react-timeago";
import { SERVER_URI, USER_KEY } from "../../constants";
import storage from "../../utils/storage";

export default function MessageItem({ message, removeMessage }) {
  // извлекаем данные пользователя из локального хранилища
  const user = storage.get(USER_KEY);
  // утилиты для перевода текста в речь
  const { speak, voices } = useSpeechSynthesis();
  // определяем язык приложения
  const lang = document.documentElement.lang || "en";
  // мне нравится голос от гугла
  const voice = voices.find(
    (v) => v.lang.includes(lang) && v.name.includes("Google")
  );

  // элемент для рендеринга зависит от типа сообщения
  let element;

  // извлекаем из сообщения тип и текст или путь к файлу
  const { messageType, textOrPathToFile } = message;

  // формируем абсолютный путь к файлу
  const pathToFile = `${SERVER_URI}/files${textOrPathToFile}`;

  // определяем элемент для рендеринга на основе типа сообщения
  switch (messageType) {
    case "text":
      element = <p>{textOrPathToFile}</p>;
      break;
    case "image":
      element = <img src={pathToFile} alt="" />;
      break;
    case "audio":
      element = <audio src={pathToFile} controls></audio>;
      break;
    case "video":
      element = <video src={pathToFile} controls></video>;
      break;
    default:
      return null;
  }

  // определяем принадлежность сообщения текущему пользователю
  const isMyMessage = user.userId === message.userId;

  return (
    <li className={`item message ${isMyMessage ? "my" : ""}`}>
      <div className="item__top">
        <p className="username">{isMyMessage ? "Me" : message.userName}</p>
        <p className="datetime">
          <TimeAgo date={message.createdAt} />
        </p>
      </div>
      <div className="inner">{element}</div>
      <div className="df jcfe">
        {isMyMessage && (
          <button className="remove-btn" onClick={() => removeMessage(message)}>
            <CgTrashEmpty className="icon remove" />
          </button>
        )}
      </div>
    </li>
  );
}
