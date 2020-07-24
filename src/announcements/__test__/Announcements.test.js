import Announcements from '../Announcements';

test('Announcements page state messages array should be empty', () => {
    expect(new Announcements().state).toEqual({messages: []});
});