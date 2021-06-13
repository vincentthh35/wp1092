import { gql } from '@apollo/client';

export const MESSAGES_QUERY = gql`
    query messages(
        $chatBoxName: String!
    ) {
        messages(
            chatBoxName: $chatBoxName
        ) {
            sender {
                name
            }
            body
        }
    }
`;

export const USER_QUERY = gql`
    query user(
        $name: String!
    ) {
        user(
            name: $name
        ) {
            name
            chatBoxes {
                name
                aUnreadB
                bUnreadA
                messages {
                    sender {
                        name
                    }
                    body
                }
            }
        }
    }
`;
