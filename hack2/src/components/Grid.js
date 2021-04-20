export default function Grid ({ row, col, value, new_grid }) {

    let grid_id = `grid-${row}-${col}`;
    let value_id = `value-${row}-${col}`;
    let temp_class_name = 'grid';
    const mapping = {
        '':"", 2:"NCTU", 4:"NYMU", 8:"NTU", 16:"UCSD", 32:"UBC", 64:"CUHK",
        128:"UCLA", 256:"NYU",512:"UCB",1024:"HKUST", 2048:"UTokyo",
        4096:"Columbia", 8192:"Yale", 16384:"Cambridge", 32768:"Stanford", 65536:"MIT"
    };


    // #########################
    // # 1 #2 Modify everything here (including the above one) yourself
    // #########################

    if (value === 0) {
        value = "";
    } else {
        temp_class_name += ` level-${value}`;
    }

    for (let i = 0; i < new_grid.length; i++) {
        if (row === new_grid[i][0] && col === new_grid[i][1]) {
            temp_class_name += ' school-fade-in';
        }
    }

    return (
        <td>
            <div className={temp_class_name} id={grid_id}>
                <div className="school-name" id={value_id}>{mapping[value]}</div>
            </div>
        </td>
    );
}
