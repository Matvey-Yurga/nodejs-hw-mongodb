import { StudentsCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
    const contacts = await StudentsCollection.find();
    return contacts;
};
export const getContactById = async (contactId) => {
    const contact = await StudentsCollection.findById(contactId);
    return contact;
};
