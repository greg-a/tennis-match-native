import moment from 'moment';

export const handleTimeStamp = date => {
    const today = new Date();
    if (moment(date).format('MMDDYYYY') === moment(today).format('MMDDYYYY')) {
        return `Today ${moment(date).format('h:mm A')}`
    }
    else {
        return moment(date).format('M/DD/YY')
    };
};