const Query = {
    statsCount(parent, { severity, locationKeywords }, { db }, info) {
        // console.log(severity);
        // console.log(locationKeywords);
        // console.log(db.people);
        if (!db || !db.people || db.people === null) {
            console.error('DB error!');
            return null;
        }
        if (!locationKeywords) {
            console.log('locationKeywords is required in statsCount!');
            return null;
        }
        try {
            let ret = [];
            const collections = db.people;
            locationKeywords.forEach((keyword) => {
                const result = collections.filter((p) => {
                    if (severity) {
                        return (p.severity >= severity &&
                                p.location.description.includes(keyword));
                    } else {
                        return p.location.description.includes(keyword);
                    }
                });
                ret.push(result.length);
            });
            return ret;
        } catch (e) {
            console.error(e);
            return null;
        }
    },
};

export default Query;
