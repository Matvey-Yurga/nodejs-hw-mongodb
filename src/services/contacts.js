import { StudentsCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
    const contacts = await StudentsCollection.find();
    return contacts;
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