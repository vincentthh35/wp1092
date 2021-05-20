function Form ({setName, setSubject, setScore, handleAdd, handleQuery}) {

  return (
    <>
    <div className='inputBar-wrapper'>
        <span className='add-input'>
            <label for="name"></label>
            <input
              type="text"
              id="name"
              onChange={setName}
              placeholder="Enter Name to Add or to Query" />
        </span>
        <span className='add-input'>
            <label for="subject"></label>
            <input
              type="text"
              id="subject"
              onChange={setSubject}
              placeholder="Enter Subject to Add or to Query" />
        </span>
        <span className='add-input'>
            <label for="score"></label>
            <input
              type="text"
              id="score"
              onChange={setScore}
              placeholder="Enter Score to Add or to Query" />
        </span>
    </div>
    <div className='buttonBar-wrapper'>
        <span className='button' onClick={handleAdd}>
            Add
        </span>
        <span className='button' onClick={handleQuery}>
            Query
        </span>
    </div>
    </>
  );
};

export default Form;
