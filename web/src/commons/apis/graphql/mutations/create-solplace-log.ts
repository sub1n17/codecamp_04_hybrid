import { gql } from '@apollo/client';

export const CREATE_SOLPLACE_LOG = gql`
    mutation createSolplaceLog($createSolplaceLogInput: CreateSolplaceLogInput!) {
        createSolplaceLog(createSolplaceLogInput: $createSolplaceLogInput) {
            id
            title
            contents
            address
            lat
            lng
            addressCity
            addressTown
            images
            userId
        }
    }
`;
