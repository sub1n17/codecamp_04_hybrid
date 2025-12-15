declare module 'apollo-upload-client' {
    import { ApolloLink } from '@apollo/client';

    export function createUploadLink(options: { uri?: string; credentials?: string }): ApolloLink;
}
