import { getApplications } from './applicationStorage';

export const adminUsers = [
	{ id: 'riya-shah', name: 'Riya Shah', role: 'Owner', school: 'Bengaluru', email: 'riya.shah@example.com', phone: '+91 98765 43210', initials: 'RS', status: 'Verified', joined: '12 May 2025', properties: ['The Olive House', 'Casa Nook', 'Mango Tree Living'] },
	{ id: 'ananya-rao', name: 'Ananya Rao', role: 'Owner', school: 'Bengaluru', email: 'ananya.rao@example.com', phone: '+91 98765 43211', initials: 'AR', status: 'Verified', joined: '08 June 2025', properties: ['Urban Nest Residency'] },
	{ id: 'karan-malhotra', name: 'Karan Malhotra', role: 'Owner', school: 'Bengaluru', email: 'karan.malhotra@example.com', phone: '+91 98765 43212', initials: 'KM', status: 'Verified', joined: '23 July 2025', properties: ['Urban Nest Residency'] },
	{ id: 'rhea-kapoor', name: 'Rhea Kapoor', role: 'Student', school: 'Christ University', email: 'rhea.kapoor@example.com', phone: '+91 98765 43213', initials: 'RK', status: 'Active', joined: '14 August 2025', course: 'BBA, 2nd year' },
	{ id: 'vihaan-sharma', name: 'Vihaan Sharma', role: 'Student', school: 'BMS College', email: 'vihaan.sharma@example.com', phone: '+91 98765 43214', initials: 'VS', status: 'Pending', joined: '02 September 2025', course: 'Computer Science, 1st year' },
];

export const studentApplications = [
	{ id: 'aarav-mehta', name: 'Aarav Mehta', property: 'The Olive House', course: 'Christ University · BBA, 2nd year', moveIn: '1 October 2026', room: 'Private room', initials: 'AM', status: 'New', email: 'aarav.mehta@example.com', phone: '+91 98765 43101', city: 'Bengaluru', age: 20, about: 'Looking for a quiet, furnished room near campus for the academic year.' },
	{ id: 'nisha-kapoor', name: 'Nisha Kapoor', property: 'Casa Nook', course: 'Christ University · Psychology, 1st year', moveIn: '15 October 2026', room: 'Shared room', initials: 'NK', status: 'New', email: 'nisha.kapoor@example.com', phone: '+91 98765 43102', city: 'Bengaluru', age: 19, about: 'Prefers a shared room with a study-friendly environment and laundry access.' },
	{ id: 'kabir-rao', name: 'Kabir Rao', property: 'Mango Tree Living', course: 'Christ University · B.Com, 3rd year', moveIn: '1 November 2026', room: 'Private room', initials: 'KR', status: 'Shortlisted', email: 'kabir.rao@example.com', phone: '+91 98765 43103', city: 'Bengaluru', age: 21, about: 'Interested in a private room close to public transport and campus.' },
	{ id: 'meera-das', name: 'Meera Das', property: 'The Olive House', course: 'Christ University · Law, 2nd year', moveIn: '20 October 2026', room: 'Shared room', initials: 'MD', status: 'Review', email: 'meera.das@example.com', phone: '+91 98765 43104', city: 'Kolkata', age: 20, about: 'Seeking a safe, well-connected shared stay with common study areas.' },
];

export const getAdminUser = (id) => adminUsers.find((user) => user.id === id);

export const getStudentApplication = (id) => getApplications(studentApplications).find((application) => application.id === id);