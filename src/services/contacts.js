import { SORT_ORDER } from '../constants/index.js';
import { StudentsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({ page = 1, perPage= 10, sortBy= "_id", sortOrder= SORT_ORDER.ASC }) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;
    const contactsQuery = StudentsCollection.find();
  const studentsCount = await StudentsCollection.find()
    .merge(contactsQuery)
        .countDocuments();
    const contacts = await contactsQuery.skip(skip).limit(limit).sort({[sortBy]: sortOrder}).exec();
    const paginationData = calculatePaginationData(studentsCount, page, perPage);
    return {
        data: contacts,
        ...paginationData,
    };
};
export const getContactById = async (contactId) => {
    const contact = await StudentsCollection.findById(contactId);
    return contact;
};
export const createContact = async (payload) => {
    const contact = await StudentsCollection.create(payload);
    return contact;
};
export const updateContact = async (contactId, payload) => {
    const result = await StudentsCollection.findByIdAndUpdate(contactId, payload, { new: true });
    return result;
};
export const deleteContact = async (contactId) => {
    const result = await StudentsCollection.findByIdAndDelete(contactId);
    return result;
};
