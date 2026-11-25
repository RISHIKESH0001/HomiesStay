import { useCallback, useEffect, useState } from 'react';
import { FiMessageCircle, FiSend } from 'react-icons/fi';
import { getApiErrorMessage, getOwnerEnquiries, getOwnerEnquiryMessages, getStudentEnquiries, getStudentEnquiryMessages, replyToOwnerEnquiry, replyToStudentEnquiry } from '../services/api';

const EnquiryInbox = ({ role }) => {
	const isOwner = role === 'owner';
	const [enquiries, setEnquiries] = useState([]);
	const [selectedId, setSelectedId] = useState(null);
	const [messages, setMessages] = useState([]);
	const [draft, setDraft] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingMessages, setIsLoadingMessages] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [error, setError] = useState('');

	const loadEnquiries = useCallback(async () => {
		const page = isOwner ? await getOwnerEnquiries({ page: 0, size: 50 }) : await getStudentEnquiries({ page: 0, size: 50 });
		setEnquiries(page.content);
		setSelectedId((current) => current && page.content.some((item) => item.id === current) ? current : page.content[0]?.id ?? null);
	}, [isOwner]);

	useEffect(() => {
		let isCurrent = true;
		(isOwner ? getOwnerEnquiries({ page: 0, size: 50 }) : getStudentEnquiries({ page: 0, size: 50 }))
			.then((page) => {
				if (!isCurrent) return;
				setEnquiries(page.content);
				setSelectedId(page.content[0]?.id ?? null);
			})
			.catch((requestError) => { if (isCurrent) setError(getApiErrorMessage(requestError, 'Unable to load conversations.')); })
			.finally(() => { if (isCurrent) setIsLoading(false); });
		return () => { isCurrent = false; };
	}, [isOwner]);

	useEffect(() => {
		if (!selectedId) return undefined;
		let isCurrent = true;
		(isOwner ? getOwnerEnquiryMessages(selectedId) : getStudentEnquiryMessages(selectedId))
			.then((result) => { if (isCurrent) setMessages(result); })
			.catch((requestError) => { if (isCurrent) setError(getApiErrorMessage(requestError, 'Unable to load this conversation.')); })
			.finally(() => { if (isCurrent) setIsLoadingMessages(false); });
		return () => { isCurrent = false; };
	}, [isOwner, selectedId]);

	const sendMessage = async (event) => {
		event.preventDefault();
		const message = draft.trim();
		if (!message || !selectedId || isSending) return;
		setIsSending(true);
		setError('');
		try {
			const sent = isOwner ? await replyToOwnerEnquiry(selectedId, message) : await replyToStudentEnquiry(selectedId, message);
			setMessages((current) => [...current, sent]);
			setDraft('');
			await loadEnquiries();
		} catch (requestError) {
			setError(getApiErrorMessage(requestError, 'Message could not be sent. Please try again.'));
		} finally {
			setIsSending(false);
		}
	};

	const selected = enquiries.find((enquiry) => enquiry.id === selectedId);
	return (
		<section className="enquiry-inbox" aria-label={`${role} enquiry inbox`}>
			{error && <p className="enquiry-error" role="alert">{error}</p>}
			{isLoading ? <p role="status">Loading conversations…</p> : enquiries.length === 0 ? <div className="student-applications-empty"><span><FiMessageCircle /></span><p className="dashboard-eyebrow">{isOwner ? 'Owner inbox' : 'Your conversations'}</p><h2>No conversations yet.</h2><p>{isOwner ? 'Student questions about your approved listings will appear here.' : 'Send an enquiry from an approved listing to start a conversation with its owner.'}</p></div> : <div className="enquiry-inbox-grid">
				<aside className="enquiry-list" aria-label="Conversations">
					{enquiries.map((enquiry) => <button key={enquiry.id} type="button" className={`enquiry-list-item${selectedId === enquiry.id ? ' active' : ''}`} onClick={() => { setSelectedId(enquiry.id); setMessages([]); setIsLoadingMessages(true); }}><strong>{enquiry.propertyName}</strong><span>{enquiry.participantName}</span><small>{enquiry.updatedAt ? new Date(enquiry.updatedAt).toLocaleString() : 'New conversation'}</small></button>)}
				</aside>
				<div className="enquiry-conversation">
					{selected && <header><div><p className="dashboard-eyebrow">{selected.participantName}</p><h2>{selected.propertyName}</h2></div><a href={`/hostels/${selected.propertySlug}`}>View listing</a></header>}
					<div className="enquiry-messages" aria-live="polite">
						{isLoadingMessages ? <p role="status">Loading messages…</p> : messages.map((item) => <article key={item.id} className={`enquiry-message${item.senderRole.toLowerCase() === role ? ' own' : ''}`}><div><strong>{item.senderName}</strong><time>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</time></div><p>{item.message}</p></article>)}
					</div>
					<form className="enquiry-reply-form" onSubmit={sendMessage}><label className="sr-only" htmlFor="enquiry-reply">Your message</label><textarea id="enquiry-reply" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={2000} required placeholder="Write a message…" /><button type="submit" disabled={!draft.trim() || isSending || !selectedId}><FiSend aria-hidden="true" /> {isSending ? 'Sending…' : 'Send'}</button></form>
				</div>
			</div>}
		</section>
	);
};

export default EnquiryInbox;
