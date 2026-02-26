
export const validateIdentifyRequest = (req, res, next) => {
    const { email, phoneNumber} = req.body;

    if(email === undefined && phoneNumber === undefined) {
        return res.status(400).json({
            message: "email or phone number is required"
        });
    }

    if (email !== null && email !== undefined) {
        const atIndex = email.indexOf("@");
        const dotIndex = email.lastIndexOf(".");

        if (atIndex < 1 || dotIndex < atIndex + 2 || dotIndex === email.length - 1) {
            return res.status(400).json({
                message: "invalid email format"
            });
        }
    }

    if (phoneNumber !== null && phoneNumber !== undefined) {
        const phone = String(phoneNumber);
        let isValid = phone.length > 0;

        for(let i = 0; i < phone.length; i++) {
            const code = phone.charCodeAt(i);
            if (code < 48 || code > 57) {
                isValid = false;
                break;
            }
        }

        if (!isValid) {
            return res.status(400).json({
                message: "invalid phone number format"
            });
        }
    }
    next();
}
