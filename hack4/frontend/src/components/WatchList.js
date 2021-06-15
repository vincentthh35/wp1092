import constants from '../constants';
// Look at this file and see how the watchList is strucutred
import { STATSCOUNT_QUERY, PEOPLE_SUBSCRIPTION } from '../graphql';
import { useQuery } from '@apollo/react-hooks';
import { useEffect } from 'react';

export default function WatchList() {

    // TODO
    // query countStats
    // save the result in a counts variable
    const {
        loading,
        error,
        data: counts,
        subscribeToMore,
    } = useQuery(STATSCOUNT_QUERY, { variables: { severity: 1, locationKeywords: constants.watchList } });

    const parseSub = (newPeople, locationKeywords, severity=1) => {
        let ret = [];
        // const collections = db.people;
        locationKeywords.forEach((keyword) => {
            const result = newPeople.filter((p) => {
                if (severity) {
                    return (p.severity >= severity &&
                            p.location.description.includes(keyword));
                } else {
                    return p.location.description.includes(keyword);
                }
            });
            ret.push(result.length);
        });
        return { statsCount: ret };
    };

    useEffect(() => {
        try {
            subscribeToMore({
                document: PEOPLE_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData) return prev;
                    const newPeople = subscriptionData.data.people;
                    return parseSub(newPeople, constants.watchList);
                },
            })
        } catch (e) {
            console.error(e);
        }
    }, [subscribeToMore]);

    if (loading) {
        return (<h2>Loading...</h2>);
    }
    if (error) {
        return (<h2>Error...</h2>);
    }

    // DO NOT MODIFY BELOW THIS LINE
    return (
        <table>
        <tbody>
            <tr>
                <th>Keyword</th>
                <th>Count</th>
            </tr>
            {
                constants.watchList.map(
                    (keyword, idx) =>
                    <tr key={keyword}>
                        <td>{keyword}</td>
                        {/* You might need to see this */}
                        <td id={`count-${idx}`}>{!counts || ! counts.statsCount || counts.statsCount[idx]}</td>
                    </tr>
                )
            }
        </tbody>
        </table>
    );
}
