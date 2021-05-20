import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TopBar from '../components/topBar';
import Form from '../components/form';
//import ButtonBar from '../components/buttonBar';
import ShowBox from '../components/showBox';

const instance = axios.create({
  baseURL: `http://localhost:5000/scoreCards`,
});

function ScoreCardDB() {
  //const [queryType, setQueryType] = useState('');
  //const [queryString, setQueryString] = useState('');
  const [queryResult, setQueryResult] = useState([]);
  const [showText, setShowText] = useState('');
  const [input, setInput] = useState({
      name: null,
      subject: null,
      score: null});

  const setName = e => {
    setInput({...input, name: e.target.value.toLowerCase()});
    console.log(input)
  }
  const setSubject = e => {
    setInput({...input, subject: e.target.value.toLowerCase()});
    console.log(input)
  }
  const setScore = e => {
    setInput({...input, score: e.target.value});
    console.log(input)
  }
  const initInputState = () => {
    setInput({
        name: null,
        subject: null,
        score: null});
  }
  const initOutputState = () => {
    setShowText('');
    setQueryResult([]);
  }

  const capitalizeFst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }


  const handleClear = async (e) => {
    initOutputState();
    console.log('clear');
    try {
      await instance.delete('/')
      .then(res => {
        //console.log(res.data);
        if (res.status === 200) {
          setShowText('Database cleared!');
        }
      })
    }
    catch (error) {
      if (error.response) {
        // Request made and server responded
        console.log('Request made and server responded');
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log('The request was made but no response was received');
        console.log(error.request);
      }
    }
  }

  const handleAdd = async (e) => {
    initOutputState();
    console.log('add');
    document.getElementById('name').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('score').value = '';
    //console.log(input)
    if (input.name === '' || input.subject === '' || input.score === '') {
      setShowText('Name, subject, score are all required in order to add.')
    }
    else {
      //add to database
      try {
        await instance.post('/add', input)
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            setShowText('Updating (' + capitalizeFst(input.name) + ', ' + capitalizeFst(input.subject) + ', ' + input.score + ')');
          }
          else if (res.status === 210) {
            setShowText('Adding (' + capitalizeFst(input.name) + ', ' + capitalizeFst(input.subject) + ', ' + input.score + ')');
          }
        })
      }
      catch (error) {
        if (error.response) {
          // Request made and server responded
          console.log('Request made and server responded');
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('The request was made but no response was received');
          console.log(error.request);
        }
      }
    }
    initInputState();
  }

  const handleQuery = async (e) => {
    initOutputState();
    console.log('query');
    console.log(input);
    let params = Object.fromEntries(Object.entries(input).filter(([_, v]) => v != null));
    //const params = {...input}; //need to parse
    document.getElementById('name').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('score').value = '';
    console.log(params)
    try {
      await instance.get('/', {params: params})
      .then(res => {
        console.log(res);
        if (res.status === 200) { //found sth
          console.log('found sth');
          setShowText('Name_______Subject_______Score')
          res.data.sort(function(a, b) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            if (a.subject < b.subject) {
              return -1;
            }
            if (a.subject > b.subject) {
              return 1;
            }
            return 0;
          })

          for (var i = 0; i < res.data.length; i++) {
            const line = {...res.data[i]}
            console.log(line)
            const nameSpace = 11 - line.name.length;
            const subjectSpace = 14 - line.subject.length;
            const newLine = capitalizeFst(line.name) + '_'.repeat(nameSpace) + capitalizeFst(line.subject) + '_'.repeat(subjectSpace) + line.score;
            //console.log(newLine)
            setQueryResult(queryResult => [...queryResult, newLine])
          }
        }
        else if (res.status === 230) { //cannot find
          console.log('cannot find')
          setShowText('Target: ' + res.data + 'not found')
        }
      })
    }
    catch (error) {
      if (error.response) {
        // Request made and server responded
        console.log('Request made and server responded');
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log('The request was made but no response was received');
        console.log(error.request);
      }
    }
    initInputState();
  }

  return (
    <div className='scoreCardDB'>
        <TopBar handleClear={handleClear}/>
        <Form setName={setName} setSubject={setSubject} setScore={setScore} handleAdd={handleAdd} handleQuery={handleQuery}/>
        <ShowBox showText={showText} queryResult={queryResult}/>
    </div>
  );
}

export default ScoreCardDB;
