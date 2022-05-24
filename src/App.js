import axios from "axios";
import React from "react";
import Modal from "react-modal/lib/components/Modal";
import "./App.css";

function App() {
  const [todo, setTodo] = React.useState({ todo: "" });
  const [todoFromAPI, setTodoFromAPI] = React.useState();
  const [temp, setTemp] = React.useState();
  const [showModal, setShowModal] = React.useState(false);
  const [item, setItem] = React.useState({});
  const textAreaChanged = (e) => setTodo({ ...todo, todo: e.target.value });
  const addNewTodo = async () => {
    setTodo({ todo: "" });
    await axios.post("https://6285fd666b6c317d5ba7886d.endapi.io/todo", todo);
  };
  React.useEffect(() => {
    const dataReader = async () => {
      const res = await axios.get(
        "https://6285fd666b6c317d5ba7886d.endapi.io/todo"
      );
      setTodoFromAPI(res.data.data);
    };

    dataReader();
  }, [todoFromAPI]);

  const editHandler = (item) => {
    setItem(item);
    setShowModal(true);
    setTemp(item.todo);
  };

  const closeModal = () => setShowModal(false);

  const deleteHandler = async (item) => {
    await axios.delete(
      `https://6285fd666b6c317d5ba7886d.endapi.io/todo/${item.id}`
    );
  };

  const userUpdateHandler = async () => {
    await axios.put(
      `https://6285fd666b6c317d5ba7886d.endapi.io/todo/${item.id}`,
      { id: item.id, todo: temp }
    );
    setTemp({});
    closeModal();
  };

  const doneTodoHandler = (e) => {
    if (e.target.checked) {
      e.target.parentElement.querySelector("#todo").style.textDecoration =
        "line-through";
      e.target.parentElement.querySelector("#edit").disabled = true;
      e.target.parentElement.querySelector("#remove").disabled = true;
    } else {
      e.target.parentElement.querySelector("#todo").style.textDecoration =
        "none";
      e.target.parentElement.querySelector("#edit").disabled = false;
      e.target.parentElement.querySelector("#remove").disabled = false;
    }
  };

  return (
    <div className='App'>
      <textarea onChange={textAreaChanged} value={todo.todo} />
      <button onClick={addNewTodo}>add</button>
      {editHandler}
      <h1>todo list</h1>
      {todoFromAPI
        ? todoFromAPI.map((item) => (
            <div>
              <span id='todo'>{item.todo}</span>
              <input type='checkbox' onChange={doneTodoHandler} />
              <button id='edit' onClick={() => editHandler(item)}>
                Edit
              </button>
              <button id='remove' onClick={() => deleteHandler(item)}>
                Remove
              </button>
            </div>
          ))
        : null}

      <Modal isOpen={showModal} onRequestClose={closeModal}>
        <div>
          <button onClick={closeModal}>Close</button>
          <textarea value={temp} onChange={(e) => setTemp(e.target.value)} />
          <button onClick={userUpdateHandler}>Update</button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
