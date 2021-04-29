const getTimeString = () => {
    let d = new Date();
    let ret = `${d.toISOString().split('T')[0]} ${d.toTimeString().split(' ')[0].replaceAll(':', '-')}`;
    return ret;
}

export default getTimeString;
