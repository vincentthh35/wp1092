import { gql } from '@apollo/client';

export const PEOPLE_SUBSCRIPTION = gql`
    subscription people {
        people {
            name
            ssn
            severity
            location {
                name
                description
            }
        }
    }
`;
