import { useState  } from "react";

function Friend() {
  const [addFriendField, setAddFriendField] = useState("");

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (addFriendField === "") return;
  };
  return (
    <div className="Friends">
      Find your friends here :<ul></ul>
      <div>
        Add a Friend:
        <input
          type="text"
          placeholder="Add a friend..."
          onChange={(e) => {
            setAddFriendField(e.target.value);
          }}
        />
        <button onClick={handleAddFriend}>Add</button>
      </div>
    </div>
  );
}

export default Friend;
