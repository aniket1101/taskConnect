import React, { BaseSyntheticEvent, FormEventHandler, ReactNode, useState } from "react";

import './WorkerSignUp.css'
import '../login/Login.css'
import { api } from "../App.tsx";
import { useNavigate } from "react-router-dom";

export default function WorkerSignUp({ setUserData, setTasker }) {
  const [stage, setStage] = useState(0);
  const navigate = useNavigate();

  const basicForm = {
    forename: '',
    surname: '',
    email: ''
  }
  const [basicFormData, setBasicFormData] = useState(basicForm);
  const submitBasic = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setBasicFormData({
      forename: e.target[0].value,
      surname: e.target[1].value,
      email: e.target[2].value
    })
    e.target.reset();
    changeStage(1);
  }

  const [password, setPassword] = useState('');
  const [passwordErr, setPassErr] = useState(false);
  const submitSecurity = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    if (e.target[0].value !== e.target[1].value) {
      setPassErr(true);
      return false;
    }
    setPassErr(false);
    e.target.reset();
    setPassword(e.target[0].value);
    changeStage(1);
    return true;
  }

  const [postcodeErr, setPostcodeErr] = useState(false);
  const [personalData, setPersonalData] = useState({ post_code: '', headline: '' });
  const submitPersonal = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setPersonalData({
      post_code: e.target[0].value,
      headline: e.target[1].value
    })
    e.target.reset();
    changeStage(1);
  }

  interface Expertise {
    title: string,
    description: string,
    id: number
  }
  const emptyExpertise: Expertise[] = [];
  const [id, setId] = useState(0);
  const [expertiseList, setExpertiseList] = useState(emptyExpertise);
  const submitExpertise = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const retval = [new Array(expertiseList.length)].map((item, index) => ({ title: e.target[2 * index].value, description: e.target[2 * index + 1].value, id: index }));
    setExpertiseList(retval);

    const data = {
      expertise: retval,
      ...personalData,
      password: password,
      ...basicFormData
    }

    api.post('create-tasker', data)
      .then(resp => {
        switch (resp.status) {
          case 404: // Handle invalid requests
            setPostcodeErr(true);
            break;
          default:
            setUserData(resp.data.user);
            setTasker(resp.data.id);
            navigate('/home');
            break;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const newExpertise = () => {
    const uid = id;
    setId(prev => prev + 1);
    setExpertiseList(prev => [...prev, { title: '', description: '', id: uid }])
  }

  interface StageData {
    children: ReactNode,
    submit: FormEventHandler
  }

  const stageData: StageData[] = [
    {
      children: (
        <div>
          <div className="InputBox" style={{}}>
            <input type="text" name="forename" placeholder='Forename...' defaultValue={basicForm.forename} minLength={1} maxLength={20} required />
            <i className="bi-person-fill"></i>
          </div>
          <div className="InputBox" style={{}}>
            <input type="text" name="surname" placeholder='Surname...' defaultValue={basicForm.surname} minLength={1} maxLength={20} required />
            <i className="bi-person-fill" ></i>
          </div>
          <div className="InputBox" style={{}}>
            <input type="email" name="email" placeholder='Email address...' defaultValue={basicForm.email} maxLength={20} required />
            <i className="bi-at" ></i>
          </div>
        </div>),
      submit: submitBasic
    },
    {
      children: (
        <div>
          <div className="InputBox" >
            <input type="password" style={passwordErr ? { border: '2px solid var(--red)' } : {}} name="password" defaultValue={password} placeholder='Create Password...' minLength={2} maxLength={20} required />
            <i className="bi-lock-fill" ></i>
          </div>
          <div className="InputBox" >
            <input type="password" style={passwordErr ? { border: '2px solid var(--red)' } : {}} name="passcheck" defaultValue={password} placeholder='Repeat Password...' minLength={1} maxLength={20} required />
            <i className="bi-lock-fill" ></i>
          </div>
          {passwordErr && <p style={{ color: 'var(--red)' }}>Passwords Must Match!</p>}
        </div>),
      submit: submitSecurity
    },
    {
      children: <div>
        <div className="InputBox">
          <input type="text" style={postcodeErr ? { border: '2px solid var(--red)' } : {}} maxLength={20} defaultValue={personalData.post_code} placeholder="Your Postcode / Zip code..." minLength={4} required />
          <i className="bi-house-door-fill SignUpIcon"></i>
        </div>
        <div className="InputBox">
          {postcodeErr && <p style={{ color: 'var(--red)' }}>Invalid Postcode / Zip code</p>}
          <textarea className='DescriptionTextBoxSignUp' maxLength={1000} defaultValue={personalData.headline} rows={10} placeholder="A brief description of you (people will be able to see this on your profile)..." />
          <i className="bi-file-text-fill"></i>
        </div>
      </div>,
      submit: submitPersonal
    },
    {
      children: (
        <div>
          <p style={{ marginBlock: '10px', marginBottom: '20px' }}>Add past work experiences, expertise or hobbies here!</p>
          {expertiseList.map((item, index) => (
            <div key={item.id}>
              <i className="bi-x-octagon-fill"></i>
              <div className="InputBox">
                <input type="text" maxLength={30} defaultValue={item.description} minLength={5} placeholder="Title of your expertise..." required />
              </div>
              <div className="InputBox">
                <textarea className='DescriptionTextBox' rows={5} maxLength={100} defaultValue={item.title} minLength={10} placeholder="A brief description..." required />
              </div>
            </div>
          ))}
          <button type='button' onClick={newExpertise}>New Expertise</button>
        </div>
      ),
      submit: submitExpertise
    }
  ]

  const changeStage = (arg0: number) => {
    setStage(prev => prev + arg0);
  }

  return (<Container number={stage} max={stageData.length - 1} changeStage={changeStage} handleSubmit={stageData[stage].submit}>{stageData[stage].children}</Container>);
}

function Container({ number, max, changeStage, children, handleSubmit }) {
  return (
    <div className="PageWrapper">
      <form className="Wrapper" onSubmit={handleSubmit} id='sign-up-form'>
        <div className="PageIndicator">{number + 1} / {max + 1}</div>
        <h1>Sign Up</h1>
        {children}
        <div className="NavigationPanel">
          {number > 0 && <button type='button' className="NavigationButton" onClick={() => { document.getElementById('sign-up-form').reset(); changeStage(-1) }}>
            Back
          </button>}
          {number < max && <button type='submit' className="NavigationButton">
            Next
          </button>}
          {number === max && <button type='submit' className="NavigationButton">
            Submit
          </button>}
        </div>
      </form>
    </div >
  );
}