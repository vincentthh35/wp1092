import { gql } from '@apollo/client';

export const USER_SUBCRIPTION = gql`
    subscription user(
        $name: String!
    ) {
        user(
            name: $name
        ) {
            mutation
            chatBox {
                aUnreadB
                bUnreadA
                name
                messages {
                    sender {
                        name
                    }
                    body
                }
            }
            aUnreadB
            bUnreadA
            chatBoxName
            message {
                sender {
                    name
                }
                body
            }
        }
    }
`;
