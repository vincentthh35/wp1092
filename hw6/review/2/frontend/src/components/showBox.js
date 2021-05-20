import React, {useState, useEffect} from 'react';
import ReactPaginate from 'react-paginate';
import Text from './text'

function ShowBox ({showText, queryResult}) {
  const [pageNum, setPageNum] = useState(0);

  const linesPerPage = 5;
  const pagesVisited = pageNum * linesPerPage;

  const showResult = queryResult
      .slice(pagesVisited, pagesVisited + linesPerPage)
      .map(line => {
        return (<Text text={line} />);
      });

  const pageCnt = Math.ceil(queryResult.length / linesPerPage);
  const changePage = ({selected}) => {
    setPageNum(selected);
  };

  return (
    <div className='showBox-text'>
        <Text text={showText} />
          <div>
            {showResult}
          </div>
        {
          queryResult.length < 5?
          null:
           (
              <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={pageCnt}
              onPageChange={changePage}
              containerClassName={"pagination-buttons"}
              pageClassName={'page-button'}
              previousClassName={'next-button'}
              nextClassName={'next-button'}
              disabledClassName={"pagination-disabled"}
              />
          )
        }
    </div>
  );
};

export default ShowBox;
