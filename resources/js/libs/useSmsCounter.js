import { useState, useEffect } from 'react';

const turkishChars = 'ŞşÇçĞğİı';

const countSMSChars = (message) => {
    let charCount = message.length;
    let smsCount = 0;
    let isTurkish = false;

    // Türkçe karakter kontrolü
    for (let char of message) {
        if (turkishChars.includes(char)) {
            isTurkish = true;
            charCount++;
        }
    }

    // Operatör kodu eklenmesi
    charCount += 5;

    // SMS sayısı hesaplama
    if (isTurkish) {
        if (charCount <= 155) {
            smsCount = 1;
        } else if (charCount <= 293) {
            smsCount = 2;
        } else if (charCount <= 440) {
            smsCount = 3;
        } else if (charCount <= 587) {
            smsCount = 4;
        } else if (charCount <= 735) {
            smsCount = 5;
        } else {
            smsCount = Math.ceil((charCount - 735) / 147) + 5;
        }
    } else {
        if (charCount <= 160) {
            smsCount = 1;
        } else if (charCount <= 306) {
            smsCount = 2;
        } else if (charCount <= 459) {
            smsCount = 3;
        } else if (charCount <= 612) {
            smsCount = 4;
        } else if (charCount <= 765) {
            smsCount = 5;
        } else {
            smsCount = Math.ceil((charCount - 765) / 153) + 5;
        }
    }

    return { charCount, smsCount };
};

const useSmsCounter = (initialMessage = '') => {
    const [message, setMessage] = useState(initialMessage);
    const [charCount, setCharCount] = useState(0);
    const [smsCount, setSmsCount] = useState(1);

    useEffect(() => {
        const result = countSMSChars(message);
        setCharCount(result.charCount);
        setSmsCount(result.smsCount);
    }, [message]);

    return { message, setMessage, charCount, smsCount };
};

export default useSmsCounter;
