import logo from './logo.svg';
import { useState } from "react";
import './App.css';
import './styles.css';
import Button from "./components/Button";
import InputField from "./components/InputField";
import { clearDB, addDB, queryDB } from './axios';

function App() {
    const [log, setLog] = useState("");
    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");
    const [score, setScore] = useState("");
    const [query, setQuery] = useState("");
    const [queryMode, setQueryMode] = useState("");
    const [displayLog, setDisplayLog] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [sortingMode, setSortingMode] = useState("");
    const [canSort, setCanSort] = useState(false);

    // const appendLog = (newline) => {
    //     let old_log = log;
    //     old_log += newline + "\n";
    //     setLog(old_log);
    // }

    const updatePage = (i, new_log = undefined) => {
        let m = (new_log === undefined)
            ? log.split('\n').length - 1
            : new_log.split('\n').length - 1;
        if (new_log === undefined) {
            setDisplayLog(
                `(${m} row(s) of data in total. Currently displaying #${10*(i-1)+1} - #${Math.min(10*i, m)})\n\n` +
                log.split('\n').slice(10*(i-1), 10*(i)).join('\n')
            );
        } else {
            setDisplayLog(
                `(${m} row(s) of data in total. Currently displaying #${10*(i-1)+1} - #${Math.min(10*i, m)})\n\n` +
                new_log.split('\n').slice(10*(i-1), 10*(i)).join('\n')
            );
        }

        setCurrentPage(i);
    }

    const updateLog = (new_log) => {
        console.log(new_log);
        setLog(new_log);
        setCanSort(true);

        let line_number = new_log.split('\n').length - 1;
        console.log(new_log.split('\n').slice(0, 10).join('\n'));
        setMaxPage( Math.ceil(line_number / 10) );
        updatePage(1, new_log);
        // setDisplayLog(new_log.split('\n').slice(0, 10).join('\n'));
    }

    const isNumber = (s) => {
        let n = Math.floor(Number(s));
        return n !== Infinity && String(n) === s && n >= 0;
    }

    const oneLineLog = (l) => {
        setLog(l);
        setDisplayLog(l);
        setMaxPage(1);
        setCurrentPage(1);
        setCanSort(false);
    }

    const handleAdd = () => {
        if (!isNumber(score)) {
            oneLineLog('Invalid score!');
            return;
        }
        addDB(name, subject, score)
            .then(e => oneLineLog(e))
            .catch(e => oneLineLog(e));
    }

    const handleClear = () => {
        clearDB()
            .then(e => oneLineLog(e))
            .catch(e => oneLineLog(e));
    }

    const handleQuery = () => {
        queryDB(query, queryMode)
            .then(e => updateLog(e))
            .catch(e => oneLineLog(e));
    }

    const handlePrevious = () => {
        const c = currentPage;
        if (c === 1) {
            return;
        }
        updatePage(c - 1);
        setCurrentPage(c - 1);
    }

    const handleNext = () => {
        const c = currentPage;
        if (c === maxPage) {
            return;
        }
        updatePage(c + 1);
        setCurrentPage(c + 1);
    }

    const getName = (l) => {
        return l.split(', ')[0].split(' ')[1];
    }

    const getSubject = (l) => {
        return l.split(', ')[1].split(' ')[1];
    }

    const getScore = (l) => {
        return l.split(', ')[2].split(' ')[1];
    }

    const handleSort = () => {
        if (sortingMode === 'name') {
            let new_log = log.split('\n');
            if (new_log[new_log.length - 1] === '') new_log.pop();
            new_log.sort((a, b) => {
                if (getName(a) < getName(b)) return -1;
                if (getName(a) > getName(b)) return 1;
                return 0;
            });
            new_log = new_log.join('\n') + '\n';
            updateLog(new_log);
        } else if (sortingMode === 'subject') {
            let new_log = log.split('\n');
            if (new_log[new_log.length - 1] === '') new_log.pop();
            new_log.sort((a, b) => {
                if (getSubject(a) < getSubject(b)) return -1;
                if (getSubject(a) > getSubject(b)) return 1;
                return 0;
            });
            new_log = new_log.join('\n') + '\n';
            updateLog(new_log);
        } else if (sortingMode === 'score') {
            let new_log = log.split('\n');
            if (new_log[new_log.length - 1] === '') new_log.pop();
            new_log.sort((a, b) => {
                if (getScore(a) < getScore(b)) return -1;
                if (getScore(a) > getScore(b)) return 1;
                return 0;
            });
            new_log = new_log.join('\n') + '\n';
            updateLog(new_log);
        } else {
            return;
        }
    }

    let bottom_controller = "";
    if (maxPage > 1) {
        // more than 10 lines

        bottom_controller = (<>
            <br />
            <div className="flex-row">
                <Button buttonId="controller" buttonText="< previous" onClick={handlePrevious} disabled={currentPage === 1}/>
                <div>current page: {`${currentPage} / ${maxPage}`}</div>
                <Button buttonId="controller" buttonText='next >' onClick={handleNext} disabled={currentPage === maxPage}/>
            </div>
        </>)
    }

    return (
        <div className="App">
            <div className="window-container">
                <div className="panel-container">
                    {/* header row */}
                    <div className="flex-row" id="title-row">
                        <h1>ScoreCard DB</h1>
                        <Button
                            buttonId="clear"
                            buttonText="Clear"
                            onClick={handleClear}
                        />
                    </div>
                    <br/>

                    {/* add row */}
                    <div className="flex-row">
                        <div className="name-subject-score">
                            <InputField placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
                            <InputField placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)}/>
                            <InputField placeholder="Score" value={score} onChange={(e) => setScore(e.target.value)}/>
                        </div>
                        <Button buttonId="add" buttonText="Add" onClick={handleAdd} disabled={(!name || !subject || !score)}/>
                    </div>
                    <br/>

                    {/* query row */}
                    <div className="flex-row">
                        <div className="name-subject-score">
                            <div onChange={(e) => {setQueryMode(e.target.value)}}>
                                <input type="radio" name="mode" value="name" />Name
                                <input type="radio" name="mode" value="subject" />Subject
                            </div>
                            <InputField placeholder="Query string" id="query-input" onChange={(e) => setQuery(e.target.value)}/>
                        </div>
                        <Button buttonId="query" buttonText="Query" onClick={handleQuery} disabled={(!query || !queryMode)}/>
                    </div>
                    <br/>

                    {/*  sorting feature */}
                    <div className="flex-row">
                        <div className="name-subject-score">
                            Sort by:
                            <div onChange={(e) => setSortingMode(e.target.value)} className="radio-group">
                                <div><input type="radio" name="sorting_mode" value="name" /> name</div>
                                <div><input type="radio" name="sorting_mode" value="subject" /> subject</div>
                                <div><input type="radio" name="sorting_mode" value="score" /> score</div>
                            </div>
                        </div>
                        <Button buttonId="sort" buttonText="Sort" onClick={handleSort} disabled={(!sortingMode || log === "" || !canSort)} />
                    </div>
                    <br/>

                    {/* log section */}
                    <div className="log-section">
                        <textarea readOnly value={displayLog}>
                        </textarea>
                    </div>

                    {/* bottomm controller button */}
                    { bottom_controller }
                </div>
            </div>
        </div>
    );
}

export default App;
