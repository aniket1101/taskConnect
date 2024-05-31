import { useState } from 'react';
import './createTask.css'

import { api } from '../../App';

function CreateTask({ update }) {
  const [title, changeTitle] = useState("");
  const [desc, changeDesc] = useState("");
  return (
    <div className="RightPanel" id="TaskRightPanel">
      <h1 className="CreateTaskTitle">
        Create a New Task
      </h1>

      <form>
        <div className="RightPanelElement">
          <label className="FieldLabel">
            Title:
          </label>
          <input
            style={{ padding: '5px' }}
            type="text"
            className="form-control"
            id="TaskTitleField"
            placeholder="what do you need?"
            onChange={() => { changeTitle(document.getElementById('TaskTitleField').value) }}
          />
        </div>
        <div className="RightPanelElement">
          <label className="FieldLabel">
            Description:
          </label>
          <textarea className="DescriptionTextArea"
            placeholder="tell us a little more..."
            id='taskTextArea'
            onChange={() => { changeDesc(document.getElementById('taskTextArea').value) }}
          />
        </div>
        {/* <div className="RightPanelElement">
          <label className="FieldLabel">
            Task Location:
          </label>
        </div> */}
        <button
          type='button'
          className="PostButton"
          onClick={() => {
            api.post("create-task", {
              title: title,
              description: desc
            }).catch(err => console.log(err));
            update();
            return false;
          }}
        >
          Post
        </button>
      </form>
    </div>
  );
}

export default CreateTask;