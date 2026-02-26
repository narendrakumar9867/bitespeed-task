import { createPrimaryContact, createSecondaryContact, findContactByEmailorPhone, getAllLinkedContacts, updateContactToSecondary } from "../services/contact.service.js";


export const identifyContact = async (req, res) => {
    try {
        const { email, phoneNumber} = req.body;

        if (!email && !phoneNumber) {
            return res.status(400).json({
                message: "email or phonenumber is required"
            });
        }

        const matchedContacts = await findContactByEmailorPhone(email, phoneNumber);

        if (matchedContacts.length === 0) {
            const newContact = await createPrimaryContact(email, phoneNumber);
            return res.status(200).json({
                contact: {
                    primaryContactId: newContact.id,
                    emails: newContact.email ? [newContact.email] : [],
                    phoneNumber: newContact.phoneNumber ? [newContact.phoneNumber] : [],
                    secondaryContactIds: [],
                }
            });
        }

        let primaryContacts = matchedContacts.filter(
            (c) => c.link_precedence === "primary"
        );

        if (primaryContacts.length > 1) {
            primaryContacts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            const oldestPrimary = primaryContacts[0];

            for (let i = 1; i < primaryContacts.length; i++) {
                await updateContactToSecondary(primaryContacts[i].id, oldestPrimary.id);
            }
        }

        let primaryId;
        const anyPrimary = matchedContacts.find((c) => c.link_precedence === "primary");

        if (anyPrimary) {
            primaryId = anyPrimary.id;
        } else {
            primaryId = matchedContacts[0].linked_id;
        }

        const allLinked = await getAllLinkedContacts(primaryId);

        const existingEmails = allLinked.map((c) => c.email).filter(Boolean);
        const existingPhones = allLinked.map((c) => c.phone_number).filter(Boolean);
        const isNewEmail = email && !existingEmails.includes(email);
        const isNewPhone = phoneNumber && !existingPhones.includes(phoneNumber);
        
        if (isNewEmail || isNewPhone) {
            await createSecondaryContact(email, phoneNumber, primaryId);
        }

        const finalContacts = await getAllLinkedContacts(primaryId);

        const primary = finalContacts.find((c) => c.id === primaryId);
        const secondaries = finalContacts.filter((c) => c.id !== primaryId);

        const emails = [
            primary.email,
            ...secondaries.map((c) => c.email),
        ].filter(Boolean).filter((v, i, arr) => arr.indexOf(v) === i);

        const phoneNumbers = [
            primary.phone_number,
            ...secondaries.map((c) => c.phone_number),
        ].filter(Boolean).filter((v, i, arr) => arr.indexOf(v) === i);

        const secondaryContactIds = secondaries.map((c) => c.id);

        return res.status(200).json({
            contact: {
                primaryContactId: primaryId,
                emails,
                phoneNumbers,
                secondaryContactIds,
            },
        });
    } catch (error) {
        console.log("error in identify contact controller", error);
        return res.status(500).json({
            message: "internal server error"
        });
    }
};
