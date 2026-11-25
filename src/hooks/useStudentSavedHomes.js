import { useCallback, useEffect, useState } from 'react';
import { getApiErrorMessage, getStudentSavedHomes, removeStudentSavedHome, saveStudentHome } from '../services/api';
import { toPublicHostel } from '../services/propertyCatalog';

const PAGE_SIZE = 50;

const useStudentSavedHomes = () => {
	const [savedHomes, setSavedHomes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState('');
	const [actionMessage, setActionMessage] = useState('');
	const [savingIds, setSavingIds] = useState([]);

	useEffect(() => {
		let isCurrent = true;
		getStudentSavedHomes({ page: 0, size: PAGE_SIZE })
			.then((page) => {
				if (isCurrent) {
					setSavedHomes(page.content.map(toPublicHostel));
					setLoadError('');
				}
			})
			.catch((error) => {
				if (isCurrent) setLoadError(getApiErrorMessage(error, 'Saved homes are temporarily unavailable.'));
			})
			.finally(() => { if (isCurrent) setIsLoading(false); });
		return () => { isCurrent = false; };
	}, []);

	const toggleSavedHome = useCallback(async (property) => {
		const propertyId = String(property.id);
		if (savingIds.includes(propertyId)) return;
		const wasSaved = savedHomes.some((home) => String(home.id) === propertyId);
		setSavingIds((current) => [...current, propertyId]);
		setActionMessage('');
		try {
			if (wasSaved) {
				await removeStudentSavedHome(property.id);
				setSavedHomes((current) => current.filter((home) => String(home.id) !== propertyId));
				setActionMessage(`${property.name} removed from saved homes.`);
			} else {
				await saveStudentHome(property.id);
				setSavedHomes((current) => [property, ...current.filter((home) => String(home.id) !== propertyId)]);
				setActionMessage(`${property.name} added to saved homes.`);
			}
		} catch (error) {
			setActionMessage(getApiErrorMessage(error, 'Could not update saved homes. Please try again.'));
		} finally {
			setSavingIds((current) => current.filter((id) => id !== propertyId));
		}
	}, [savedHomes, savingIds]);

	const isSaved = useCallback((propertyId) => savedHomes.some((home) => String(home.id) === String(propertyId)), [savedHomes]);
	const isSaving = useCallback((propertyId) => savingIds.includes(String(propertyId)), [savingIds]);

	return { savedHomes, isLoading, loadError, actionMessage, isSaved, isSaving, toggleSavedHome };
};

export default useStudentSavedHomes;
