import { SORT_ORDER } from "../constants/index.js";
const parseSortParams = (sortOrder) => {
    const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
    if (isKnownOrder) {
        return sortOrder;
    } return SORT_ORDER.ASC;

};
const parseSortBy = (sortBy) => {
    const keyOfContacts = ['_id','name', 'email', 'phoneNumber', 'isFavourite', 'contactType', 'createdAt', 'updatedAt'];
    if (keyOfContacts.includes(sortBy)) {
        return sortBy;
    }
    return '_id';
};
export const getSortParams = (query) => {
    const { sortBy, sortOrder } = query;
    const parsedSortBy = parseSortBy(sortBy);
    const parsedSortOrder = parseSortParams(sortOrder);
    return {
        sortBy: parsedSortBy,
        sortOrder: parsedSortOrder
    };
};
