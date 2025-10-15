import { SORT_ORDER } from '../constants/index.js';
import { StudentsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({ page = 1, perPage= 10, sortBy= "_id", sortOrder= SORT_ORDER.ASC, userId }) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;
    const contactsQuery = StudentsCollection.find({userId});
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
export const getContactById = async (contactId,userId) => {
    const contact = await StudentsCollection.findOne({ _id: contactId,userId });
    return contact;
};
export const createContact = async (payload) => {
    const contact = await StudentsCollection.create(payload);
    return contact;
};
export const updateContact = async (contactId, payload,userId) => {
    const result = await StudentsCollection.findOneAndUpdate({ _id: contactId, userId}, payload, { new: true });
    return result;
};
export const deleteContact = async (contactId,userId) => {
    const result = await StudentsCollection.findOneAndDelete({_id: contactId , userId});
    return result;
};
