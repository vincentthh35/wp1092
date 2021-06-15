import { gql } from '@apollo/client';

export const STATSCOUNT_QUERY = gql`
    query statsCount(
        $severity: Int
        $locationKeywords: [String]
    ) {
        statsCount(
            severity: $severity
            locationKeywords: $locationKeywords
        )
    }
`;
