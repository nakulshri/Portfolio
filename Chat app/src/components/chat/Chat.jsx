import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { db } from "../../lib/firebase";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";

const Chat = () => {
    const [chat, setChat] = useState(false);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [image, setImage] = useState({
        file: null,
        url: "",
    });

    const handleImg = (e) => {
        if (e.target.files[0]) {
            setImage({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    const { chatId, user,isCurrentUserBlocked,isReceiverBlocked } = useChatStore();
    const { currentUser } = useUserStore();

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data());
        });

        return () => {
            unSub();
        };
    }, [chatId]);

    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    };

    const handleSend = async () => {
        if (text === "") return;

        let imgUrl = null;

        try {
            if (image.file) {
                imgUrl = await upload(image.file);
            }
            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && { img: imgUrl }),
                }),
            });

            const userIds = [currentUser.id, user.id];

            userIds.forEach(async (id) => {
                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();
                    const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);

                    userChatsData.chats[chatIndex].lastMessage = text;
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    });
                }
            });
        } catch (err) {
            console.log(err);
        }

        setImage({
            file: null,
            url: "",
        });
        setText("");
    };

    return (
        <div className="Chat">
            <div className="top">
                <div className="user">
                    <img src={user?.avatar||"./avatar.png"} alt="" />
                    <div className="texts">
                        <span>{user?.username}</span>
                        <p>Not the sharpest tool in the shed</p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>

            <div className="center">
                {chat?.messages?.map((message) => (
                    <div className={message.senderId === currentUser?.id ? "message own": "message"} key={message?.createdAt}>
                        <div className="texts">
                            {message.img && <img src={message.img} alt="" />}
                            <p>{message.text}</p>
                            {/* <span>
                                1 min ago
                            </span> */}
                        </div>
                    </div>
                ))}
                {image.url && <div className="message own">
                    <div className="texts">
                        <img src={image.url} alt="" />
                    </div>
                </div>}
                <div ref={endRef}></div>
            </div>

            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file">
                        <img src="./img.png" alt="" />
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input type="text" 
                placeholder={(isCurrentUserBlocked || isReceiverBlocked)? "you can not send a message":"Type a message..."} 
                onChange={(e) => setText(e.target.value)} 
                value={text} 
                disabled={isCurrentUserBlocked || isReceiverBlocked} />
                <div className="emoji">
                    <img src="./emoji.png" alt="" onClick={() => setOpen((prev) => !prev)} />
                    {open && (
                        <div className="picker">
                            <EmojiPicker onEmojiClick={handleEmoji} />
                        </div>
                    )}
                </div>
                <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
