export default function TopBar ({handleClear}) {

    return (
        <div className='topBar-wrapper'>
            <span className='title'>
                ScoreCard Database
            </span>
            <span className='button' onClick={handleClear}>
                Clear
            </span>
        </div>
    );
};
