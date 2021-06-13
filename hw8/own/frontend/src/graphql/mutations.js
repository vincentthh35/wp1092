import { gql } from '@apollo/client';

export const CREATE_CHATBOX_MUTATION = gql`
    mutation createChatBox(
        $name1: String!
        $name2: String!
    ) {
        createChatBox(
            name1: $name1
            name2: $name2
        ) {
            name
            messages {
                sender {
                    name
                }
                body
            }
        }
    }
`;

export const APPEND_CHATBOX_MUTATION = gql`
    mutation appendChatBoxToUser(
        $chatBoxName: String!
        $name: String!
    ) {
        appendChatBoxToUser(
            chatBoxName: $chatBoxName
            name: $name
        ) {
            name
        }
    }
`;

export const CREATE_USER_MUTATION = gql`
    mutation createUser(
        $name: String!
    ) {
        createUser(
            name: $name
        ) {
            name
            chatBoxes {
                name
            }
        }
    }
`;

export const APPEND_MESSAGE_MUTATION = gql`
    mutation appendMessage(
        $name: String!
        $to: String!
        $body: String!
    ) {
        appendMessage(
            name: $name
            to: $to
            body: $body
        ) {
            messages {
                sender {
                    name
                }
                body
            }
        }
    }
`;

export const READ_CHATBOX_MUTATION = gql`
    mutation readChatBox(
        $name: String!
        $chatBoxName: String!
    ) {
        readChatBox(
            name: $name
            chatBoxName: $chatBoxName
        )
    }
`;

export const REMOVE_CHATBOX_MUTATION = gql`
    mutation removeChatBoxFromUser(
        $name: String!
        $chatBoxName: String!
    ) {
        removeChatBoxFromUser(
            name: $name
            chatBoxName: $chatBoxName
        ) {
            name
        }
    }
`;
