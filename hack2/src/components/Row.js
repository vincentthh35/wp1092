import Grid from '../components/Grid'
export default function Row ({ row, row_idx, new_grid }) {
    return (
        <tr>
            {row.map( (value, col_idx) => (<Grid key={`${row_idx}-${col_idx}`} row={row_idx} col={col_idx} value={row[col_idx]} new_grid={new_grid}/>) )}
        </tr>
    );
};
