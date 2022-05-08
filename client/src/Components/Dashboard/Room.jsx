function Room(props) {

  const handleCreateRoom = (e) => {
    e.preventDefault();
  };

  return (
    <div className="Room">
      Rooms:
      <ul></ul>
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
}

export default Room;
